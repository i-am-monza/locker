import React from 'react';
// Import the styles used by this component
import './Home.css'
import Calculator from './../../images/calculator.png';
import Store from './../../images/store.png';
import Search from './../../images/search.png';

/*A functional component that returns information on elements to be rendered*/
export const Home = () => {
	// Return nested elements to be rendered
	return (
		<div id="home">
			<article id="calculator">
				<img id="calculatorImage" src={Calculator} alt="Calculator.png"/>
			</article>
			<article id="store">
				<img id="storeImage" src={Store} alt="Store.png"/>
			</article>
			<article id="search">
				<img id="searchImage" src={Search} alt="Search.png"/>
			</article>
		</div>
	);
};