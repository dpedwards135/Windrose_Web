import {createStore} from "redux";

const ADD_DUMMY_ASSET = "add_dummy_asset";

const INITIAL_STATE = {
    assets: [],
};

function reducer(oldState = INITIAL_STATE, action) {
    console.log("Reducer call");
    switch (action.type) {
        case ADD_DUMMY_ASSET:
            console.log("Adding dummy asset");
            const newState = {
                ...oldState,
                assets: oldState.assets.concat(action.asset),
            };
        
            return newState;
    } 
    return oldState;
}


export function vehicles() {
    return [
       {
            "id":12345,
            "name":"Truck 2 on client",
            "type":"Truck",
            "category":"Vehicle"
        },
        {
            "id":12346,
            "name":"Truck 2 on client",
            "type":"Truck",
            "category":"Vehicle"
        },
        {
            "id":12347,
            "name":"Truck 2 on client",
            "type":"Truck",
            "category":"Vehicle"
        }
    ];
}




const store = createStore(reducer, INITIAL_STATE);
export {store};