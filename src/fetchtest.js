/* This file tests getting geojson from the featureserver
*  using fetch
*/

//const fetch = require("node-fetch");
import fetch from "node-fetch";

const url = "https://portal.spatial.nsw.gov.au/geoserver/liveTransport/buses/featureServer/0/query?=geojson";


getLTjson();

async function getLTjson() {
    try {
        let response = await fetch(url);
        if (response.status === 200) {
            let data = await response.text();
            console.log(data);
        }
    } catch (error) {
        console.log(error);
    }
}
