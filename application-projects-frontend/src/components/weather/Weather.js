import React, {Component} from 'react';
// Import the styles used in this component
import './Weather.css'
// Import the Header method to be rendered in this App component
import Header from './Header.js';
// Import the SerachBar componet
import SearchBar from './SearchBar.js';
// Import the Dashboard component
import Dashboard from './Dashboard.js';

// A class component exported at its declaration
export class Weather extends Component
{
  // A constructor for initializing variables
  constructor()
  {
    super();

    this.state = {city: "", dateStamp: ""};
  }

  // A lifecycle hook that fires a function that gets the current date
  componentWillMount()
  {
    this.dateNow();
  }

  // A function that gets the current date to be shown on app
  dateNow = () =>{
    let current = new Date();

    let date = current.getDate() + "-" + (current.getMonth() + 1) + "-" + String(current.getYear()).substring(1,3); 
    
    // Save the value of the current date to state
    this.setStamp(date);
  }

  // A function that saves the users searched cits to state
  handler = e => {
    this.setState({city: e.city});
  }

  // A function that saves the retrieved current date to state
  setStamp = stamp => {
    this.setState({dateStamp: stamp});
  }

  

  render()
  {
   
    return (
      <div className="Weather">
        {/*Render the imported components to be displayed on the page*/}
        <Header date={this.state.dateStamp}/>
        {/*Pass the handler function to SearchBar component so that it becomes a callback function*/}
        <SearchBar handler={this.handler.bind(this)}/>
        <Dashboard search={this.state}/>
      </div>
    );
  }
}