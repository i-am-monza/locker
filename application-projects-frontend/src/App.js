// Import the React library
import React, { Component } from 'react';
// Import react-router library
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import './query/query.js';
// Import the components used in this application
import { Menu } from './components/menu/Menu.js';
import { Home } from './components/home/Home.js';
import { Calculator } from './components/calculator/Calculator.js';
import { Shop } from './components/store/Shop.js';
import { Itunes } from './components/search/Itunes.js';
import { Help } from './components/help/Help.js';
import { Weather } from './components/weather/Weather.js';
// Import CV document
import CV from './documents/cv.pdf';

// Front-end application parent component
export class Application extends Component {

  constructor(){
    super();

    this.state = {viewCV_action: "View CV"};
  }

  openCV = action => {
    switch(action)
    {
      case 'View CV':
      {
        document.getElementsByClassName("viewCV")[0].style.display = "block";
        this.setState(() => {
          return {viewCV_action: "Close CV"};
        });
        break;
      }
      case 'Close CV':
      {
        document.getElementsByClassName("viewCV")[0].style.display = "none";
        this.setState(() => {
          return {viewCV_action: "View CV"};
        });
        break;
      }
      default:
      {
        alert("Oops, the system could not execute your last comand.")
      }
    }
  }

  render() {
    return (
      <div className="App">
        {/* Incase all routes BrowserRouters scope*/}
          <Router>
            {/*Navigation menu*/}
            <Menu />
            {/*Link to the home route*/}
            <Link to='/'></Link>
            {/*Routes to links accessed via menu component*/}
            <Route exact={true} path={['/', '/Home']} component={() => <Home />}/>
            <Route path={'/Calculator'} component={() => <Calculator />}/>
            <Route path={'/Shop'} component={() => <Shop/>}/>
            <Route path={'/Itunes'} component={() => <Itunes />}/>
            <Route path={'/Help'} component={() => <Help />}/>
            <Route path={'/Weather'} component={() => <Weather />}/>
          </Router>
        <Footer openCV={this.openCV} viewCV_action={this.state.viewCV_action}/>
        <ViewCV/>
      </div>
    );
  }
}

// A footer copmponent for displaying static infomation
function Footer(props) {
    return (
        <div className="footer">
          <footer>
            <div id="link">
              <p>
                Created and designed by <cite><a href="https://www.linkedin.com/in/monwabisi-dingane-4287028b/" target="_blank" rel="noopener noreferrer">Monza Dingane</a> on 07 Oct. 2019. All rights reserved by creator.</cite>
              </p>
            </div>
            <div id="cv">
              <p>
                monwabisidingane@gmail.com
              </p>
              <p>
                +278 4280 7666
              </p>
              <p>
                Let's create solutions to problems that don't exist just yet...
              </p>
              <button id="requestCv" onClick={() => props.openCV(props.viewCV_action)}>{props.viewCV_action}</button>
            </div>
            <div id="external">
              <a href="https://www.linkedin.com/in/monwabisi-dingane-4287028b/" target="_blank" rel="noopener noreferrer">gitHub</a>
              <a href="https://twitter.com/IAmMonza" target="_blank" rel="noopener noreferrer">twitter</a>
              <a href="https://i-am-monza.github.io/myProfile" target="_blank" rel="noopener noreferrer">portfolio</a>
              <a href="https://www.linkedin.com/in/monwabisi-dingane-4287028b/" target="_blank" rel="noopener noreferrer">linkedIn</a>
              <a href="https://www.facebook.com/monwabisi.dingane.7" target="_blank" rel="noopener noreferrer">facebook</a>
              <a href="https://www.instagram.com/iammonza/" target="_blank" rel="noopener noreferrer">instagram</a>
            </div>
          </footer>
        </div>
    );
}

function ViewCV() {
      return (
        <div className="viewCV">
          <div id="cv">
            <iframe src={CV} title="View-CV" type="text/pdf" scrollable="true">
            </iframe>
          </div>
        </div>
    );
}