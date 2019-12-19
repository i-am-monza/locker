import React, {Component} from 'react';
// Import the styles for this Buttons component
import './Buttons.css';

// A class component that simply returns the <Button> components nested within it on the <App> component as its children
export default class Buttons extends Component {
  render() {
    return <div className="Buttons"> {this.props.children} </div>
  }
}
