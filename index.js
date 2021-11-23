import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';
import { GoogleProjection } from 'jsfreemaplib';

AFRAME.registerComponent("geolocate", {
    init: function() {
        this.camera = document.querySelector('[camera]');
        this.loaded = false;
        window.addEventListener('gps-camera-update-position', async (e) => {
            if(this.loaded === false) {
                this.el.setAttribute('terrarium-dem', {
                    lat: e.detail.position.latitude,
                    lon: e.detail.position.longitude
                })
                // Display current location on screen
                document.getElementById('lon').innerHTML = "Longitute: "+ e.detail.position.longitude.toFixed(5);
                document.getElementById('lat').innerHTML = "Latitude: "+e.detail.position.latitude.toFixed(5);
                this.loaded = true
            }
        });
        this.el.addEventListener('elevation-available', e => {
            this.camera.object3D.position.y = e.detail.elevation+ 1.6;
        });

        this.el.addEventListener('terrarium-start-update', e => {
            document.getElementById('info').innerHTML = "Downloading elevation data...";
        })

        this.el.addEventListener('terrarium-dem-loaded', e => {
            document.getElementById('info').innerHTML = "Downloading OSM data..";
        })

        this.el.addEventListener('osm-data-loaded', e => {
            document.getElementById('info').innerHTML = "";
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

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('position', {
                            x: 50,
                            y: 50,
                            z: 50
                        })
                        board.setAttribute('geometry', {
                            primitive: 'box',
                            width: 2,
                            height: 1,
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.2
                        })


                        // Add the text entity to the compound ...
                        const textEntity = document.createElement('a-entity');
                        textEntity.setAttribute('text', {
                            value: poi.properties.name
                        });
                        textEntity.setAttribute('scale', {
                            x: 1,
                            y: 1,
                            z: 1
                        });
                        textEntity.setAttribute('look-at', '[gps-projected-camera]')
                        textEntity.setAttribute('position', {
                            x: 50,
                            y: 50,
                            z: 50,
                        })
                    
                        board.appendChild(textEntity);
                        pubCompound.appendChild(board);
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
                            x: 50,
                            y: 50,
                            z: 50,
                        });
                        textEntity.setAttribute('position', {
                            x: 0,
                            y: 10,
                            z: 0,
                        })
                    
                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('position', {
                            x: 50,
                            y: 50,
                            z: 50
                        })
                        board.setAttribute('geometry', {
                            primitive: 'box',
                            width: 2,
                            height: 1,
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.2
                        })

                        board.appendChild(textEntity);
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
                            x: 50,
                            y: 50,
                            z: 50,
                        });
                        textEntity.setAttribute('position', {
                            x: 0,
                            y: 10,
                            z: 0,
                        })
                       //  add box aka noticeboard
                       const board = document.createElement('a-entity');
                       board.setAttribute('position', {
                           x: 50,
                           y: 50,
                           z: 50
                       })
                       board.setAttribute('geometry', {
                           primitive: 'box',
                           width: 2,
                           height: 1,
                       })
                       board.setAttribute('material', {
                           color: 'white',
                           opacity: 0.2
                       })

                        board.appendChild(textEntity);
                        cafeCompound.appendChild(textEntity);
                        cafeCompound.appendChild(coffee);
                        this.el.sceneEl.appendChild(cafeCompound);
                    }
                
            });
        });
    },
});