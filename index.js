import 'aframe';
import { GoogleProjection } from 'jsfreemaplib';

AFRAME.registerComponent("geolocate", {
    init: function() {
        if(navigator.geolocation) {
            // @todo change getCurrentPosition() to watchPosition() before submit
            navigator.geolocation.getCurrentPosition (
                    async gpspos=> {
                         // Create a GoogleProjection object. This object is responsible for conversions
                        // between lon/lat and Web Mercator (aka 'Google Projection')
                        this.merc = new GoogleProjection();
                        // console.log(`Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`); // show on the console
                        const lon = gpspos.coords.longitude;
                        const lat = gpspos.coords.latitude;

                        // project the lon and lat into Web Mercator.
                        // returns an array with three members, first is Lon and second is Lat, third is a Zoom level
                        const tile = this.merc.getTileFromLonLat(lon, lat, 13);

                        // Output the easting and northing, and corresponding x and z coordinates, 
                        // remembering to change sign of the northing before using it for a z coordinate
                        console.log(`Lon: ${tile[0]}, x: ${tile[0]}, Lat: ${tile[1]}, z: ${-tile[1]}`);

                        // set the position of the camera
                        this.el.sceneEl.camera.position.set(tile[0],tile[1],13)
                        await this.fetchGeo(lon, lat)
                    },
        
                    err=> {
                        alert(`An error occurred: ${err.code}`);
                    }
                );
        } else {
            alert("Sorry, geolocation not supported in this browser");
        }
    },
    fetchGeo: async function(lon, lat) {

        const Z = lon - 0.05;
        const X = lat - 0.02;
        const Y = lon + 0.05;

        // Await a response from the GeoJSON API 
        const response = await fetch(`https://hikar.org/webapp/map/${Z},${X},${Y}`);

        // Parse the JSON.
        const parsedJson = await response.json();

        // Loop through each feature in the GeoJSON.
        parsedJson.features.forEach ( feature => {
            // Print the name
            console.log(`Name: ${feature.properties.name}`);
            console.log(`Longitude: ${feature.geometry.coordinates[0]}, latitude: ${feature.geometry.coordinates[1]}`);

            // If it's a point, print the coordinates
            // if(feature.geometry.type == 'Point') {
            //     console.log(`Longitude: ${feature.geometry.coordinates[0]}, latitude: ${feature.geometry.coordinates[1]}`);

            //      const projected = this.merc.project(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

            // }
        });
    }
});