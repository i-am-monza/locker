import React, {Component} from 'react';
// Import the styles for this component
import './Display.css';

// A class component that returns an element to display the users interaction with the app
export default class Display extends Component {
  render() 
  {
  	// Convert the passed state array to a single string by using the concat(...) functuon
    const string = ''.concat(this.props.data);
    return (
    	<div className="display"> 
    		{string} 
    	</div>
    	);
  }
}