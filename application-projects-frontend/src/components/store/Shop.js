import React, { Component } from 'react';
// Import the styles for this component
import './Shop.css';
/*Import the images that will be used in this component*/
import Calculator_Image from './../../images/calculator.png';
import Weather_Image from './../../images/weather.png';
import Search_Image from './../../images/search.png';

// Export the class component Shop at its declaration
export class Shop extends Component {
	/**@enum @private @string*/
	url_ = "http://localhost:3008";
	/**@enum @private @boolean*/
	isLoggedIn_ = false;
	/**@enum @private @string*/
    userLoggedIn_ = "";
    /**@enum @private @string*/
    logAction_ = "Login";
    /**@enum @private @number*/
    qtyHolder_ = 1;

    // Constructor for Shop component
    constructor() {
        super();

        this.state = { data: [], cart: [], total: 0, checkout: false, logAction: this.logAction_};
    }

    // A lifecycle hook such that when a user logs in, it updates the cart total price and render it
    componentDidUpdate()
    {
    	// Local total variable
    	let total = 0;

    	// Check if the user is logged in
    	if(this.isLoggedIn_)
    	{
    		// A clause to get the logged in users products if they are not uploaded to state yet
    		(Object.keys(this.state.cart).length === 0) ? this.getCart() : console.info("Cart is not empty.");

            for(let i = 0; i < this.state.cart.length; i++)
            {
                // Populate total based on products in user cart
                total += parseFloat(this.state.cart[i].qty);
            }
    	}

    	// Update state total clause
    	(total && this.state.total !== total) ? this.updateTotal(total) : console.info("Total up to date");
    }


    // This async function makes the server requests. It takes in two arguements, including the control object that specifies the method request
    makeRequest = async (path, init) => {
        let request = await fetch(this.url_.concat(path), init);
        let response = await request.json();

        return response;
    }

    // A function solely for updating state total units
    updateTotal = (total) => {
    	this.setState({total});
    }

    // This function is responsible for temporarly logging the user into the system
    login = (email, action) => {
        if (email !== "") {
        	// Add an email property to state when user is logged in
            switch(action)
            {
                case "Login":
                {
                    this.setState({email: email});
                    this.setState({logAction: "Logout"});
                    this.isLoggedIn_ = true;

                    alert(`User ${this.userLoggedIn_} logged in.`);
                    break;
                }
                case "Logout":
                {
                    let choice = window.confirm(`User ${this.userLoggedIn_} logging out?`);

                    if(choice)
                    {
                        this.setState({email: ""});
                        this.setState({logAction: "Login"});
                        this.setState({cart: {}});
                        this.setState({total: 0});
                        this.setState({checkout: false});

                        this.isLoggedIn_ = false;
                        this.userLoggedIn_ = "";
                        this.qtyHolder_ = 1;

                        document.getElementById("login").value = "";
                    }

                    break;
                }
                default:
                {
                    console.error("Error executting logging operation.");
                    break;
                }
            }
        } else {
            alert("Incorrect email/username length.")
        }
    }

    // This function gets the producst details from the server
    getProducts = () => {
        let path = "/store/products";
        let init = { method: "GET", headers: { "Content-Type": "application/json" } };

        this.makeRequest(path, init)
            .then(data => {
                this.setState(() => {
                    return { products: data };
                })
            }, err => {
                throw err;
            });
    }

    // A function for getting the logged in user cart products
    getCart = () => {

        let path = `/store/cart/?user=${this.state.email}`;
        let init = { method: "GET", headers: { "Content-Type": "application/json" } };

        this.makeRequest(path, init)
            .then(data => {
                this.setState(() => {
                    return { cart: data };
                })
            }, err => {
                throw err;
            });
    }

