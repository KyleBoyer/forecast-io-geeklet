const port = 8080
const express = require('express');
const request = require('request');
const requestp = (...args) => new Promise((resolve, reject) =>
    request(...args, function(error, response, body) {
        if(error){
            reject(error);
        }else{
            resolve(response);
        }
    })
);
const app = express();
app.get('/', async (req, res) => {
    if (Object.keys(req.query).includes("lat") && Object.keys(req.query).includes("lon")) {
        const encodeCoord = coord => coord.toString().replace('-','n').replace('.', 'd');
        const getForecaseURL = (lat, long, name) => `https://forecast7.com/en/${encodeCoord(lat)}${encodeCoord(long)}/${name.toLowerCase().replace(' ', '-')}/`
        const lat = Math.round(+req.query.lat * 100) / 100;
        const lng = Math.round(+req.query.lon * 100) / 100;
        const embedName = req.query.name.split(', ').pop();
        const possibleLat = [lat, (lat + 0.01).toFixed(2), (lat - 0.01).toFixed(2)];
        const possibleLng = [lng, (lng + 0.01).toFixed(2), (lng - 0.01).toFixed(2)];
        let found = false;
        for(const embedLat of possibleLat) {
            if(!found){
                for(const embedLng of possibleLng){
                    if(!found){
                        try {
                            const attemptURL = getForecaseURL(embedLat, embedLng, embedName);
                            const result = await requestp(attemptURL);
                            if(result.statusCode != 200){
                                throw new Error("Invalid status code!");
                            }
                            found = true;
                            const body = `
                            <a
                                class="weatherwidget-io"
                                href="${attemptURL}?unit=us"
                                data-label_1="${embedName.toUpperCase()}"
                                data-label_2="WEATHER"
                                data-font="Ubuntu"
                                data-icons="Climacons Animated"
                                data-theme="pure"
                            >
                            ${embedName.toUpperCase()} WEATHER
                            </a>
                            <script>
                            !function(d,s,id){
                                var js,fjs=d.getElementsByTagName(s)[0];
                                if(!d.getElementById(id)){
                                    js=d.createElement(s);
                                    js.id=id;
                                    js.src='https://weatherwidget.io/js/widget.min.js';
                                    fjs.parentNode.insertBefore(js,fjs);
                                }
                            }(document,'script','weatherwidget-io-js');
                            </script>
                            `;
                            res.write(body);
                            break;
                        } catch(e) {
                            if(found){
                                throw e;
                            }
                        }
                    }
                }
            }
        }
        res.end();
    } else {
        // Helper redirect script if the parameters were set in the hash where we can't verify their existance
        res.write("<script>if(window.location.hash.substring(1).includes('lat=') && window.location.hash.substring(1).includes('lon=')){window.location.search=window.location.hash.substring(1);}</script>");
        // Message shown if no redirect possible
        res.write("Invalid parameters! You must, at least, supply `lat` and `lon` parameters.");
        return res.end();
    }
});
app.listen(port, (err) => {
    if (err) return console.err(err);
    console.log("Server listening on port:", port)
});