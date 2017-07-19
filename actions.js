const ADD_DUMMY_ASSET = "add_dummy_asset";

function addDummyAsset() {
    return {
        type: ADD_DUMMY_ASSET,
        asset: {
            "id":12345,
            "name":"Truck on client",
            "type":"Truck",
            "category":"Vehicle"
        }
    };
}

function addDummyAsset2() {
    console.log("Add Dummy Asset 2 call");
        return {
        type: ADD_DUMMY_ASSET,
        asset: {
            "id":12345,
            "name":"Truck 2 on client",
            "type":"Truck",
            "category":"Vehicle"
        }
    };
}

export {addDummyAsset, addDummyAsset2};

/*
    Actions:
    Show[Type]
    Steps:
    Populate the table with some dummy info (Only one table for now with everything)
    Add a drop down to select what to edit
    Add a + button to add new items
    Add View/Edit links to table
    Connect drop down to store to tell which queries
    Connect store to Firebase to pull data
    Create the appropriate popups to create and edit
    Create cloud functions for creating new Types from a wizard popup
    
*/