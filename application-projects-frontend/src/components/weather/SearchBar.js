import React, {Component} from 'react';
// Import this components styles to be used in this file
import './SearchBar.css';

// A functional component that returns input elements to be rendered on the app
export default class SearchBar extends Component
{
	// A constructor for initializing variables
	constructor(props)
	{
		super(props);

		this.state = {city: ""}
	}

	// A function that saves the users typed input to state
	handler = e => {
		this.setState({city: e.target.value});
	}

	// A render method that returns information to be displayed on screen
	render()
	{
		return (
			<div className="row">
				<div id="searchBar" className="Col-sm-12">
					<input id="city" type="text" placeholder="City name..." onChange={(event) => this.handler(event)}/>
					<button id="search" className="submit" onClick={this.props.handler.bind(null, this.state)}>Search</button>
				</div>
			</div>
		);
	}
}