import React, {Component} from 'react';
// Import the styles for the Button component
import './Button.css';

// A class component for accessing props that will be used as button elements attributes, then returns the button element. Export the component at its declaration.
export default class Button extends Component {
  render() {
  	// A <button> element thats returned by this render method
    return (
      <button id="input-btn" onClick={this.props.onClick} data-size={this.props.size} data-value={this.props.value}>
        {this.props.label}
      </button>
    )
  }
}
