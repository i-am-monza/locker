import React, {Component} from 'react';
// Import the evaluate function to evaluate mathematical expressions
import {evaluate} from 'mathjs';
// Import the styles for the App component
import './Calculator.css';
// Import the components that will be used in this file
import Display from './Display.js';
import Buttons from './Buttons.js';
import Button from './Button.js';

// Initialise an empty array
var newOperations = [];
// Get the element with class name Display
var display = document.getElementsByClassName("Display");

// Calculator application class component
export class Calculator extends Component 
{
	// Create a constructor for initialising variable
	constructor() {
	    super();
	    /*A state object with key oiperations. Operations keeps track of the buttons the user presses*/
	    this.state = { operations: [] };

	    /*Bind the instance of the calculateOperations function*/
	    this.calculateOperations = this.calculateOperations.bind(this);
	}

	/*An arrow function that handles the onclick events on the buttons*/
	handleClick = e => {
		/*Get the instance of the pressed button as this function's arguement so that we can get the value associated with the button*/
	    const value = e.target.getAttribute('data-value')
	    /*A switch case with that either executes certain code if the pressed button has value 'clear' or 'equal' or else updates the state object*/
	    switch (value) 
	    {
			case 'clear':
			{	/*Update the state by emptying the array*/
				this.setState({operations: []})
				/*Update the variable used to keep track of the data as well to be empty&*/
				newOperations = [];
				display.value = '';

				break;
			}
			case 'equal':
			{
				/*Execute the function that evaluates the expression entered by the user*/
				this.calculateOperations()
				break;
			}
			/*A default case that simply update the state object so that it keeps track of what the user pressed*/
			default:
			{
				let track = [];
				track.push(value);

				newOperations += ''.concat(track);
				
				this.setState({operations: newOperations})
				/*Make the variable that contain previously used data empty*/
				track = [];
				display.value = '';
				break;
			}
		}
    }

    /*A function that evaluate a mathematical expression*/
	calculateOperations() 
	{
		/*Convert the stored data from the state object to a single string*/
	    var result = ''.concat(this.state.operations);
	    /*A condition thats executed if the operations array was not empty*/
	    if (result) 
	    {
	    	// A try catch clause used to safeguired from non-mathematical expressions entered by the user
	    	try
	    	{	
	    		// A line that simply evaluates the entered expression by the user. Evaluate is a function imported from the mathjs library for evaluating mathematical expressions.
	      		result = evaluate(result);
	      	}
	      	// A catch clause thats thrown, with the exception as an arguement if the expression wasn't a valid math expression
	      	catch(e)
	      	{
	      		result = "Unable to evaluate expression. View error code -> " + e;
	      		/*Clear the variable with previously entered data*/
			    newOperations = [];
        		display.value = '';
	      	}

			//Change the result back to a string so that it can be appended on a html element
			result = String(result);
			this.setState({operations: [result]});
	    }
	}

	render()
	{
		/*
		The <div> with className=App is the entire app. It has a header that describes the app, it also has a <Display/> that responsible for outputting the user's interaction with the app and also for displaying the answer.
		The app also has a <Buttons/> component. This <Buttons/> component houses the individual <Button/> components that return <button> elements with specific attributes
		*/
		return (
	    	<div className="calculator">
	    		<div>
	    			<h3>Basic Calculator</h3>
		    		<Display data={this.state.operations} />
	    		</div>
	    		<Buttons>
		    		<table>
		    			<tbody>
		    				<tr>
		    					{/*Each button has an onClick event thats handled by the function handleClick, and a lebel attribute that describes what the button is for or its functionality and a value which is associated with the label*/}
		    					<td>
		    						<Button onClick={this.handleClick} label="C" value="clear" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="/" value="/" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="x" value="*" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="-" value="-" />
		    					</td>
		    				</tr>
		    				<tr>
		    					<td>
		    						<Button onClick={this.handleClick} label="7" value="7" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="8" value="8" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="9" value="9" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="+" size="2" value="+" />
		    					</td>
		    				</tr>
		    				<tr>
		    					<td>
		    						<Button onClick={this.handleClick} label="4" value="4" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="5" value="5" />
		    					</td>
		    					<td>	
		              				<Button onClick={this.handleClick} label="6" value="6" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="=" size="2" value="equal" />
		    					</td>
		    				</tr>
		    				<tr>
		    					<td>
		    						<Button onClick={this.handleClick} label="1" value="1" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="2" value="2" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="3" value="3" />
		    					</td>
		    					<td>
		    						<Button onClick={this.handleClick} label="0" value="0" />
		    					</td>
		    				</tr>
	    				</tbody>
		    		</table>
	            </Buttons>
			</div>
		 );
	}  
}