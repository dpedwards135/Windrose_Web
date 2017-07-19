import React from "react";
import * as firebase from "firebase";

//const App = React.createClass({

var config = {
    apiKey: "AIzaSyBMi8ELYYkqTe2obYAzpNIZh7mNuD7SyA8",
    authDomain: "windrose-739d4.firebaseapp.com",
    databaseURL: "https://windrose-739d4.firebaseio.com",
    storageBucket: "windrose-739d4.appspot.com"
  };

firebase.initializeApp(config);
  console.log("Initializing Firebase");

class App extends React.Component {

//Editable and ReadOnly screens will take a DBObject and render a form same as Mobile


    constructor(props) {
        super(props);
        this.state = { 
            companyId: "",
            userId: "0",
            formType: 0,
            typeOrItem: 0,
            selectedItem: "1"
        };
        this.changeTableType = this.changeTableType.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    signIn(userName) {
        console.log("Sign In: " + firebase.User.userName);
        this.setState({userId: userName});
    }

    changeTableType(formNumber, selectedObject) {
        console.log("ChangeTableType " + selectedObject);
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
                    <Button1 name="Edit" onClick={this.changeTableType} selectedObject={asset.id}/>
                    <Button1 name="View" onClick={this.changeTableType} selectedObject={asset.id}/>
                </td>
            </tr>
        ))
    }

    render() {
        console.log("Rendering App");
        if(this.state.userId === "0") {
            return (
                <SignInForm onSubmit={this.signIn} />
            );

        }
        if(this.state.formType === 0) {
        return (
            <div>
            <Header />
            <Selector onChange={this.changeTableType} />
            <br />
            <Selector />
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
    } else if(this.state.formType === 1) {
        return (
            <div>
                <h1>ReadOnly Form</h1>
                <DbObjectView 
                    selectedObject={this.state.selectedItem}
                    editable="false"
                />
            </div>
        );
    } else if(this.state.formType === 2) {
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


export {App};

class Header extends React.Component {
    render() {
        return (
           <h1>Windrose</h1>
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
                <option>Types</option>
                <option>Items</option>
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
        if(this.props.name === "Edit") {
            this.props.onClick(2, this.props.selectedObject);
        } else {
            this.props.onClick(1, this.props.selectedObject);
        }
    }
    render() {
        return (
            <button onClick={this.handleChange}>{this.props.name}</button>
        );
    }
}

class DbObjectView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayObjectId: "",
            displayObject: {},
            editable: false
        };
        this.setState({ 
            displayObjectId: this.props.selectedObject,
            editable: this.props.editable
        });
        setDbObject(this.state.displayObject);
    }

    setDbObject(displayObjectId) {

    }

    render() {
        /*
            For Element in DBObject - get fieldType and add a cell based 
            on that fieldType
        */


        return (
            <div>DBObjectView</div>
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
        this.setState({value: event.target.value});
        console.log(this.state.value);
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

  handleSubmit(event) {
      console.log(this.state.value);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        console.log(user.uid);
        }
        });
    console.log("Submit");
    firebase.auth().signInWithEmailAndPassword(this.state.value, this.state.password)
        .then(this.props.onSubmit(this.state.value))
        .catch(function(error) {
            var errorMessage = error.message;
            console.log("" + errorMessage);
        });
    console.log(firebase.auth.userId);
    /*
    firebase.auth().signInWithEmailAndPassword(this.value, this.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // ...
    });
    */
    alert('A name was submitted: ' + firebase.auth.userId);
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