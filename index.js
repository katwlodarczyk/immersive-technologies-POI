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
                            x: 1,
                            y: 1,
                            z: 1
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })

                        if (poi.properties.name) {
                            pubCompound.appendChild(board);
                        }
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
                            x:300,
                            y: 300,
                            z: 300
                        })
                    
                    
                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                    
                        if (poi.properties.name) {
                            restaurantCompound.appendChild(board);
                        }
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

                        // add cup model
                        const coffee = document.createElement('a-entity');
                        coffee.setAttribute('gltf-model', '#coffee');
                        coffee.setAttribute('scale', {
                            x:20,
                            y: 20,
                            z: 20
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 100,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                
                        if (poi.properties.name) {
                            cafeCompound.appendChild(board);
                        }
                        cafeCompound.appendChild(coffee);
                        this.el.sceneEl.appendChild(cafeCompound);
                    } else if (poi.properties.amenity == 'parking_entrance') {
                        const parkingCompound = document.createElement('a-entity');
                        parkingCompound.setAttribute('look-at', '[gps-projected-camera]')
                        parkingCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        parkingCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add parking sing model
                        const parking = document.createElement('a-entity');
                        parking.setAttribute('gltf-model', '#parking');
                        parking.setAttribute('scale', {
                            x:20,
                            y: 20,
                            z: 20
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                
                        if (poi.properties.name) {
                            parkingCompound.appendChild(board);
                        }
                        parkingCompound.appendChild(parking);
                        this.el.sceneEl.appendChild(parkingCompound);
                    } else if (poi.properties.amenity == ('suburb' || 'city' || 'locality')) {
                        const suburbCompound = document.createElement('a-entity');
                        suburbCompound.setAttribute('look-at', '[gps-projected-camera]')
                        suburbCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        suburbCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add map marker model
                        const marker = document.createElement('a-entity');
                        marker.setAttribute('gltf-model', '#marker');
                        marker.setAttribute('scale', {
                            x:10000,
                            y: 10000,
                            z: 10000
                        })

                       //  add box aka noticeboard
                       const board = document.createElement('a-entity');
                       board.setAttribute('class', 'noticeboard')
                       board.setAttribute('position', {
                           x: 0,
                           y: 50,
                           z: 0
                       })
                       board.setAttribute('geometry', {
                           primitive: 'plane',
                           width: 60,
                           height: 6
                       })
                       board.setAttribute('material', {
                           color: 'white',
                           opacity: 0.3
                       })
                       board.setAttribute('text', {
                           value: poi.properties.name,
                           align: 'center',
                           color: 'white',
                           width: 80,
                       })
                
                        if (poi.properties.name) {
                            suburbCompound.appendChild(board);
                        }
                        suburbCompound.appendChild(marker);
                        this.el.sceneEl.appendChild(suburbCompound);
                    } else if (poi.properties.amenity == 'telephone') {
                        const telephoneCompound = document.createElement('a-entity');
                        telephoneCompound.setAttribute('look-at', '[gps-projected-camera]')
                        telephoneCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        telephoneCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add map marker model
                        const telephone = document.createElement('a-entity');
                        telephone.setAttribute('gltf-model', '#marker');
                        telephone.setAttribute('scale', {
                            x:4,
                            y: 4,
                            z: 4
                        })
                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                
                        if (poi.properties.name) {
                            telephoneCompound.appendChild(board);
                        }
                        telephoneCompound.appendChild(telephone);
                        this.el.sceneEl.appendChild(telephoneCompound);
                    } else if (poi.properties.amenity == 'ferry_terminal') {
                        const ferryCompound = document.createElement('a-entity');
                        ferryCompound.setAttribute('look-at', '[gps-projected-camera]')
                        ferryCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        ferryCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add map marker model
                        const ferry = document.createElement('a-entity');
                        ferry.setAttribute('gltf-model', '#ferry');
                        ferry.setAttribute('scale', {
                            x:30,
                            y: 30,
                            z: 30
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                
                        if (poi.properties.name) {
                            ferryCompound.appendChild(board);
                        }
                        ferryCompound.appendChild(ferry);
                        this.el.sceneEl.appendChild(ferryCompound);
                    } else if (poi.properties.amenity == 'taxi') {
                        const taxiCompound = document.createElement('a-entity');
                        taxiCompound.setAttribute('look-at', '[gps-projected-camera]')
                        taxiCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        taxiCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // add map marker model
                        const taxi = document.createElement('a-entity');
                        taxi.setAttribute('gltf-model', '#taxi');
                        taxi.setAttribute('scale', {
                            x:0.3,
                            y: 0.3,
                            z: 0.3
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 50,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 60,
                            height: 6
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                        board.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                
                        if (poi.properties.name) {
                            taxiCompound.appendChild(board);
                        }
                        taxiCompound.appendChild(taxi);
                        this.el.sceneEl.appendChild(taxiCompound);
                    }        
                
            });
        });
    },
});