    // A function for checking out the cart products
    checkOut = () => {
    	// Check if user is logged in before they can use the checkout functionality
    	if(this.isLoggedIn_)
    	{
    		// Populate the cart property in state if it is empty
    		(this.state.cart.length === 0) ? function(){this.getCart()}() : console.log("Cart is not empty.");

    		if(this.state.cart.length !== 0)
    		{
    			// Create a list to store the names of the products on the user cart
    			let prods = [];

    			for(let i = 0; i < this.state.cart.length; i++)
    			{
    				prods.push(this.state.cart[i].name);
    			}

    			// Get the user option from the confirm dialog window
    			var confirm = window.confirm(`Products: ${prods}\nTotal: ${this.state.total}\nContinue?`);

    			// Switch between statements using users choices
    			switch(confirm)
    			{
    				case true:
    				{
    					this.setState({data: {}});
    					// Update the chekout flag so that the program can render the checkout component
    					this.setState({checkout: true});
    					break;
    				}
    				case false:
    				{
    					// Error message for the user
    					console.warn("User canceled.");
    					break;
    				}
    				default:
    				{
    					alert("Error.");
    				}
    			}
    		}
    		else
    		{
    			alert(`User ${this.userLoggedIn_} cart is empty.`);
    		}
    	}
		else
		{
			alert(`User not logged in.`);
		}
    }

    // A function for processing the user's order after they are done edding items into the cart, and now checking out
    processOrder = () => {

    	if(this.state.name !== undefined && this.state.contactNumber !== undefined && this.state.cart.length !== 0)
        {
            let path = `/store/order/?name=${this.state.name}&number=${this.state.contactNumber}&email=${this.userLoggedIn_}`;
            let init = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(this.state.cart)};

            this.makeRequest(path, init)
                .then(data => {
                    alert("Request sent");

                    this.login(this.userLoggedIn_, "Logout");
                    console.log("logged out")
                }, err => {
                    alert("Error: " + err);
                });
        }
        else
        {

            var confirm = window.confirm(`Both Name and Contact Number are required fields for delivery user ${this.userLoggedIn_}.\nOpting out this fields means you are option out of delivery and additional costs.\nYour total price is R ${this.state.total}. Select cancel for pick-up and ok for entering your delivery information.`);
            // const choice = confirm(`Both Address and Postal Code are required fields for delivery user ${this.userLoggedIn_}.\nOpting out this fields means you are option out of delivery and additional cost.\nYour total price is R ${this.state.total}. Select cancel for pick-up and ok for entering your delivery information.`);
            switch(confirm)
            {
                case false:
                {
                    alert(`User: ${this.userLoggedIn_} cancelled operation.`);
                    break;
                }
                default:
                {
                    alert("Enter your information in required fields then submit order.")
                    break;
                }
            }
        }
    }

    // This function adds products to the cart by making a request to the server
    addRemoveProduct = (info, action) => {
        if (this.isLoggedIn_) {

            let path = "/store/cart/?user=".concat(this.userLoggedIn_);
            
            this.captureQty();

            switch(action)
            {
                case "Add to cart":
                {
                    info.qty = this.qtyHolder_;

                    let init = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(info)};
                
                    // Call the requesting function
                    this.makeRequest(path, init)
                        .then(data => {
                            // Update the data object with the information of the added product
                            this.setState(() => {
                                return { data: data };
                            });

                            // Update the total cart price
                            this.setState(() => {
                                return { total: this.state.total + data.price };
                            });
                        }, err => {
                            throw err;
                        });
                    // Output message for the user
                    alert(`Product ${info.name} added to cart.`);

                    break;
                }
                case "Remove from cart":
                {
                    info.qty = this.qtyHolder_;

                    let init = { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(info) };
            
                    // Call the requesting function
                    this.makeRequest(path, init)
                        .then(data => {
                            // Update the total cart price
                            this.setState(() => {
                                return { total: this.state.total - info.price };
                            });
                            // Update the data object with the information of the added product
                            this.setState(() => {
                                return { data: data };
                            })
                        }, err => {
                            throw err;
                        });
                    // Output message for the user
                    alert(`Product ${info.name} removed from cart.`);
                    break;
                }
                default:
                {
                    console.error("Error determining operation.");
                }
            }
        } else {
            alert("User is not logged in. Enter your email as the username to login.")
        }
    }

    // This function gets the products in the cart from the server
    showCart = () => {
        if (this.isLoggedIn_) {

            ((this.state.cart.length === 0) ? this.getCart() : function() { console.info("Cart is not empty.") }());

            // Format how to display the information on the alert window
            let details = `Products on cart:\n- - - - - - - - - -\n`;

            for (let i = 0; i < this.state.cart.length; i++) {
                details += `\tProject Name: ${this.state.cart[i].name}\n\tSession hours commite: ${this.state.cart[i].qty}\n\n`;
            }

            ((this.state.cart.length === 0) ? console.warn("No products in cart") : function() { alert(details) }());

        } else {
            alert("User is not logged in. You need to login to view your cart products.")
        }
    }

    // This function saves the users emails on global variable
    handleInput = e => {
        this.userLoggedIn_ = e;
    }

    captureInput = e => {
        switch(e.target.id)
        {
            case "name":
            {
                this.setState({name: e.target.value});
                break;
            }
            case "contactNumber":
            {
                this.setState({contactNumber: e.target.value});
                break;
            }
            default:
            {
                console.error("Error capturing users input.");
                break;
            }
        }
    }

    // This function is for capturing the users chosen session value
    captureQty = () => {

        let select = document.getElementById("selectQty");
        /*Get the value of the quantity change for the product*/
        let qtyValue = select.options[select.selectedIndex].value;
        
        this.qtyHolder_ = qtyValue;
    }

    // This function save the products information when a user clicks on a product, then render that information to be displayed
    setProduct = info => {
        this.setState({ data: info })
    }

    // The render function has all the elements that should appear on the browser when this component is rendered
    render() {
        return (
            <div className="shop">
				{/*Include functional components of products that will house the product image in its name and price*/}
				<div id="products">
					<Calculator cart={this.state.cart} isLoggedIn={this.isLoggedIn_} captureQty={this.captureQty.bind(this)} addRemoveProduct={this.addRemoveProduct.bind(this)} setProduct={this.setProduct.bind(this)} />
					<Weather cart={this.state.cart} isLoggedIn={this.isLoggedIn_} captureQty={this.captureQty.bind(this)} addRemoveProduct={this.addRemoveProduct.bind(this)} setProduct={this.setProduct.bind(this)} />
					<Search cart={this.state.cart} isLoggedIn={this.isLoggedIn_} captureQty={this.captureQty.bind(this)} addRemoveProduct={this.addRemoveProduct.bind(this)} setProduct={this.setProduct.bind(this)} />
				</div>
				<div id="controls">
					<button id="checkout" onClick={() => {this.checkOut()}}>Checkout</button>
					<label id="forLogin" htmlFor="login">email: <input id="login" readOnly={this.isLoggedIn_} onChange={(event) => {this.handleInput(event.target.value)}}></input><button id="loginBtn" onClick={() => {this.login(this.userLoggedIn_, this.state.logAction)}}>{this.state.logAction}</button></label>
					<label id="forTotal" htmlFor="total">Session hour(s): {this.state.total}</label>
					<button id="showCart" onClick={() => {this.showCart()}}>Cart</button>
				</div>
				<div id="stageDescription">
					{(Object.keys(this.state.data).length !== 0) ? <RenderApplicationDetails data={this.state.data}/> : (this.state.checkout === true) ? <Request captureInput={this.captureInput.bind(this)} processOrder={this.processOrder.bind(this)}/> : <h1>Click on product to show its properties.</h1>}
				</div>
			</div>
        );
    }
}

