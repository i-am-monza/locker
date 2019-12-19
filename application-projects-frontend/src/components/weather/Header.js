import React from 'react';
// Import the styles used in this componentS
import './Header.css';

// Functional component that has static information; displaying app header with current date shown
const Header = props => {
	return (
		<div className="row">
			<div className="col-sm-12">
				<h1>Weather {props.date}</h1>
			</div>
		</div>
	);
}

// Export the functional component
export default Header;