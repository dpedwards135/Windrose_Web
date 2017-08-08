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
            displayObjectId: this.props.selectedObject,
            displayObject: { properties: ["1", "2"] },
            editable: this.props.editable,
            properties: ["3", "4"]
            //Put a proper Object in here to work with.
        };

        this.getFBObject = this.getFBObject.bind(this);

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
        this.getFBObject();
    }

    renderField(property  /* A property of DbObject */ ) {
        let field;
        switch (property[FORM_FIELD_TYPE]) {
            case EXCLUDE:
            field = <div>Excluded Field</div>;
            break;
            case CHECKBOX:
            field = <div>CheckBox</div>;
            break;
            case FINALIZE_BUTTONS:
            field = <div>FinalizeButtons</div>;
            break;
            case GEOSTOP:
            field = <div>GeoStop</div>;
            break;
            case SELECT_FROM:
            field = <div>SelectFrom</div>;
            break;
            case TEXT_EDIT:
            field = <div>TextEdit</div>;
            break;
            case TEXT_VIEW:
            field = <div>TextView</div>;
            break;
            default:
            field = <div>Default</div>;
            break;
        }

        return <div /*id={property[PROPERTY_NAME]}*/> {field} </div>;

    }


    render() {
        console.log("rendering dbObjectView");
        /*
            For Element in DBObject - get fieldType and add a cell based 
            on that fieldType
        */


        return (
            <div>
                DBObjectView {this.state.displayObjectId} {JSON.stringify(this.state.properties)}
                {this.state.properties = this.state.displayObject.properties}
                {this.state.properties.map(renderField)}
            </div>
        );
    }
}

export { DbObjectView };

/*
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

