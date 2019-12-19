// Import the react library and component class
import React, { Component } from 'react';
// Import the stylesheet for the application
import './Itunes.css';
// Import images
import AppleIcon from './../../images/appleicon.png';

// Export the application class component at its declaration
export class Itunes extends Component {
    // Create a constructor and initialise variables
    constructor() {
        super();
        /**@enum @private const @string*/
        this.url_ = "http://localhost:3008";

        this.state = { search: "", media: "", result: [], starred: [] };
    }

    // A lifecycle hook that executes a statement when the application is mounted on the browser
    componentDidMount = () => {
        this.getFavourites();
    }

    // A function solely for the purpose of communicating with the application server
    requestServer = (path, init) => {
        return fetch(this.url_.concat(path), init);
    }

    // This function save the users keyboard input in a state object
    searchContent = e => {
        this.setState({ search: e.target.value });
    }

    // This function save the users selected media choice in a state object
    searchMedia = e => {
        this.setState({ media: e.target.value });
    }

    // A function for making a search request to the server for a particular item
    search = () => {
        let path = `/apple/?search=${this.state.search}&media=${this.state.media}`;
        let init = { method: "GET", headers: { "Content-Type": "application/json" } };

        // Process the servers returned response with a callback functiona and a promise
        this.requestServer(path, init)
            .then(response => {
                return response.json();
            }).then(data => {
                this.setState({ result: data });
            }, err => {
                this.setState({ result: err });
            });
    }

    // A function for making a post request of a selected favourite item by the
    addToFavourite = e => {
        var item = {};
        // A boolean variable for an item that exists or doesn't
        var exist = false;

        // Check if the item being added to favourites already exists in that list or not
        if (this.state.starred) {
            this.state.starred.forEach(obj => {
                if (String(obj.trackId) === e.target.id) {
                    exist = true;
                }
            });

            // Execute certain functionality if an item exist or not
            switch (exist) {
                case true:
                    {
                        console.warn("Track alredy in favourites.");
                        break;
                    }
                case false:
                    {
                        // Get the item information from the results list if it doesnt exist in favourites
                        // eslint-disable-next-line
                        item = this.state.result.find(obj => {
                            if (String(obj.trackId) === e.target.id) {
                                return obj;
                            }
                        });
                        break;
                    }
                default:
                {
                  alert("Error. Please refresh page");
                }
            }
            } 
            else 
            {
              // Get the item information from the results list if it doesnt exist in favourites
              item = this.state.result.forEach(obj => {
                  if (String(obj.trackId) === e.target.id) {
                      return obj;
                  }
              });
            }

        // Prepare a post request to the server for entering the item as a favourites item
        let path = '/apple/favourites';
        let init = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) };

        // Process the servers returned response with a callback functiona and a promise
        this.requestServer(path, init)
            .then(response => {
                return response.json();
            }).then(data => {
                this.setState({ starred: data });
            }, err => {
                console.error(err);
            });
    }

    // Make a request to the server to get all favourites items
    getFavourites = () => {
        // Prepare the path and init object for the get request
        let path = '/apple/favourites';
        let init = { method: "GET", headers: { "Content-Type": "application/json" } };

        // Process the servers returned response with a callback functiona and a promise
        this.requestServer(path, init)
            .then(response => {
                return response.json();
            }).then(data => {
                this.setState({ starred: data });
            }, err => {
                console.error(err);
            });
    }

    // Make a request to the server to remove a specofc item from the favourites list
    removeFavourites = e => {
        // Prepare the path and init object for the get request
        let path = `/apple/favourites/${e.target.id}`;
        let init = { method: "DELETE", headers: { "Content-Type": "application/json" } };

        // Process the servers returned response with a callback functiona and a promise
        this.requestServer(path, init)
            .then(response => {
                return response.json();
            }).then(data => {
                this.setState({ starred: data });
            }, err => {
                console.error(err);
            });
    }

    // A render method for mounting the application components on browser
    render() {
        return (
            <div className="itunes">
              <Header getFavourites={this.getFavourites.bind(this)}/>
              <Search searchContent={this.searchContent.bind(this)} searchMedia={this.searchMedia.bind(this)} search={this.search.bind(this)}/>
              <Body result={this.state.result} starred={this.state.starred} addToFavourite={this.addToFavourite.bind(this)} removeFavourites={this.removeFavourites.bind(this)}/>
          </div>
        );
    }
}

// The header functional component with static infomation to be rendered on browser
function Header() {
    return (
        <div className="header">
        <h1>find me</h1>
        <h5>or visit <a href="https://www.apple.com/za/itunes/" target="_blank" rel="noopener noreferrer"><img id="appleIcon" src={AppleIcon} alt="Apple"/></a></h5>
      </div>
    );
}

// The search functional component which recieves callback functions as properties. One function is fired onChange and the other onClick
function Search(props) {
    return (
        <div className="Search">
        <label id="searchBar">
          <input id="searchInput" placeholder="Enter your search here..." onChange={(event) => props.searchContent(event)}></input>
          <select id="media" onChange={(event) => props.searchMedia(event)}>
            <option>--Media--</option>
            <option>music</option>
            <option>movie</option>
            <option>podcast</option>
            <option>musicVideo</option>
            <option>audiobook</option>
            <option>shortFilm</option>
            <option>tvShow</option>
            <option>software</option>
            <option>ebook</option>
          </select>
          <button id="searchButton" type="submit" onClick={props.search}>Search</button>
        </label>
      </div>
    );
}

// The body functional component. This component displays information thats being searched by the user or coming from the favourites storage area
function Body(props) {
    return (
        <div className="body">
          <div id="display">
            <h1>
              {/*A conditional statement for choosing text for the header*/}
              {(props.result.length !== 0) ? "Results" : ""}
            </h1>
          <table>
            <tbody>
              {/*Map the values in the result state property on tr element*/}
              {props.result.map((obj, key) => {
                return (
                    <tr id="item-results" key={key++}>
                      <td>
                        <img src={obj.artworkUrl60} alt="Album Art"/>
                      </td>
                      <td id="info">
                        <h5>
                          {obj.trackName} 
                          <br/>
                          <i>R:{parseFloat(Math.ceil(obj.trackPrice)*14.56)}</i>
                        </h5>
                      </td>
                      <td>
                        <video controls>
                          <source src={obj.previewUrl} type="audio/mp3"/>
                        </video>
                      </td>
                      <td>
                        <button id={obj.trackId} type="submit" onClick={(event) => props.addToFavourite(event)}>+</button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
        <div id="favourites">
          <h1>
            {/*A conditional statement for choosing text for the header*/}
            {(props.starred.length !== 0) ? "Favourites" : ""}
          </h1>
          <table>
            <tbody>
              {/*Map the values in the result state property on tr element*/}
              {props.starred.map((obj, key) => {
                return (
                    <tr id="item-results" key={key++}>
                      <td>
                        <img src={obj.artworkUrl60} alt="Album Art"/>
                      </td>
                      <td>
                        <h5>
                          {obj.trackName}
                        </h5>
                      </td>
                      <td>
                        <audio controls>
                          <source src={obj.previewUrl} type="audio/mp3"/>
                        </audio>
                      </td>
                      <td>
                        <button id={obj.trackId} type="submit" onClick={(event) => props.removeFavourites(event)}>-</button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
}