const port = 8080
const express = require('express');
const request = require('request');
const app = express();
app.get('/', (req, res) => {
    if (Object.keys(req.query).includes("lat") && Object.keys(req.query).includes("lon")) {
        request('https://forecast.io/embed/#' + req.url.substring(2), function(error, _, body) { // substring(2) removes `/?` from the URL because it is running from/as root of server
            if (error) return res.send(error);
            res.write("<script>window.location.hash=window.location.search.substring(1);</script>"); // Sets URL hash for forecast.io scripts
            res.write(body.replace(/"\//g, '"./'));
            res.write('<script>document.body.style.webkitTransform="scale(1.1)",document.body.style.webkitTransformOrigin="0% 0%",document.body.style.width="50%",document.body.style.filter="invert(100%)"</script><style>.fe_forecast_link{display:none}</style>');
            return res.end();
        });
    } else {
        // Helper redirect script if the parameters were set in the hash where we can't verify their existance
        res.write("<script>if(window.location.hash.substring(1).includes('lat=') && window.location.hash.substring(1).includes('lon=')){window.location.search=window.location.hash.substring(1);}</script>");
        // Message shown if no redirect possible
        res.write("Invalid parameters! You must, at least, supply `lat` and `lon` parameters.");
        return res.end();
    }
});
app.get('*', (req, res) => {
    request('https://forecast.io' + req.url, function(error, response, body) {
        if (error) return res.send(error);
        res.header("content-type", response.headers["content-type"]);
        return res.send(body);
    });
});
app.listen(port, (err) => {
    if (err) return console.err(err);
    console.log("Server listening on port:", port)
});