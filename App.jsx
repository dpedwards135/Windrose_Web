import React from "react";
import * as firebase from "firebase";
import { getModelClassList, saveModelClassItem } from "./components/FirebaseHelper";

import { DbObjectView } from "./components/DbObjectView";

//const App = React.createClass({

var config = {
    apiKey: "AIzaSyBMi8ELYYkqTe2obYAzpNIZh7mNuD7SyA8",
    authDomain: "windrose-739d4.firebaseapp.com",
    databaseURL: "https://windrose-739d4.firebaseio.com",
    storageBucket: "windrose-739d4.appspot.com"
};

var database;

firebase.initializeApp(config);
console.log("Initializing Firebase");

class App extends React.Component {

    //Editable and ReadOnly screens will take a DBObject and render a form same as Mobile


    constructor(props) {
        super(props);
        this.state = {
            classList: ["Avocados", "Tulips"],
            companyId: "",
            userEmail: "0",
            formType: 0,
            typeOrItem: 0,
            wModelClass: "0",
            selectedItem: "1",
            selectedObject: {}
        };
        this.openDbObject = this.openDbObject.bind(this);
        this.signIn = this.signIn.bind(this);
        this.getModelClassList = getModelClassList.bind(this);
        this.saveModelClassItem = saveModelClassItem.bind(this);
    }

    signIn(userName) {
        console.log("Sign In: " + firebase.User.userName);
        this.setState({ userEmail: userName });
        this.getModelClassList((list) => {
            this.setState( { classList: list });
        }
        );
    }


    openDbObject(formNumber, selectedObject) {
        console.log("openDbObject " + selectedObject);
        this.setState({
            formType: formNumber,
            selectedItem: selectedObject
        });

        return;
    }

    renderAssets() {
        return this.props.assets.map(asset => (
            <tr>
                <td>{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.type}</td>
                <td>{asset.category}</td>
                <td>
                    <Button1 name="Edit" onClick={this.openDbObject} selectedObject={asset.id} />
                    <Button1 name="View" onClick={this.openDbObject} selectedObject={asset.id} />
                </td>
            </tr>
        ))
    }

    render() {
        console.log("Rendering App");
        if (this.state.userEmail === "0") {
            return (
                <SignInForm onSubmit={this.signIn} />
            );

        }
        if (this.state.formType === 0) {
            console.log("list" + JSON.stringify(this.state));
            return (
                <div>
                    <Header name={this.state.userEmail} />
                    <Selector onChange={this.openDbObject} list={this.state.classList} />
                    <form>
                        <input type="text" id="newClassInput" />
                        <input type="button" value="Add New Model Class" onClick={() =>
                            this.saveModelClassItem(document.getElementById("newClassInput").value)} />
                    </form>
                    <br />
                    <Button1 name="New" onClick={this.openDbObject} selectedObject="0" />
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderAssets()}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.state.formType === 1) {
            return (
                <div>
                    <h1>ReadOnly Form</h1>
                    <DbObjectView
                        selectedObject={this.state.selectedItem}
                        editable="false"
                    />
                </div>
            );
        } else if (this.state.formType === 2) {
            return (
                <div>
                    <h1>Editable Form {this.state.selectedItem}</h1>
                    <DbObjectView
                        selectedObject={this.state.selectedItem}
                        editable="true"
                    />
                </div>
            );
        }
    }
}


export { App };

class Header extends React.Component {
    render() {
        return (
            <div>
                <h1>Windrose</h1>
                <h2>{this.props.name}</h2>
            </div>
        );
    }
}

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log("OnChange");
        const itemOrType = e.target.value;
        this.props.onChange(2);
    }

    render() {
        return (
            <select onChange={this.handleChange}>
                {this.props.list.map((item, i) => {
                console.log('test');
                return <option>{item}</option>})}
            </select>
        );
    }
}

class Button1 extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log("OnChange: " + this.props.selectedObject);
        const itemOrType = e.target.value;
        if (this.props.name === "Edit") {
            this.props.onClick(2, this.props.selectedObject);
        } else if (this.props.name === "View") {
            this.props.onClick(1, this.props.selectedObject);
        } else {
            this.props.onClick(2, "contract");
        }
    }
    render() {
        return (
            <button onClick={this.handleChange}>{this.props.name}</button>
        );
    }
}



class SignInForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event) {
        console.log(this.state.value);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user.uid);
                /*
                var database = firebase.database();
                database.ref('usersTest/').set({
                    username: "Bananas"
                });
                */
            }
        });
        console.log("Submit");
        firebase.auth().signInWithEmailAndPassword(this.state.value, this.state.password)
            .then(this.props.onSubmit(this.state.value))
            .catch(function (error) {
                var errorMessage = error.message;
                console.log("" + errorMessage);
            });

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <label>
                    Password:
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}


/*
    Next: 
    X Add Buttons to table for editing and viewing
    X Add Selector for Items and Types
    Add Selector for Subgroups -
        Types - All types, sorted under Classes (All VehicleTypes under VehicleTypes, etc)
        Items - Same thing, but showing actual items (objects)
        Need to pull types and items to populate the selector
    Set up Edit and View buttons to show a popup
    Set up popup to take the object and create form, view or edit (Just like mobile)
    Set up popup to show wizard for creating new types (Do this with cloud functions ->
        request wizard and return JSX or whatever based on Type requested)
*/