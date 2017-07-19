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
        const dbObject = {
            uniqueID: "",
            description: "",
            properties: []
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
                    console.log(childSnapshot.val().length);
                    console.log(childSnapshot.val()[0]);
                });
            });
            /*
            for(var property in snapshot.val().properties) {
                for(var child in property) {
                    console.log(child.val());
                }
            }
            */
             
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