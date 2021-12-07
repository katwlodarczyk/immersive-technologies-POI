import 'aframe';
import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
            console.log('Registered successfully.');
        })
        .catch(e => {
            console.error(`Service worker registration failed: ${e}`);
        });    
} else {
    alert('Sorry, offline functionality not available, please update your browser!');
}

AFRAME.registerComponent("geolocate", {
    init: function() {
        this.camera = document.querySelector('[camera]');
        this.loaded = false;
        document.getElementById('selectType').style.visibility = "hidden" 
        window.addEventListener('gps-camera-update-position', (e) => {
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
            document.getElementById('selectType').style.visibility = "visible" 
            console.log(e.detail.pois)
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
                            x: 1,
                            y: 1,
                            z: 1
                        })

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
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
                            x:300,
                            y: 300,
                            z: 300
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
                            x:20,
                            y: 20,
                            z: 20
                        })


                        // 

                        // Add a cone entity to the compound
                    const cone = document.createElement('a-cone');

                    cone.setAttribute('material', {
                        color: 'red'
                    });
                
                    cone.setAttribute('radius-top', 0.1);
                    // cone.setAttribute('radius-bottom', 100);
                    cone.setAttribute('height', 3);
                    cone.setAttribute('scale', {
                        x: 150,
                        y: 150,
                        z: 150
                    });
                     // set the elevation
                     cone.setAttribute('position', {
                        x: 0,
                        y: 2,
                        z: 0,
                    })

                        // 

                        //  add box aka noticeboard
                        const board = document.createElement('a-entity');
                        board.setAttribute('look-at', '[gps-projected-camera]')
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
                        // cafeCompound.appendChild(coffee);
                        cafeCompound.appendChild(cone)
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
                            x:10000,
                            y: 10000,
                            z: 10000
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
            const r = confirm(`Would you like to open ${this.data.name} website?`)
            if (r == true) {
                window.open(`${this.data.website}`, '_blank')
            }
        });
    }
});