/*A functional component that return the Calculator product's Image and a header with product name and price*/
function RenderApplicationDetails(props) {
    return (
        <div className="products">
			<div id="info">
				<h1>Information</h1>
				<h3>App. Name: {props.data.name}</h3>
				<h3>Language: {props.data.language}</h3>
				<h3>Packages: {props.data.addOn}</h3>
				<h3>Defficulty: R {props.data.defficulty}</h3>
				<h3>Description: {props.data.description}</h3>
				<div>
					{props.data.addRemove()}
				</div>
			</div>
			<div id="trackList">
				<h1>additional...</h1>
				<ol>
				{props.data.trackList.map((item, key) => {
					return (
						<li key={key++}>
							{item}
						</li>
						);
				})}
				</ol>
			</div>
		</div>
    );
}

/*A functional component that return the Calculator product's Image and a header with product name and price*/
function Request(props) {
    return (
        <div className="request">
			<div id="requestDetails">
				<h1>Request Form</h1>
				<label>Name: <br/><input id="name" onChange={(event) => props.captureInput(event)}></input></label>
				<br/>
				<label>Contact number: <br/><input id="contactNumber" onChange={(event) => props.captureInput(event)}></input></label>
			</div>
			<button id="deliver" style={{jusifyContent: "center"}} onClick={() => props.processOrder()}>Submit</button>
		</div>
    );
}

