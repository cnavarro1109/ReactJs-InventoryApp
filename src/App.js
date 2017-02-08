import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Table } from 'react-bootstrap'

//Firebase dependencies
var uuid = require('uuid');
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBW6HNzdnMv7uvHV670hzs1AYxyBeRXF_g",
    authDomain: "inventoryapp-bace2.firebaseapp.com",
    databaseURL: "https://inventoryapp-bace2.firebaseio.com",
    storageBucket: "inventoryapp-bace2.appspot.com",
    messagingSenderId: "584481905960"
  };
  firebase.initializeApp(config);



class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      inventory: [],
      submitted: false
    }

  }

  componentDidMount(){
     this._loadFirebaseData();
  }

   //Loading the data from firebase
   _loadFirebaseData(){
        var self = this;

        this.setState({ inventory: [] });

        //Getting data from firebase
        firebase.database().ref().once('value').then((snapshot) => {
          snapshot.forEach(function(data){
            self.setState({
              inventory: self.state.inventory.concat(data.val())
            });
          });
        });
      
    }

   _handleClick(event) {
    event.preventDefault()
    console.log(event.target.value);
    //Remove one element
    var uuid = event.target.value
    firebase.database().ref().child('inventoryapp/' + uuid).remove();

    //Reload the data
    this._loadFirebaseData();
  }

  render() {
    var inputForm;
    var table;
    var rows;

    inputForm = <span>
      <h2>Please enter your inventory Item</h2>
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type="text" placeholder="Enter Name..." name="name" />
        <input type="text" placeholder="Enter description..." name="description" />
        <input type="text" placeholder="Enter quantity..." name="quantity" />
        <button type="submit">Submit</button>
      </form>
    </span>

    
    var self = this;
    rows = this.state.inventory.map(function (item,index) {
        //console.log(JSON.stringify(item));
      return Object.keys(item).map(function(s){ 
          //console.log("ITEM:" + item[s].name)
          //console.log("ITEM:" + item[s].inventory.name) 
          return (
          //<tr key={index}>
          <tr key={s}>
            <th> {item[s].inventory.name} </th>
            <th> {item[s].inventory.description} </th>
            <th> {item[s].inventory.quantity} </th>
            <th><button value={item[s].inventory.uuid} onClick={self._handleClick.bind(self)}>Delete</button>  </th>
          </tr>
        )
      });
      
        
      });

      table = (
        <span>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th> Name </th>
                <th> Description </th>
                <th> Quantity </th>
                <th> Actions </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </span>
      )



    return (
      <div className="App">
        <div className="App-header">
          <h2>Inventory App</h2>
        </div>
        <div className="text-center">
          {inputForm}
          <br />
          {table}
        </div>
      </div>
    );
  }


  //Adding our function that will handle our form submit 
  onSubmit(event) {
    event.preventDefault();

    //Creating our initial variables
    const details = {}
    const id = uuid.v1(); //generating our unique key

    //Go through each element in the form making sure it's an input element
    event.target.childNodes.forEach(function (el) {
      if (el.tagName === 'INPUT') {
        details[el.name] = el.value
      } else {
        el.value = null
      }

      //Adding one more element uuid
      details['uuid'] = id; 

    })
    

    //Saving to firebase
    firebase.database().ref('inventoryapp/'+ id ).set({
      inventory: details
    });

    this.setState({
      submitted: true
    })

    this._loadFirebaseData();

  }

}

export default App;
