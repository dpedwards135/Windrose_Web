import React from 'react';
import {path, wUserString} from "./FirebaseHelper";
import * as firebase from "firebase";


class DbObjectView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayObjectId: this.props.selectedObject,
            displayObject: {},
            editable: this.props.editable
        };

        this.getFBObject = this.getFBObject.bind(this);

        this.getFBObject();
    }

    getFBObject() {

        /*
        Goal: Transform the object into something easily manipulated that can be reformed to DB later
        dbObject header will always be the same, but properties will be customized to the 
        formField to which it belongs.

        Break getFBObject into getFBObject, createClientObject, createDBObject for reformation,
        and postDBObject
        */

        const dbObject = {
            uniqueID: "",
            description: "",
            wModelClass: "",
            properties: {}
        };

        console.log("GetFBObject");
        var objectPath = path("company", 3, "contract/");
        console.log(objectPath);
        var database = firebase.database();
        var dbref = database.ref(objectPath);
        dbref.once('value').then(function(snapshot) {
            dbObject.uniqueID = snapshot.val().uniqueID;
            console.log(dbObject.uniqueID)
            dbObject.description = snapshot.val().description;
            console.log(dbObject.description);

            dbref.child("properties").once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    if(childSnapshot.key() === wmodel_class) {
                        dbObject.wModelClass = childSnapshot.val()[2];
                    } else {
                        
                        var propertyName = childSnapshot.val()[0];
                        var formFieldType = childSnapshot.val()[1];
                        var displayText = childSnapshot.val()[2];
                        var selectedValue = childSnapshot.val()[3];
                    }

                    console.log(childSnapshot.val().length);
                    console.log(childSnapshot.val()[0]);

                    

                    /*
                        public final static int PROPERTY_NAME = 0;
    public final static int FORM_FIELD_TYPE = 1;
    public final static int DISPLAY_TEXT = 2;
    public final static int SELECTED_VALUE = 3;
    public final static int CANCEL_BUTTON = 3;
    public final static int SAVE_BUTTON = 4;
    public final static int SUBMIT_BUTTON = 5;
                    */

                });
            });
        });
    }


    render() {
        /*
            For Element in DBObject - get fieldType and add a cell based 
            on that fieldType
        */


        return (
            <div>DBObjectView {this.state.displayObjectId}</div>
        );
    }
}

export { DbObjectView };