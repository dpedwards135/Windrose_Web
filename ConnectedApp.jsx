import {App} from "./App";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {
        assets: state.assets,
    }
}

const ConnectedApp = connect(mapStateToProps)(App);

export {ConnectedApp};
