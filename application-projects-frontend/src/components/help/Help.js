import React from 'react';
// Import the styles used by this component
import './Help.css';
import Doc from './../../documents/help.pdf';

/*A functional component that returns information on elements to be rendered*/
export const Help = () => {
	// Return nested elements to be rendered
	return (
		<div id="help" className="help">
			<iframe src={Doc} title="Locker-help" type="textt/pdf" scrollable="true">
			</iframe>
		</div>
	);
};