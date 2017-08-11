import * as firebase from "firebase";

const modelClassKey = "";
const listType = "";
const baseDbString = "/v1/qa/model/";

function path(modelClassKey, listType, dbObjectId) {
    return baseDbString + modelClassKey + listType + "/" + dbObjectId;
}

function wUserString(userId) {
    return "user_id/" + userId;
}  

function getFBObject() {

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
                    
                }
                );
            return dbObject;
            });
        });
    }

    function saveFBObject(dbObject, listType) {

        console.log("SaveFBObject " + JSON.stringify(dbObject));
        var objectPath = path(dbObject.properties["wmodel_class"][this.DISPLAY_TEXT], listType, dbObject.uniqueID);
        var dbref = database.ref(objectPath);
        dbref.set(dbObject);

        console.log("3");
    }

    function getModelClassList(callback) {
        var path = baseDbString + "modelClassList";
        var database = firebase.database();
        var dbref = database.ref(path);
        var list = [];

          dbref.once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    list.push(childSnapshot.val());
                    console.log("Cycle");
                });
            console.log("FBH List: "+ list)
            callback(list);
            });


        /*
        dbref.once('value', (snapshot) => {
            var list = snapshot.val();
            console.log("List = " + list);
            return list;
        });
        */
    }

    function saveModelClassItem(item) {
        console.log("Item: " + item);
        var objectPath = baseDbString + "modelClassList";
        var database = firebase.database();
        var dbref = database.ref(objectPath);
        dbref.push(item);
    }


export {path, wUserString, getModelClassList, saveModelClassItem};