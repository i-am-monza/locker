import React, {Component} from 'react';
// Import the styles applied in this component
import './Dashboard.css';
// Import the svg images used in this component
import Clouds from './icons/animated/cloudy.svg';
import Clear from './icons/animated/day.svg';
import Sunny from './icons/animated/cloudy-day-1.svg';
import Drizzle from './icons/animated/weather.svg';
import Rain from './icons/animated/rainy-7.svg';
import Snow from './icons/animated/snowy-6.svg';
// Import Cities object for searching for a city

// A class component that inherits the properties of the Component class exported at its declaration
export default class Dashboard extends Component
{	
	// A constructor for initialising variable
	constructor(props)
	{
		super(props);

		this.state = {city: "", data: {}}
	}

	// A lifecycle hook fired everytime the state object is updated, i.e. a new search city is entered
	componentDidUpdate(prevProps)
	{
		if(prevProps.search.city !== this.state.city)
		{
			const key = process.env.REACT_APP_WEATHER_API;
			
			fetch("https://api.openweathermap.org/data/2.5/weather?q="+ this.props.search.city.replace(" ", "+") + "&appid=".concat(key))
				.then(response => response.json())
					.then(data =>  {
						this.setState({data: data});
					}, error => {
						console.log(error)
					});
		}
	}

	// A method that returns information to be used by classes that import this component
	render()
	{
		return (
			<div className="row">
				<div className="col-sm-12">
					{/*A conditional execution depending on the expression in round brackets*/}
					{(Object.keys(this.state.data).length !== 0) ? <Weather data={this.state.data} /> : <Warning city={this.state.city}/>}
				</div>
			</div>
		);
	}
}

// A functional component that displays the information of the searched city
const Weather = props => {

	// Default weather forcast values when application is opened
	let icon = Clouds;
	let name = "Default: Cape Town";
	let temp = "285.61";
	let pressure = "2021";
	let humidity = "44";
	let temp_min = "284.82";
	let temp_max = "287.04";
	let wind_speed = "3.1";

	// An if statement thats executed when user has searched something
	if(props.data.name !== undefined)
	{
		name = props.data.name;
		temp = props.data.main.temp;
		pressure = props.data.main.pressure;
		humidity = props.data.main.humidity;
		temp_min = props.data.main.temp_min;
		temp_max = props.data.main.temp_max;
		wind_speed = props.data.wind.speed;

		// A switch case for determine wich icon will be displayed depending on the retrieved information
		switch(props.data.weather[0].main.toLowerCase())
		{
			case 'clouds':
			{
				icon = Clouds;
				break;
			}
			case 'rain':
			{
				icon = Rain;
				break;
			}

			case 'sunny':
			{
				icon = Sunny
				break;
			}

			case 'snow':
			{
				icon = Snow;
				break;
			}

			case 'drizzle':
			{
				icon = Drizzle;
				break;
			}

			default:
			{
				icon = Clear;
				break;
			}
		}
	}
	
	// Returned information by this component to be rendered on the screen
	return (
		<div id="stage">
			<h1><i>{name}</i> Weather Forecast</h1>
			<article id="base">
				<div id="icon">
					<img src={icon} alt="Icon"/>
				</div>
				<div id="temp">
					<h1>{(Math.ceil((parseFloat(temp)-273.5)/10)*10)}&deg;C</h1>
				</div>
				<div id="pressure">
					<h1>Pressure: {parseFloat(pressure)/100}Pa</h1>
				</div>
				<div id="humidity">
					<h1>Humidity: {humidity}%</h1>
				</div>
			</article>
			<hr/>
			<article id="additional">
				<div id="temp-range">
					<h1>Low: {((Math.ceil(parseFloat(temp_min)-273.5)/10)*10)}&deg;C</h1>
					<h1>High: {((Math.ceil(parseFloat(temp_max)-273.5)/10)*10)}&deg;C</h1>
				</div>
				<div id="wind">
					<h1>Wind: {parseFloat(wind_speed)}km/h</h1>
				</div>
			</article>
		</div>
	);
}

// A component that is rendered if the searched city does not exist
const Warning = props => {
	return (
		<div id="message">
			<h1><u>{props.city}</u> not recognised</h1>
		</div>
	);
}
