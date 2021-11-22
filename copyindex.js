import 'aframe';
import { GoogleProjection } from 'jsfreemaplib';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';

AFRAME.registerComponent("geolocate", {
    init: function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (
                    async gpspos=> {
                        this.merc = new GoogleProjection();
                        const lon = gpspos.coords.longitude;
                        const lat = gpspos.coords.latitude;

                        document.getElementById('lon').innerHTML = "Longitute:"+ gpspos.coords.longitude.toFixed(5);
                        document.getElementById('lat').innerHTML = "Latitude:"+gpspos.coords.latitude.toFixed(5);   

                        const tile = this.merc.getTileFromLonLat(lon, lat, 13);
                        console.log(tile)

                        const projected = this.merc.project(lon, lat);
                        console.log(`Easting: ${projected[0]}, x: ${projected[0]}, northing: ${projected[1]}, z: ${-projected[1]}`);

                        this.el.sceneEl.camera.position.set(projected[0],0,-projected[1])

                        await this.fetchGeo(tile)
                    
                    },
        
                    err=> {
                        alert(`An error occurred: ${err.code}`);
                    }
        
                );
        } else {
            alert("Sorry, geolocation not supported in this browser");
        }
    },

    fetchGeo: async function(tile) {

            const west = tile.x - 0.05;
            const south = tile.y - 0.05;
            const east = tile.x + 0.05;
            const north = tile.y + 0.05;

            // Await a response from the GeoJSON API 
            const response = await fetch(`https://hikar.org/webapp/map/${tile.z}/${tile.x}/${tile.y}.poi.json?bbox=${west},${south},${east},${north}`);

            // Parse the JSON.
            const parsedJson = await response.json();

            // Loop through each feature in the GeoJSON.
            parsedJson.features.forEach ( poi => {
                // Print the name
                console.log(`Name: ${poi.properties.name}`);
                // console.log(poi)
                const projected = this.merc.project(poi.geometry.coordinates[0], poi.geometry.coordinates[1]);
                const cone = document.createElement('a-cone');
                this.el.sceneEl.appendChild(cone);

                cone.setAttribute('position', {
                    x: projected[0],
                    y: 0,
                    z: -projected[1]
                });
                cone.setAttribute('radius-bottom', 100);
                cone.setAttribute('height', 300);
                cone.setAttribute('material', {
                    color: 'red'
                });

                    if (poi.properties.amenity == 'pub') {
                        const pubCompound = document.createElement('a-entity');
                        pubCompound.setAttribute('look-at', '[gps-projected-camera]')
                        pubCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        pubCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add bottle model
                        const bottle = document.createElement('a-entity');
                        bottle.setAttribute('gltf-model', '#beer-bottle');
                        bottle.setAttribute('scale', {
                            x:5,
                            y: 5,
                            z: 5
                        })

                        // Add the text entity to the compound ...
                        const textEntity = document.createElement('a-entity');
                        textEntity.setAttribute('text', {
                            value: poi.properties.name
                        });
                        textEntity.setAttribute('scale', {
                            x: 100,
                            y: 100,
                            z: 100
                        });
                        textEntity.setAttribute('look-at', '[gps-projected-camera]')
                        textEntity.setAttribute('position', {
                            x: 0,
                            y: 10,
                            z: 0,
                        })
                    
                        pubCompound.appendChild(textEntity);
                        pubCompound.appendChild(bottle);
                        this.el.sceneEl.appendChild(pubCompound);

                    } else if (poi.properties.amenity == 'restaurant') {
                        const restaurantCompound = document.createElement('a-entity');
                        restaurantCompound.setAttribute('look-at', '[gps-projected-camera]')
                        restaurantCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        restaurantCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add burger model
                        const burger = document.createElement('a-entity');
                        burger.setAttribute('gltf-model', '#burger');
                        burger.setAttribute('scale', {
                            x:50,
                            y: 50,
                            z: 50
                        })

                        // Add the text entity to the compound ...
                        const textEntity = document.createElement('a-entity');
                        textEntity.setAttribute('text', {
                            value: poi.properties.name
                        });
                        textEntity.setAttribute('look-at', '[gps-projected-camera]')
                        textEntity.setAttribute('scale', {
                            x: 1000,
                            y: 1000,
                            z: 1000
                        });
                        textEntity.setAttribute('position', {
                            x: 0,
                            y: 10,
                            z: 0,
                        })
                    
                        restaurantCompound.appendChild(textEntity);
                        restaurantCompound.appendChild(burger);
                        this.el.sceneEl.appendChild(restaurantCompound);
                    } else if (poi.properties.amenity == 'cafe') {
                        const cafeCompound = document.createElement('a-entity');
                        cafeCompound.setAttribute('look-at', '[gps-projected-camera]')
                        cafeCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        cafeCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add burger model
                        const coffee = document.createElement('a-entity');
                        coffee.setAttribute('gltf-model', '#coffee');
                        coffee.setAttribute('scale', {
                            x:50,
                            y: 50,
                            z: 50
                        })

                        // Add the text entity to the compound ...
                        const textEntity = document.createElement('a-entity');
                        textEntity.setAttribute('text', {
                            value: poi.properties.name
                        });
                        textEntity.setAttribute('look-at', '[gps-projected-camera]')
                        textEntity.setAttribute('scale', {
                            x: 1000,
                            y: 1000,
                            z: 1000
                        });
                        textEntity.setAttribute('position', {
                            x: 0,
                            y: 10,
                            z: 0,
                        })
                    
                        cafeCompound.appendChild(textEntity);
                        cafeCompound.appendChild(coffee);
                        this.el.sceneEl.appendChild(cafeCompound);
                    }
            });
    }
});

AFRAME.registerComponent("clicker", {
    schema: {
        name: {
            type: 'string',
            default: ''
        },
        elevation: {
            type: 'number',
            default: 0
        },
    },
    init: function() {
        this.el.addEventListener('click', e=> {
            alert(`Name: ${this.data.name}, Elevation: ${this.data.elevation}`)
        });
    }
});