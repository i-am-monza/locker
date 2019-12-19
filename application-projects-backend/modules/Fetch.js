module.exports = {
    // An a synchronous function for making a get request to itunes search api
    async function(init) {
        // Import the fetch function from the node-fetch module
        let fetch = require('node-fetch');
        // Prepare the parameters
        let search = init.search.replace(' ', '+');
        let media = init.media;

        // Specify the search item and media type on the url path when making the request
        let request = await fetch(`https://itunes.apple.com/search?term=${search}&media=${media}&limit=10`);
        let response = await request.json();

        // Return a response from the api
        return response;
    }
}