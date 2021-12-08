import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';

// if('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./service-worker.js')
//         .then(registration => {
//             console.log('Registered successfully.');
//         })
//         .catch(e => {
//             console.error(`Service worker registration failed: ${e}`);
//         });    
// } else {
//     alert('Sorry, offline functionality not available, please update your browser!');
// }

AFRAME.registerComponent("geolocate", {
    init: function() {
        this.camera = document.querySelector('[camera]');
        this.loaded = false;
        document.getElementById('selectType').style.visibility = "hidden" 
        window.addEventListener('gps-camera-update-position', (e) => {
            // if(this.loaded === false) {
                this.el.setAttribute('terrarium-dem', {
                    lat: e.detail.position.latitude,
                    lon: e.detail.position.longitude
                })
                // Display current location on screen
                document.getElementById('lon').innerHTML = "Longitute: "+ e.detail.position.longitude.toFixed(5);
                document.getElementById('lat').innerHTML = "Latitude: "+e.detail.position.latitude.toFixed(5);
            //     this.loaded = true
            // }
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
            document.getElementById('selectType').style.visibility = "visible" 
            console.log(e.detail.rawData.ways);
            e.detail.pois
                .forEach ( poi => {
                    if (poi.properties.amenity == 'pub') {
                        const pubCompound = document.createElement('a-entity');
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
                            x: 5,
                            y: 5,
                            z: 5
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 1,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 20,
                            height: 2
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })
                       
                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 20,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)

                        if (poi.properties.website) {
                            console.log(poi.properties)
                            pubCompound.setAttribute('clicker', {name:poi.properties.name, website: poi.properties.website});
                        }
                        if (poi.properties.name) {
                            pubCompound.appendChild(board);
                        }
                        pubCompound.appendChild(bottle);

                        this.el.sceneEl.appendChild(pubCompound);

                        const pubCheckbox = document.querySelector('input[value="pubs"]')
                        pubCheckbox.addEventListener('change', () => {
                            if(pubCheckbox.checked) {
                                pubCompound.object3D.visible = true
                            } else {
                                pubCompound.object3D.visible = false
                            }
                        })

                    } else if (poi.properties.amenity == 'restaurant') {
                        const restaurantCompound = document.createElement('a-entity');
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
                            x:20,
                            y: 20,
                            z: 20
                        })
                    
                    
                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 5,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 20,
                            height: 2
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })

                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 20,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                    
                        const restaurantCheckbox = document.querySelector('input[value="restaurants"]')
                        restaurantCheckbox.addEventListener('change', () => {
                            if(restaurantCheckbox.checked) {
                                restaurantCompound.object3D.visible = true
                            } else {
                                restaurantCompound.object3D.visible = false
                            }
                        })

                        if (poi.properties.website && restaurantCheckbox.checked) {
                            restaurantCompound.setAttribute('clicker', {name:poi.properties.name, website: poi.properties.website});
                        }
                        if (poi.properties.name) {
                            restaurantCompound.appendChild(board);
                        }
                        restaurantCompound.appendChild(burger);
                        this.el.sceneEl.appendChild(restaurantCompound);

                    } else if (poi.properties.amenity == 'cafe') {
                        const cafeCompound = document.createElement('a-entity');
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
                            x:1,
                            y: 1,
                            z: 1
                        });

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 5,
                            z: 0
                        })
                        board.setAttribute('geometry', {
                            primitive: 'plane',
                            width: 20,
                            height: 2
                        })
                        board.setAttribute('material', {
                            color: 'white',
                            opacity: 0.3
                        })

                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 20,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                
                        const cafeCheckbox = document.querySelector('input[value="cafe"]')
                        cafeCheckbox.addEventListener('change', () => {
                            if(cafeCheckbox.checked) {
                                cafeCompound.object3D.visible = true
                            } else {
                                cafeCompound.object3D.visible = false
                            }
                        })

                        if (poi.properties.website && cafeCheckbox.checked) {
                            cafeCompound.setAttribute('clicker', {name:poi.properties.name, website: poi.properties.website});
                        }

                        if (poi.properties.name) {
                            cafeCompound.appendChild(board);
                        }
                        cafeCompound.appendChild(coffee);
                        this.el.sceneEl.appendChild(cafeCompound);


                    } else if (poi.properties.amenity == ('suburb' || 'city' || 'locality')) {
                        const suburbCompound = document.createElement('a-entity');
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
                            x:20,
                            y: 20,
                            z: 20
                        })

                       //  add box aka noticeboard
                       const board = document.createElement('a-entity');
                       board.setAttribute('look-at', '[gps-projected-camera]')
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

                    const textEntity = document.createElement('a-entity')
                    textEntity.setAttribute('text', {
                        value: poi.properties.name,
                        align: 'center',
                        color: 'white',
                        width: 80,
                    })
                    textEntity.setAttribute('position', {
                        x:0,
                        y:0,
                        z: 5
                    })

                    board.appendChild(textEntity)
                
                        if (poi.properties.name) {
                            suburbCompound.appendChild(board);
                        }
                        suburbCompound.appendChild(marker);
                        this.el.sceneEl.appendChild(suburbCompound);

                        const localityCheckbox = document.querySelector('input[value="locality"]')
                        localityCheckbox.addEventListener('change', () => {
                            if(localityCheckbox.checked) {
                                suburbCompound.object3D.visible = true
                            } else {
                                suburbCompound.object3D.visible = false
                            }
                        })

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
                            x:2,
                            y: 2,
                            z: 2
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');

                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 80,
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
                       
                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                
                        const parkingCheckbox = document.querySelector('input[value="carpark"]')
                        parkingCheckbox.addEventListener('change', () => {
                            if(parkingCheckbox.checked) {
                                parkingCompound.object3D.visible = true
                            } else {
                                parkingCompound.object3D.visible = false
                            }
                        })

                        if (poi.properties.name) {
                            parkingCompound.appendChild(board);
                        }
                        parkingCompound.appendChild(parking);
                        this.el.sceneEl.appendChild(parkingCompound);
                    }
                    else if (poi.properties.amenity == 'telephone') {
                        const telephoneCompound = document.createElement('a-entity');
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
                        board.setAttribute('look-at', '[gps-projected-camera]')
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
                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                
                        const phoneCheckbox = document.querySelector('input[value="phone"]')
                        phoneCheckbox.addEventListener('change', () => {
                            if(phoneCheckbox.checked) {
                                telephoneCompound.object3D.visible = true
                            } else {
                                telephoneCompound.object3D.visible = false
                            }
                        })

                        if (poi.properties.name) {
                            telephoneCompound.appendChild(board);
                        }
                        telephoneCompound.appendChild(telephone);
                        this.el.sceneEl.appendChild(telephoneCompound);
                    } else if (poi.properties.amenity == 'ferry_terminal') {
                        const ferryCompound = document.createElement('a-entity');
                        // ferryCompound.setAttribute('look-at', '[gps-projected-camera]')
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
                            x: 120,
                            y: 120,
                            z: 120
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 90,
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
                       
                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                
                        const ferryCheckbox = document.querySelector('input[value="ferry"]')
                        ferryCheckbox.addEventListener('change', () => {
                            if(ferryCheckbox.checked) {
                                ferryCompound.object3D.visible = true
                            } else {
                                ferryCompound.object3D.visible = false
                            }
                        })

                        if (poi.properties.name) {
                            ferryCompound.appendChild(board);
                        }
                        ferryCompound.appendChild(ferry);
                        this.el.sceneEl.appendChild(ferryCompound);
                    } else if (poi.properties.amenity == 'taxi') {
                        const taxiCompound = document.createElement('a-entity');
                        taxiCompound.setAttribute('position', {
                            x: 0,
                            y: poi.geometry.coordinates[2],
                            z: 0,
                        })
                        taxiCompound.setAttribute('gps-projected-entity-place', {
                            latitude:poi.geometry.coordinates[1],
                            longitude:poi.geometry.coordinates[0]
                        });

                        // // add model
                        const taxi = document.createElement('a-entity');
                        taxi.setAttribute('gltf-model', '#taxi');
                        taxi.setAttribute('scale', {
                            x:1,
                            y: 1,
                            z: 1
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
                        board.setAttribute('class', 'noticeboard')
                        board.setAttribute('position', {
                            x: 0,
                            y: 0,
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
                        
                        const textEntity = document.createElement('a-entity')
                        textEntity.setAttribute('text', {
                            value: poi.properties.name,
                            align: 'center',
                            color: 'white',
                            width: 80,
                        })
                        textEntity.setAttribute('position', {
                            x:0,
                            y:0,
                            z: 5
                        })

                        board.appendChild(textEntity)
                
                        const taxiCheckbox = document.querySelector('input[value="taxi"]')
                        taxiCheckbox.addEventListener('change', () => {
                            if(taxiCheckbox.checked) {
                                taxiCompound.object3D.visible = true
                            } else {
                                taxiCompound.object3D.visible = false
                            }
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


AFRAME.registerComponent("clicker", {
    schema: {
        name: {
            type: 'string',
            default: ''
        },
        website: {
            type: 'string',
            default: ''
        },
    },
    init: function() {
        this.el.addEventListener('click', e=> {
            const r = confirm(`Would you like to open ${this.data.name} website: ${this.data.website}?`)
            if (r == true) {
                window.open(`${this.data.website}`, '_blank')
            }
        });
    }
});


window.onload = function(){ 
    const modal = document.getElementById("modal");
    const btn = document.getElementById("filterBtn");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
    modal.style.display = "block";
    }

    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
};
