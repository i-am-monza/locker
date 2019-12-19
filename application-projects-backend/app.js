// Import the express framework to be accessable in this file
var express = require('express');
// Import Helmet for security
var helmet = require('helmet')
// Import nodemailer for communicating via email with admin
var nodemailer = require('nodemailer');
// Import body-parser module
var bodyParser = require('body-parser');
// Import path
var path = require('path');
// Import cookie-parser
var cookieParser = require('cookie-parser');
// Import the file system for interacting with string file
var fs = require('fs');
// Import cors to allow cross-origin communication of frontend application and sever application
var cors = require('cors');
// Import the itunes fetch module to be used in this file
var fetch = require('./modules/Fetch');
// Read the content in the json into respective variables
var favourites = require('./src/favourites.json');
var cart = require('./src/cart.json');
var products = require('./src/products.json');
// Get admin credentials
var admin = require('./src/details.json');
// Create transport object using createTransport function
var transport = nodemailer.createTransport({
    service: admin.service,
    auth: {
        user: admin.auth.user,
        pass: admin.auth.pass
    }
});

// Create an express object to use its middleware functions
var app = express();
// Use helmet's securirty features
app.use(helmet());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/application-projects-frontend/build')));

app.use(express.json());

// A middleware handler for processing get requests
app.get('/apple/', (req, res, next) => {
    // Construct an object using information from the query object
    let body = { search: req.query.search, media: req.query.media };
    // Use the fecth function from the itunes fetch module
    fetch.function(body)
        .then(data => {
            // Respond with the returned result from the fetch function
            res.send(data.results);
        }, err => {
            res.json(err);
        });
});

// A middleware handler for processing get requests of the favourites items
app.get('/apple/favourites', (req, res, next) => {
    // Respond with the favourites full content
    res.send(favourites);
});

// A middleware for handling post request to the server
app.post('/apple/favourites', (req, res, next) => {
    // Get the new favourite item from the body object
    let fav = req.body;
    // Push the new item to the favourites list
    favourites.push(fav);

    // Write the updated favourites to the json file
    fs.writeFile('./src/favourites.json', JSON.stringify(favourites), err => {
        if (err) {
            // Log an error message for the user
            console.error(err);
        } else {
            // Log an informative message for the user
            console.info("File written.");
        }
    });

    // Send the favourites list as a response
    res.send(favourites);
});

// A middleware for processing delete requests to the server
app.delete('/apple/favourites/:trackId', (req, res, next) => {
    // Filter out the item the user whats to delete and assign results of changes to the favourites object
    favourites = favourites.filter(obj => {
        if (obj.trackId != req.params.trackId) {
            return obj;
        }
    });

    // Write the updated favourites list to the json file
    fs.writeFile('./src/favourites.json', JSON.stringify(favourites), err => {
        if (err) {
            // Log an error message for the user
            console.error(err);
        } else {
            // Log an informative message for the user
            console.info("File deleted.");
        }
    });

    // Send the favourites list as a response
    res.send(favourites);
});

/* GET the details of products available. */
app.get('/store/products', (req, res, next) => {
    res.send(products);
});

/* GET the products in the users cart*/
app.get('/store/cart', (req, res, next) => {
    if (cart.length !== 0) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].user === req.query.user) {
                res.send(cart[i].products);
                break;
            }
        }
    }
});

// Middleware for saving the shopping cart products to a file
app.post('/store/cart', (req, res, next) => {
    let item = false, user = false;
    let index = 0;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].user === req.query.user) {

            user = true;

            for (let j = 0; j < cart[i].length; j++) {
                if (cart[i].products[j].name === req.body.name) {

                    index = j;
                    item = true;

                    break;
                }
            }
        }
    }

    if (user && item) {
        console.warn("Product already in user cart.")
    } else if (user && !item) {
        cart[index].products.push(req.body);
    } else {
        cart.push({ "user": req.query.user, "products": [req.body] });
    }

    console.info("cart before write", JSON.stringify(req.body));

    fs.writeFile('../application-projects-backend/src/cart.json', JSON.stringify(cart), err => {
        if (err) {
            throw err;
        } else {
            console.info("Product added to cart.json file.")
        }
    });

    console.info("cart after write", JSON.stringify(cart));

    // res.send(cart);
    next();
});

// Middleware that will be responsible for contacting admin for orders
app.post('/store/order', (req, res, next) => {

    let body = `Hi Monza\nMy name is ${req.query.name} and I would like you to send me projects:\n${req.body}\n\nKind Regards\nreq.query.number`;

    let mailPacket = {
        from: req.query.email,
        to: admin.auth.user,
        subject: "Locker: Project Request",
        html: JSON.stringify(body)
    }

    transport.sendMail(mailPacket, (info, err) => {
        if(err)
        {
            res.json(err);
        }
        else
        {
            res.json(info);
        }
    });    
});

app.delete('/store/cart/', (req, res, next) => {

    for(let i = 0; i < cart.length; i++)
    {
        if(cart[i].user === req.query.user)
        {
            cart[i].products = cart[i].products.filter(obj => {
                if(obj.name !== req.body.name)
                {
                    return obj;
                }
                else
                {
                    if(obj.qty !== req.body.qty)
                    {
                        if(req.body.qty < obj.qty)
                        {
                            obj.qty -= req.body.qty;

                            return obj;
                        }
                    }
                }
            });
        }
    }

    fs.writeFile('../application-projects-backend/src/cart.json', JSON.stringify(cart), err => {
        if (err) {
            throw err;
        } else {
            console.info("Product updated in cart.json file.")
        }
    });
    // res.send(cart);
    next();
});

// Initialise a port number for the server to be running on
var PORT = process.env.PORT || 3008;
// Specify a port for the server to run on
app.listen(PORT, () => {
    console.warn(`Local server listening on PORT ${PORT}`)
});