// This is a functional component of the vacation product with its properties
function Calculator(props) {
    let trackList = ["Version: 1.0.1", "Private: true", "Distribution: Prohibited", "Dependancies: mathjs, react, react-scripts", "Live link: https://heroku.com.tigervalley.io"];
    let info = {
        name: "Calculator",
        language: "JavaScript, html, css",
        addOn: "React library, math.js library",
        defficulty: "beginner",
        description: "A browser rendered calculator thats able to evaluate basic operations. The calculculator uses components and states as well,",
        trackList: trackList,
        addRemove: function() {
            let action = "Add to cart";
            console.log("clicked")
            if(props.isLoggedIn)
            {
                for(let i = 0; i < props.cart.length; i++)
                {
                    if(props.cart[i].name === info.name)
                    {
                        action = "Remove from cart";
                    }    
                }
            }

            return (
                <div id="productAction">
                    <button id="vacation" onClick={(event) => props.addRemoveProduct(info, action)}>{action}</button>
                    <select id="selectQty" onChange={() => props.captureQty(this)}>
                        <option value="1">1 hour session</option>
                        <option value="2">2 hour session</option>
                        <option value="3">3 hour session</option>
                    </select>
                </div>
            );
        }
    };

    return (
        <article className="item vacation">
			<img type="button" src={Calculator_Image} alt="Calculator" onClick={() => props.setProduct(info)} roundedcircle="true" />
			<h2>Calculator - free for request.</h2>
		</article>
    );
}

/*A functional component that return the How To Rob product's Image and a header with product name and price*/
function Weather(props) {
    let trackList = ["Version: 1.0.1", "Private: true", "Distribution: Prohibited", "Dependancies: mathjs, react, react-scripts", "Live link: https://heroku.com.tigervalley.io"];
    let info = {
        name: "Weather",
        language: "JavaScript, html, css",
        addOn: "React library, Express framework, Weather data API",
        defficulty: "intermediate",
        description: "A browser rendered calculator thats able to evaluate basic operations. The calculculator uses components and states as well,",
        trackList: trackList,
        addRemove: function() {
            let action = "Add to cart";
             
            if(props.isLoggedIn)
            {
               
                for(let i = 0; i < props.cart.length; i++)
                {
                    // console.warn("Are you here", props.isLoggedIn, props.cart[i].name, info.name);
                    if(props.cart[i].name === info.name)
                    {
                        action = "Remove from cart";
                    }    
                }
            }

            return (
                <div id="productAction">
                    <button id="vacation" onClick={(event) => props.addRemoveProduct(info, action)}>{action}</button>
                    <select id="selectQty" onChange={() => props.captureQty(this)}>
                        <option value="1">1 hour session</option>
                        <option value="3">3 hour session</option>
                        <option value="5">5 hour session</option>
                    </select>
                </div>
            );
        }
    };

    return (
        <article className="item how_to_rob">
			<img src={Weather_Image} alt="How To Rob" onClick={() => props.setProduct(info)} roundedcircle="true" />
			<h2>Weather - free for request.</h2>
		</article>
    );
}

/*A functional component that return the Search product's Image and a header with product name and price*/
function Search(props) {
    
    let trackList = ["Version: 1.0.1", "Private: true", "Distribution: Prohibited", "Dependancies: mathjs, react, react-scripts", "Live link: https://heroku.com.tigervalley.io"];
    let info = {
        name: "Search",
        language: "JavaScript, html, css",
        addOn: "React library, math.js library",
        defficulty: "beginner",
        description: "A browser rendered calculator thats able to evaluate basic operations. The calculculator uses components and states as well,",
        trackList: trackList,
        addRemove: function() {
            let action = "Add to cart";
             
            if(props.isLoggedIn)
            {
               
                for(let i = 0; i < props.cart.length; i++)
                {
                    if(props.cart[i].name === info.name)
                    {
                        action = "Remove from cart";
                    }    
                }
            }

            return (
                <div id="productAction">
                    <button id="vacation" onClick={(event) => props.addRemoveProduct(info, action)}>{action}</button>
                    <select id="selectQty" onChange={() => props.captureQty(this)}>
                        <option value="1">1 hour session</option>
                        <option value="3">3 hour session</option>
                        <option value="5">5 hour session</option>
                    </select>
                </div>
            );
        }
    };

    return (
        <article className="item zoo">
			<img src={Search_Image} alt="ZOO" onClick={() => props.setProduct(info)} roundedcircle="true" />
			<h2>Search- free for request.</h2>
		</article>
    );
}