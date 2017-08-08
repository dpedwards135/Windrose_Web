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
                5: { 0: "finalize_buttons", 1: "2", 2: "Submit when finished: ", 3: "true", 4: "true", 5: "true" },
                6: { 0: "random_checkbox", 1: "1", 2: "Check something", 3: "true" },
                7: { 0: "random_SelectFrom", 1: "4", 2: "Select something", 3: "Grapefruit", 4: "Oranges", 5: "Grapefruit", 6: "Bananas", 7: "Apples" },
                "wmodel_class": { 0: "wmodel_class", 1: "0", 2: "company" }
            },

            displayObjectId: this.props.selectedObject,
            displayObject: { properties: ["1", "2"] },
            editable: this.props.editable,
            properties: ["3", "4"]
        };

        this.getFBObject = this.getFBObject.bind(this);
        this.renderField = this.renderField.bind(this);
    }

    getFBObject() {

        let dbObject = {
            uniqueID: "",
            description: "",
            properties: {}
        };

        console.log("GetFBObject");
        var objectPath = path("company", 3, "contract/");
        console.log(objectPath);
        var database = firebase.database();
        var dbref = database.ref(objectPath);
        dbref.once('value').then((snapshot) => {
            dbObject.uniqueID = snapshot.val().uniqueID;
            console.log(dbObject.uniqueID)
            dbObject.description = snapshot.val().description;
            console.log(dbObject.description);

            dbref.child("properties").once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    let newObject = {};
                    newObject["" + childSnapshot.key] = childSnapshot.val();
                    dbObject.properties[0].push(newObject);
                    //dbObject.properties["" + childSnapshot.key] = childSnapshot.val();
                    console.log("added property");
                }
                );

                console.log(JSON.stringify(dbObject));
                this.setState({ displayObject: dbObject });
                console.log("DisplayObject toString: " + JSON.stringify(this.state));
            });
        });
    }

    componentDidMount() {
        //this.getFBObject();
    }

    renderField() {
        let count = Object.keys(this.state.objectProperties).length;
        console.log("Count: " + count);
        let field;
        let fields = new Array();
        let counter = 1;
        while (counter < count) {

            console.log("Start loop " + counter);
            let property = this.state.objectProperties[counter];
            console.log(JSON.stringify(property));
            console.log("Value: " + property[this.FORM_FIELD_TYPE]);
            switch (Number.parseInt(property[this.FORM_FIELD_TYPE])) {

                case this.EXCLUDE:
                    field = <div>Excluded Field</div>;
                    break;
                case this.CHECKBOX:
                    field =
                        <div>
                            {property[this.DISPLAY_TEXT]}
                            <br />
                            <input type="checkbox" defaultChecked={property[this.SELECTED_VALUE]} />
                            <br />
                        </div>;
                    break;
                case this.FINALIZE_BUTTONS:
                    field = <div>FinalizeButtons</div>;
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
                        <select defaultValue={property[this.SELECTED_VALUE]} >
                            <option value="" disabled>Default Value</option>
                            {
                                options.map((option) => {
                                    console.log(option);
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
                            <input type="text" placeholder={property[this.SELECTED_VALUE]} />
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
            console.log("Added Field");
            counter++;
        }

        return <div> {fields} </div>;

    }


    render() {
        console.log("rendering dbObjectView");
        /*
            For Element in DBObject - get fieldType and add a cell based 
            on that fieldType
        */

        let fields = this.renderField();
        return (
            <div>
                DBObjectView {this.state.displayObjectId} {JSON.stringify(this.state.properties)}
                {this.state.properties = this.state.displayObject.properties}
                {fields}
            </div>
        );
    }
}

export { DbObjectView };

/*

Next: 
    1. Finish building formfields based on type
    2. Reconnect Firebase objects to UI
    3. Save values to state Object on Save or Submit
    4. Save DBObject to Firebase on Save or Submit

    What I want to do:
    Take a list of properties
    Render each property differently depending on FormField type
    Function takes a list of objects and returns JSX div with ID

    When submit is clicked it cycles through all the divs and takes the values and puts them
    into the DBObject based on div ID then sends that object to Firebase.

This works:
render() {
    let task;
    if (!apocalypse) {
      task = <div>Div 1</div>;
    } else {
      task = <div>Div 2</div>;
    }

    return task;
  }
*/

