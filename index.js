import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';
import { GoogleProjection } from 'jsfreemaplib';

AFRAME.registerComponent("geolocate", {
    init: function() {
        this.camera = document.querySelector('[camera]');
        window.addEventListener('gps-camera-update-position', async (e) => {

            this.el.setAttribute('terrarium-dem', {
                lat: e.detail.position.latitude,
                lon: e.detail.position.longitude
            })
            // Display current location on screen
            document.getElementById('lon').innerHTML = "Longitute:"+ e.detail.position.longitude.toFixed(5);
            document.getElementById('lat').innerHTML = "Latitude:"+e.detail.position.latitude.toFixed(5);
        });
        this.el.addEventListener('elevation-available', e => {
            this.camera.object3D.position.y = e.detail.elevation;
        });


        this.el.addEventListener('osm-data-loaded', e => {
            console.log(e.detail.pois)
            e.detail.pois
                .forEach ( poi => {
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
        });
    },
});