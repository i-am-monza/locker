import React from 'react';
// Import the NavLink component from the react-router-dom library
import { NavLink } from 'react-router-dom';
// Import the styles used by this component
import './Menu.css';

/*A styling object. This is to make a certain link dissapear if its the active link*/
const visible = {display: 'none'};

/*A functional component that acts as a navigation bar. This navigator is to appear regardsless of the component being rendered*/
export const Menu = () =>
	{
		return (
			<div>
				<nav className="navbar">
					<ul>
						{/* activeStyle styles the active link using the visible object variable*/}
						<NavLink to='/Home' activeStyle={visible}>
							<li>Home</li>
						</NavLink>
						<NavLink to='/Calculator' activeStyle={visible}>
							<li>Calculator</li>
						</NavLink>
						<NavLink to='/Weather' activeStyle={visible}>
							<li>Weather</li>
						</NavLink>
						<NavLink to='/Itunes' activeStyle={visible}>
							<li>Search iTunes</li>
						</NavLink>
						<NavLink to='/Shop' activeStyle={visible}>
							<li>Hub</li>
						</NavLink>
						<NavLink to='/Help' activeStyle={visible}>
							<li>Help</li>
						</NavLink>
					</ul>
				</nav>
			</div>
		);
	}