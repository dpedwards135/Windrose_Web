import React from 'react';
import { path, wUserString } from "./FirebaseHelper";
import * as firebase from "firebase";




class DbObjectView extends React.Component {


    constructor(props) {
        super(props);
        this.EXCLUDE = 0;
        this.CHECKBOX = 1;
        this.FINALIZE_BUTTONS = 2;
        this.GEOSTOP = 3;
        this.SELECT_FROM = 4;
        this.TEXT_EDIT = 5;
        this.TEXT_VIEW = 6;

        this.PROPERTY_NAME = 0;
        this.FORM_FIELD_TYPE = 1;
        this.DISPLAY_TEXT = 2;
        this.SELECTED_VALUE = 3;
        this.CANCEL_BUTTON = 3;
        this.SAVE_BUTTON = 4;
        this.SUBMIT_BUTTON = 5;

        this.state = {

            objectDescription: "Object Description",
            objectUniqueId: "Unique ID",
            objectProperties: {
                1: { 0: "name", 1: "5", 2: "Company Name", 3: "Bob's Lumber", 4: "Company Name" },
                2: { 0: "phone", 1: "5", 2: "Phone Number", 3: "", 4: "Phone Number" },
                3: { 0: "address", 1: "6", 2: "Address", 3: "123 Lumber Yard Rd., Brookeville, WI", 4: "Address" },
                4: { 0: "email", 1: "5", 2: "Email Address", 3: "", 4: "Email Address" },
                7: { 0: "finalize_buttons", 1: "2", 2: "Submit when finished: ", 3: "false", 4: "true", 5: "false" },
                6: { 0: "random_checkbox", 1: "1", 2: "Check something", 3: "true" },
                5: { 0: "random_SelectFrom", 1: "4", 2: "Select something", 3: "Grapefruit", 4: "Oranges", 5: "Grapefruit", 6: "Bananas", 7: "Apples" },
                "wmodel_class": { 0: "wmodel_class", 1: "0", 2: "company" }
            },

            displayObjectId: this.props.selectedObject,
            editable: this.props.editable,
        };

        this.getFBObject = this.getFBObject.bind(this);
        this.renderField = this.renderField.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.saveFBObject = this.saveFBObject.bind(this);
    }

