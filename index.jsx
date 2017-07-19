import ReactDom from "react-dom";
import {ConnectedApp} from "./ConnectedApp";
import React from "react";
import {store} from "./store";
import {addDummyAsset, addDummyAsset2} from "./actions";
import {Provider} from "react-redux";

ReactDom.render(<Provider store={store}><ConnectedApp /></Provider> , document.getElementById("app"));

store.dispatch(addDummyAsset2());