    getFBObject() {

        let dbObject = {
            uniqueID: "",
            description: "",
            properties: {}
        };

        console.log("GetFBObject");
        var objectPath = path("company", 3, "contract/");
        var database = firebase.database();
        var dbref = database.ref(objectPath);
        dbref.once('value').then((snapshot) => {
            dbObject.uniqueID = snapshot.val().uniqueID;
            dbObject.description = snapshot.val().description;

            dbref.child("properties").once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    let newObject = {};
                    newObject["" + childSnapshot.key] = childSnapshot.val();
                    dbObject.properties["" + childSnapshot.key] = (childSnapshot.val());
                    //dbObject.properties[0].push(newObject);
                    //dbObject.properties["" + childSnapshot.key] = childSnapshot.val();
                }
                );



                this.setState({
                    objectDescription: dbObject.description,
                    objectUniqueId: dbObject.uniqueID,
                    objectProperties: dbObject.properties,
                });
            });
        });
    }

    saveFBObject(listType) {

        let dbObject = {
            uniqueID: "",
            description: "",
            properties: {}
        };
        var database = firebase.database();

        dbObject.description = this.state.objectDescription;
        dbObject.properties = this.state.objectProperties;

        if (this.state.objectUniqueId === "contract") {
            var newObjectPath = path((dbObject.properties["wmodel_class"][this.DISPLAY_TEXT]), listType, "");
            var newObjectRef = database.ref(newObjectPath);
            
            var newPush = newObjectRef.push();
            var newObjectId = newPush.key;
            console.log(newObjectId);
            dbObject.uniqueID = newObjectId;
        } else {
            dbObject.uniqueID = this.state.objectUniqueId;
        }

        console.log("SaveFBObject " + JSON.stringify(dbObject));
        var objectPath = path(dbObject.properties["wmodel_class"][this.DISPLAY_TEXT], listType, dbObject.uniqueID);
        var dbref = database.ref(objectPath);
        dbref.set(dbObject);

        console.log("3");
    }

    componentDidMount() {
        this.getFBObject();
    }

    updateValue(evt) {
        var val;
        if (evt.target.type === "checkbox") { val = evt.target.checked } else { val = evt.target.value };
        var state = this.state;
        state.objectProperties[evt.target.name][this.SELECTED_VALUE] = val;
        this.setState(state);

    }

    renderField() {
        let count = Object.keys(this.state.objectProperties).length;
        let field;
        let fields = new Array();
        let counter = 1;
        while (counter < count) {

            let property = this.state.objectProperties[counter];

            if (this.state.editable === "false") {
                switch (Number.parseInt(property[this.FORM_FIELD_TYPE])) {

                    case this.EXCLUDE:
                        field = <div>Excluded Field</div>;
                        break;
                    case this.FINALIZE_BUTTONS:
                        field = <div></div>;
                        break;
                    case this.GEOSTOP:
                        field = <div>GeoStop</div>;
                        break;
                    case this.CHECKBOX:
                    case this.SELECT_FROM:
                    case this.TEXT_EDIT:
                    case this.TEXT_VIEW:
                        field =
                            <div>
                                {property[this.DISPLAY_TEXT]}:
                    <br />
                                <p>{property[this.SELECTED_VALUE]}</p>
                                <br />
                            </div>;
                        break;
                    default:
                        field = <div>DefaultDiv</div>;
                        break;
                }
                fields.push(field);
                counter++;
            } else {

                switch (Number.parseInt(property[this.FORM_FIELD_TYPE])) {

                    case this.EXCLUDE:
                        field = <div>Excluded Field</div>;
                        break;
                    case this.CHECKBOX:
                        field =
                            <div>
                                {property[this.DISPLAY_TEXT]}
                                <br />
                                <input type="checkbox" name={counter} defaultChecked={property[this.SELECTED_VALUE]} onChange={this.updateValue} />
                                <br />
                            </div>;
                        break;
                    case this.FINALIZE_BUTTONS:
                        let displaySubmit;
                        let displaySave;
                        let displayCancel;

                        field = <div>
                            {property[this.DISPLAY_TEXT]}
                            <input type="button" value="Submit" onClick={() => {this.saveFBObject(2)}} style={{ display: ((property[this.SUBMIT_BUTTON]) == "true") ? '' : 'none' }} 
                                 />
                            <input type="button" value="Save" style={{ display: ((property[this.SAVE_BUTTON]) == "true") ? '' : 'none' }} />
                            <input type="button" value="Cancel" style={{ display: ((property[this.CANCEL_BUTTON]) == "true") ? '' : 'none' }} />
                        </div>;
                        break;
                    case this.GEOSTOP:
                        field = <div>GeoStop</div>;
                        break;
                    case this.SELECT_FROM:
                        let options = [];
                        let optionsCounter = 4;
                        while (optionsCounter <= Object.keys(this.state.objectProperties).length) {
                            let newOption = property[optionsCounter];
                            options.push(newOption);
                            optionsCounter++;
                        }

                        field = <div>
                            {property[this.DISPLAY_TEXT]}
                            <br />
                            <select defaultValue={property[this.SELECTED_VALUE]} name={counter} onChange={this.updateValue}>
                                <option value="" disabled>Default Value</option>
                                {
                                    options.map((option) => {
                                        return <option>{option}</option>;
                                    })
                                }
                            </select>
                            <br />
                            <br />
                        </div>;
                        break;
                    case this.TEXT_EDIT:
                        field =
                            <div>
                                {property[this.DISPLAY_TEXT]}
                                <br />
                                <input type="text" name={counter} placeholder={property[this.SELECTED_VALUE]} onChange={this.updateValue} />
                                <br />
                                <br />
                            </div>;
                        break;
                    case this.TEXT_VIEW:
                        field =
                            <div>
                                {property[this.DISPLAY_TEXT]}:
                    <br />
                                <p>{property[this.SELECTED_VALUE]}</p>
                                <br />
                            </div>;
                        break;
                    default:
                        field = <div>DefaultDiv</div>;
                        break;
                }
                fields.push(field);
                counter++;
            }
        }

        return (
            <div>
                <form>
                    {fields}
                </form>
            </div>
        );
    }


    render() {
        /*
            For Element in DBObject - get fieldType and add a cell based 
            on that fieldType
        */

        let fields = this.renderField();
        return (
            <div>
                {fields}
            </div>
        );
    }
}

export { DbObjectView };

/*

Next: 
   X1. Finish building formfields based on type
    1.1 Separate Firebase functions into another component
    1.2 Separate Presentation components from logic components
   X2. Reconnect Firebase objects to UI
   X3. Save values to state Object on Save or Submit
   X4. Save DBObject to Firebase on Save or Submit

    5. Load a list of objects as requested from FB into app
    6. Pass unique ID to DbObjectView

    User story: User can select a type and "New" from app and create new object
*/

