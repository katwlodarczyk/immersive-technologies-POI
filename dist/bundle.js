/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ \"./node_modules/aframe/dist/aframe-master.js\");\n/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsfreemaplib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsfreemaplib */ \"./node_modules/jsfreemaplib/index.js\");\n/* harmony import */ var jsfreemaplib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsfreemaplib__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nAFRAME.registerComponent(\"geolocate\", {\n    init: function() {\n        console.log('yo')\n        if(navigator.geolocation) {\n            console.log('hello')\n            // @todo change getCurrentPosition() to watchPosition() before submit\n            navigator.geolocation.getCurrentPosition (\n                    async gpspos=> {\n                         // Create a GoogleProjection object. This object is responsible for conversions\n                        // between lon/lat and Web Mercator (aka 'Google Projection')\n                        this.merc = new jsfreemaplib__WEBPACK_IMPORTED_MODULE_1__.GoogleProjection();\n                        // console.log(`Lat ${gpspos.coords.latitude} Lon ${gpspos.coords.longitude}`); // show on the console\n                        const lon = gpspos.coords.longitude;\n                        const lat = gpspos.coords.latitude;\n\n                        // project the lon and lat into Web Mercator.\n                        // returns an array with three members, first is Lon and second is Lat, third is a Zoom level\n                        const tile = this.merc.getTileFromLonLat(lon, lat, 13);\n\n                        // Output the easting and northing, and corresponding x and z coordinates, \n                        // remembering to change sign of the northing before using it for a z coordinate\n                        console.log(`Lon: ${tile[0]}, x: ${tile[0]}, Lat: ${tile[1]}, z: ${-tile[1]}`);\n\n                        // set the position of the camera\n                        this.el.sceneEl.camera.position.set(tile[0],tile[1],13)\n                        await this.fetchGeo(lon, lat)\n                    },\n        \n                    err=> {\n                        alert(`An error occurred: ${err.code}`);\n                    }\n                );\n        } else {\n            alert(\"Sorry, geolocation not supported in this browser\");\n        }\n    },\n    fetchGeo: async function(lon, lat) {\n\n        const Z = lon - 0.05;\n        const X = lat - 0.02;\n        const Y = lon + 0.05;\n\n        // Await a response from the GeoJSON API \n        const response = await fetch(`https://hikar.org/webapp/map/${Z},${X},${Y}`);\n\n        // Parse the JSON.\n        const parsedJson = await response.json();\n\n        // Loop through each feature in the GeoJSON.\n        parsedJson.features.forEach ( feature => {\n            // Print the name\n            console.log(`Name: ${feature.properties.name}`);\n            console.log(`Longitude: ${feature.geometry.coordinates[0]}, latitude: ${feature.geometry.coordinates[1]}`);\n\n            // If it's a point, print the coordinates\n            // if(feature.geometry.type == 'Point') {\n            //     console.log(`Longitude: ${feature.geometry.coordinates[0]}, latitude: ${feature.geometry.coordinates[1]}`);\n\n            //      const projected = this.merc.project(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);\n\n            // }\n        });\n    }\n});\n\n//# sourceURL=webpack://immersive-technologies-ar/./index.js?");

/***/ }),

/***/ "./node_modules/aframe/dist/aframe-master.js":
/*!***************************************************!*\
  !*** ./node_modules/aframe/dist/aframe-master.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/***/ }),

/***/ "./node_modules/jsfreemaplib/BoundingBox.js":
/*!**************************************************!*\
  !*** ./node_modules/jsfreemaplib/BoundingBox.js ***!
  \**************************************************/
/***/ ((module) => {

eval("\nclass BoundingBox {\n\n    constructor(w, s, e, n) {\n        this.bottomLeft= {};\n        this.topRight = {};\n        this.bottomLeft.x = w;\n        this.bottomLeft.y = s;\n        this.topRight.x = e;\n        this.topRight.y = n;\n    }\n\n    contains(p) {\n        try {\n        return p[0] > this.bottomLeft.x && p[0] < this.topRight.x && p[1] > this.bottomLeft.y && p[1] < this.topRight.y;\n        } catch(e) { console.log(e); }\n    }\n    \n    toString() {\n        return `${this.bottomLeft.x} ${this.bottomLeft.y} ${this.topRight.x} ${this.topRight.y}`;\n    }\n}\n\nmodule.exports = BoundingBox;\n\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/BoundingBox.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/DEM.js":
/*!******************************************!*\
  !*** ./node_modules/jsfreemaplib/DEM.js ***!
  \******************************************/
/***/ ((module) => {

eval("// Direct conversion of freemaplib's DEM class to JavaScript.\n//\n// jsfreemaplib 0.3.x version\n//\n// Note this has a BREAKING CHANGE compared to the DEM class of \n// jsfreemaplib 0.2.x.\n// Rather than an array of vertices it now simply takes an array of elevations\n// as the first argument to the constructor.\n\nclass DEM  {\n    constructor(elevs, bottomLeft, ptWidth, ptHeight, xSpacing, ySpacing) {\n        \n        this.bottomLeft=bottomLeft;\n        this.ptWidth = ptWidth;\n        this.ptHeight = ptHeight;\n        this.elevs = elevs;\n        this.xSpacing = xSpacing;\n        this.ySpacing = ySpacing;\n    }\n    \n    \n        \n    // Uses bilinear interpolation\n    // Based on Footnav code\n    // x,y must be in projection of the geometry with scaling factor \n    // already applied\n    getHeight(x, y) {\n        let p = [x,y];\n        let xIdx = Math.floor((p[0]-this.bottomLeft[0]) / this.xSpacing),\n            yIdx = this.ptHeight-(Math.ceil((p[1] - this.bottomLeft[1]) / this.ySpacing));\n        \n        let x1,x2,y1,y2;\n        let h1,h2,h3,h4;\n        \n        let h = Number.NEGATIVE_INFINITY;\n\n        // 021114 change this so that points outside the DEM are given a height based on closest edge/corner\n        // idea being to reduce artefacts at the edges of tiles\n        // this means that a -1 return cannot now be used to detect whether a point is in the DEM or not\n        // (hopefully this is NOT being done anywhere!)\n        // 200215 turning this off again due to iffy results\n        \n        if(xIdx>=0 && yIdx>=0 && xIdx<this.ptWidth-1 && yIdx<this.ptHeight-1) {\n            h1 = this.elevs[yIdx*this.ptWidth+xIdx];\n            h2 = this.elevs[yIdx*this.ptWidth+xIdx+1];\n            h3 = this.elevs[yIdx*this.ptWidth+xIdx+this.ptWidth];\n            h4 = this.elevs[yIdx*this.ptWidth+xIdx+this.ptWidth+1];\n            \n            x1 = this.bottomLeft[0] + xIdx*this.xSpacing;\n            x2 = x1 + this.xSpacing;\n            \n            // 041114 I think this was wrong change from this.ptHeight-yIdx to this.ptHeight-1-yIdx\n            y1 = this.bottomLeft[1] + (this.ptHeight-1-yIdx)*this.ySpacing;\n            y2 = y1 - this.ySpacing;\n            \n//            console.log(\"x,y bounds \" + x1 + \" \" + y1+ \" \" +x2 + \" \" +y2);\n //           console.log(\"vertices \" + h1 + \" \" + h2+ \" \" +h3 + \" \" +h4);\n            \n            let propX = (p[0]-x1)/this.xSpacing;\n            \n            let htop = h1*(1-propX) + h2*propX,\n                hbottom = h3*(1-propX) + h4*propX;\n            \n            let propY = (p[1]-y2)/this.ySpacing;\n            \n            h = hbottom*(1-propY) + htop*propY;\n            \n            //console.log(\"*******************************height is: \" + h);\n            \n        } \n        return h;\n    }\n}\n\nmodule.exports = DEM;\n\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/DEM.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/Dialog.js":
/*!*********************************************!*\
  !*** ./node_modules/jsfreemaplib/Dialog.js ***!
  \*********************************************/
/***/ ((module) => {

eval("\nfunction Dialog(parentId,callbacks,style)\n{\n    this.callbacks = callbacks;\n    this.style = style;\n    this.parent=parentId ? (document.getElementById(parentId) || document.body):\n        document.body;\n    Dialog.prototype.count = (Dialog.prototype.count) ?\n        Dialog.prototype.count+1 : 1;\n    this.id = '_dlg' + Dialog.prototype.count;\n    this.div = document.createElement(\"div\");\n    this.div.id = '_dlg' + Dialog.prototype.count;\n    this.div.style.zIndex = 999;\n    this.div.setAttribute(\"class\",\"fmap_dlg\");\n    this.actionsContainer = document.createElement(\"div\");\n    this.actionsContainer.style.textAlign = 'center';\n\tif(this.callbacks)\n\t{\n\t\tfor(k in this.callbacks)\n\t\t{\n\t\t\tif(k!=\"create\") \n\t\t\t{\n        \t\tvar btn = document.createElement(\"input\");\n        \t\tbtn.value=k;\n        \t\tbtn.type=\"button\";\n        \t\tbtn.id = this.div.id + \"_\"+k;\n        \t\tbtn.addEventListener(\"click\", this.callbacks[k]);\n        \t\tthis.actionsContainer.appendChild(btn);\n\t\t\t}\n\t\t}\n    }\n    if(style)\n        for(var s in style)\n            this.div.style[s] = style[s];\n}\n\nDialog.prototype.setContent = function(content)\n{\n    this.div.innerHTML = content;\n    this.div.appendChild(this.actionsContainer);\n}\n\nDialog.prototype.setDOMContent = function(domElement)\n{\n    while(this.div.childNodes.length > 0)\n        this.div.removeChild(this.div.firstChild);\n    this.div.appendChild(domElement);\n    this.div.appendChild(this.actionsContainer);\n}\n\nDialog.prototype.show = function()\n{\n    this.parent.appendChild(this.div);\n    this.div.style.visibility = 'visible';\n}\n\nDialog.prototype.hide = function()\n{\n    this.div.style.visibility = 'hidden';\n    this.parent.removeChild(this.div);\n}\n\nDialog.prototype.isVisible = function()\n{\n    return this.div.style.visibility=='visible';\n}\n\nDialog.prototype.setPosition = function(x,y)\n{\n\tthis.div.style.position =\"absolute\";\n    this.div.style.left=x;\n    this.div.style.top=y;\n}\n\nDialog.prototype.setSize = function(w,h)\n{\n    this.div.style.width=w;\n    this.div.style.height=h;\n}\n\nDialog.prototype.setCallback = function(btn, cb) \n{\n\tthis.callbacks[btn] = cb;\n}\n\nmodule.exports = Dialog;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/Dialog.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/GoogleProjection.js":
/*!*******************************************************!*\
  !*** ./node_modules/jsfreemaplib/GoogleProjection.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst Tile = __webpack_require__(/*! ./Tile */ \"./node_modules/jsfreemaplib/Tile.js\");\n\n\nclass GoogleProjection  {\n    \n   \n    constructor() {\n        this.EARTH = 40075016.68; \n        this.HALF_EARTH = 20037508.34;\n    } \n\n    project (lon, lat) {\n        return [this.lonToGoogle(lon), this.latToGoogle(lat)];\n    }\n    \n    unproject (projected) {\n        return [this.googleToLon(projected[0]),this.googleToLat(projected[1])];\n    }\n    \n    lonToGoogle( lon) {\n        return (lon/180) * this.HALF_EARTH;\n    }\n    \n    latToGoogle(lat) {\n        var y = Math.log(Math.tan((90+lat)*Math.PI/360)) / (Math.PI/180);\n        return y*this.HALF_EARTH/180.0;\n    }\n    \n    googleToLon(x) {\n            return (x/this.HALF_EARTH) * 180.0;\n    }\n    \n    googleToLat(y) {\n        var lat = (y/this.HALF_EARTH) * 180.0;\n        lat = 180/Math.PI * (2*Math.atan(Math.exp(lat*Math.PI/180)) - Math.PI/2);\n        return lat;\n    }\n    \n    getTile (p, z) {\n        //console.log(`getTile(): ${p[0]} ${p[1]}`);\n        var tile = new Tile(-1, -1, z);\n        var metresInTile = tile.getMetresInTile(); \n        //console.log(metresInTile);\n        tile.x = Math.floor((this.HALF_EARTH+p[0]) / metresInTile);\n        tile.y = Math.floor((this.HALF_EARTH-p[1]) / metresInTile);\n        return tile;\n    }\n    \n    getTileFromLonLat(lon, lat, z) {\n        //console.log(`getTileFromLonLat(): ${lon} ${lat} ${z}`);\n        return this.getTile([this.lonToGoogle(lon),this.latToGoogle(lat)], z);\n    }\n\n    getID() {\n        return \"epsg:3857\";\n    }\n}\n\nmodule.exports = GoogleProjection;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/GoogleProjection.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/JsonTiler.js":
/*!************************************************!*\
  !*** ./node_modules/jsfreemaplib/JsonTiler.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Tiler = __webpack_require__(/*! ./Tiler */ \"./node_modules/jsfreemaplib/Tiler.js\");\n\nclass JsonTiler extends Tiler {\n    constructor(url) {\n        super(url);\n    }\n\n    async readTile(url) {\n        const response = await fetch(url);\n        const data = await response.json();\n        return data;\n    }\n}\n\nmodule.exports = JsonTiler;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/JsonTiler.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/Nominatim.js":
/*!************************************************!*\
  !*** ./node_modules/jsfreemaplib/Nominatim.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Dialog = __webpack_require__(/*! ./Dialog */ \"./node_modules/jsfreemaplib/Dialog.js\");\n\nfunction Nominatim(options) {\n          const searchDlg = new Dialog(options.parent||document.body,\n                     {'OK': ()=> { searchDlg.hide(); }},\n                    { top: '100px', left: '100px', width: '200px',\n                     position: 'absolute',\n                        fontSize: '80%',\n                    backgroundColor: 'white',\n                    color: 'black',\n                    padding: '5px',\n                    borderRadius: '5px',\n                    border: '1px solid black'});\n        document.getElementById(options.searchBtn||'searchBtn').addEventListener('click', e=> {\n            const q = document.getElementById(options.searchField||'q').value;\n            fetch(options.url.replace('{q}', q)).then(response=>response.json()).then(json=> {\n                const nodes = json.filter(o => o.lat !== undefined && o.lon !== undefined);\n                if(nodes.length==0) {\n                    alert(`No results for '${q}'`);\n                } else {\n                    searchDlg.show();\n                    const div = document.createElement(\"div\");\n                    const h2=document.createElement(\"h2\");\n                    h2.appendChild(document.createTextNode(\"Search results\"));\n                    div.appendChild(h2);\n                    nodes.forEach(o=> {\n                        const p = document.createElement(\"p\");\n                        const a = document.createElement(\"a\");\n                        a.href='#';\n                        a.innerHTML = o.display_name;\n                        a.addEventListener(\"click\", e=> {\n                            if(options.onPlaceSelected) {\n                                options.onPlaceSelected(o.lon, o.lat);\n                            }\n                            searchDlg.hide();\n                        });\n                        p.appendChild(a);\n                        div.appendChild(p);\n                    } );\n                    searchDlg.setDOMContent(div);\n                }\n            } )\n        } );\n}\n\nmodule.exports = Nominatim;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/Nominatim.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/Tile.js":
/*!*******************************************!*\
  !*** ./node_modules/jsfreemaplib/Tile.js ***!
  \*******************************************/
/***/ ((module) => {

eval("\nclass Tile {\n        \n    constructor(x, y, z) {\n        this.x=x; this.y=y; this.z=z;\n        this.EARTH = 40075016.68; \n        this.HALF_EARTH = 20037508.34;\n    }\n\n     getMetresInTile() {\n        return this.EARTH/Math.pow(2,this.z);\n     }\n\n     getBottomLeft() {\n        var metresInTile = this.getMetresInTile();\n        return [this.x*metresInTile - this.HALF_EARTH, this.HALF_EARTH - (this.y+1)*metresInTile];    \n     }\n\n     getTopRight() {\n        var p = this.getBottomLeft();\n        var metresInTile = this.getMetresInTile();\n        p[0] += metresInTile;\n        p[1] += metresInTile;\n        return p;    \n     }\n}\n\nmodule.exports = Tile;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/Tile.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/Tiler.js":
/*!********************************************!*\
  !*** ./node_modules/jsfreemaplib/Tiler.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const GoogleProjection = __webpack_require__(/*! ./GoogleProjection */ \"./node_modules/jsfreemaplib/GoogleProjection.js\");\nconst Tile = __webpack_require__(/*! ./Tile */ \"./node_modules/jsfreemaplib/Tile.js\");\n\n// changes for 0.3.0:\n// \n// - Removed tilesLoaded array and replaceed by indexedTiles object, \n// indexing each tile of data with the z/x/y index of the tile.\n//\n// - added getData() method to download (if necessary) and return the data\n// corresponding to the tile at a given position. \n//\n// - added overridable rawTileToStoredTile() method to allow something other\n// than the raw tiled data (e.g. a DEM object) to be stored\n\nclass Tiler {\n    constructor(url) {\n        this.tile = new Tile(0, 0, 13); \n        this.url = url;\n        this.sphMerc = new GoogleProjection();\n        this.indexedTiles = { };\n    }\n\n    setZoom(z) {\n        this.tile.z = z;\n    }\n\n    lonLatToSphMerc(lon, lat) {\n        return this.sphMerc.project(lon, lat);\n    }\n\n    getTile(sphMercPos, z) {\n        return this.sphMerc.getTile(sphMercPos, z);\n    }\n\n    async update(pos) {\n        const loadedData = [];\n        let t;\n        if( t = this.needNewData(pos)) {\n            const tilesX = [t.x, t.x-1, t.x+1], tilesY = [t.y, t.y-1, t.y+1];\n            for(let ix=0; ix<tilesX.length; ix++) {    \n                for(let iy=0; iy<tilesY.length; iy++) {    \n                    const thisTile = new Tile(tilesX[ix], tilesY[iy], t.z);\n                    const data = await this.loadTile(thisTile);\n                    if(data !== null) {\n                        loadedData.push({ data: data, tile: thisTile });\n                    }\n                }\n            }\n        } \n        return loadedData;\n    }\n\n    getCurrentTiles() {\n        const tiles = [];\n        const tilesX = [this.tile.x, this.tile.x-1, this.tile.x+1], tilesY = [this.tile.y, this.tile.y-1, this.tile.y+1];\n        for(let ix=0; ix<tilesX.length; ix++) {    \n            for(let iy=0; iy<tilesY.length; iy++) {    \n                const data = this.indexedTiles[`${this.tile.z}/${tilesX[ix]}/${tilesY[iy]}`];\n                if(data !== null) {\n                    tiles.push({ data: data, tile: new Tile(ix, iy, this.tile.z) });\n                }\n            }\n        }\n        return tiles;\n    }\n\n    needNewData(pos) {\n        if(this.tile) {\n            const newTile = this.sphMerc.getTile(pos, this.tile.z);\n            const needUpdate = newTile.x != this.tile.x || newTile.y != this.tile.y;\n            this.tile = newTile;    \n            return needUpdate ? newTile : false;\n        }\n        return false;\n    }\n\n    async loadTile(tile) {\n        const tileIndex = `${tile.z}/${tile.x}/${tile.y}`;    \n        if(this.indexedTiles[tileIndex] === undefined) {\n            const tData = await this.readTile(this.url\n                .replace(\"{x}\", tile.x)\n                .replace(\"{y}\", tile.y)\n                .replace(\"{z}\", tile.z)\n            );\n            this.indexedTiles[tileIndex] = this._rawTileToStoredTile(tile, tData); // now add the data to indexedTiles\n            return this.indexedTiles[tileIndex];\n        }\n        return null;\n    }\n\n    async readTile(url) {\n        return null;\n    }\n\n    // This method was unintentionally duplicated but will not remove until \n    // 0.5.x to avoid breaking anything\n    projectLonLat(lon, lat) {\n        return this.lonLatToSphMerc(lon, lat);\n    }\n\n    // new for 0.3.0\n    // for a given sphmerc pos, downloads data if necessary and returns\n    // the data at the tile corresponding to that position\n    async getData (sphMercPos, z=13) {\n        await this.update(sphMercPos);\n        const thisTile = this.sphMerc.getTile(sphMercPos, z);\n        return this.indexedTiles[`${z}/${thisTile.x}/${thisTile.y}`];\n    }\n\n    // can be overridden if we want to store something other than the raw data\n    // (for example DEM objects if we are dealing with DEM tiles)\n    _rawTileToStoredTile(tile, data) {\n        return data;\n    }\n}\n\nmodule.exports = Tiler;\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/Tiler.js?");

/***/ }),

/***/ "./node_modules/jsfreemaplib/index.js":
/*!********************************************!*\
  !*** ./node_modules/jsfreemaplib/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const GoogleProjection = __webpack_require__(/*! ./GoogleProjection */ \"./node_modules/jsfreemaplib/GoogleProjection.js\");\nconst Tiler = __webpack_require__(/*! ./Tiler */ \"./node_modules/jsfreemaplib/Tiler.js\");\nconst Tile = __webpack_require__(/*! ./Tile */ \"./node_modules/jsfreemaplib/Tile.js\"); \nconst BoundingBox = __webpack_require__(/*! ./BoundingBox */ \"./node_modules/jsfreemaplib/BoundingBox.js\");\nconst Dialog = __webpack_require__(/*! ./Dialog */ \"./node_modules/jsfreemaplib/Dialog.js\");\nconst Nominatim = __webpack_require__(/*! ./Nominatim */ \"./node_modules/jsfreemaplib/Nominatim.js\");\nconst JsonTiler = __webpack_require__(/*! ./JsonTiler */ \"./node_modules/jsfreemaplib/JsonTiler.js\");\nconst DEM = __webpack_require__(/*! ./DEM */ \"./node_modules/jsfreemaplib/DEM.js\");\n\nmodule.exports = {\n    GoogleProjection: GoogleProjection,\n    Tiler: Tiler,\n    Tile: Tile,\n    JsonTiler: JsonTiler,\n    DEM: DEM,\n    BoundingBox: BoundingBox,\n    Dialog: Dialog,\n    Nominatim: Nominatim,\n    getBoundingBox : function(coords) {\n        var bbox = new BoundingBox(181, 91, -181, -91);\n        coords.forEach( p1 => {\n            var p = [p1[0], p1[1]];\n            if(p[0] < bbox.bottomLeft.x) {\n                bbox.bottomLeft.x = p[0];\n            }\n            if(p[1] < bbox.bottomLeft.y) {\n                bbox.bottomLeft.y = p[1];\n            }\n            if(p[0] > bbox.topRight.x) {\n                bbox.topRight.x = p[0];\n            }\n            if(p[1] > bbox.topRight.y) {\n                bbox.topRight.y = p[1];\n            }\n        });\n        return bbox;\n    },\n\n    dist: function(x1,y1,x2,y2) {\n        var dx = x2-x1, dy = y2-y1;\n        return Math.sqrt(dx*dx + dy*dy);\n    },\n\n    // from old osmeditor2 code - comments as follows:     \n    // find the distance from a point to a line     \n    // based on theory at:     \n    // astronomy.swin.edu.au/~pbourke/geometry/pointline/     \n    // given equation was proven starting with dot product     \n\n    // Now returns an object containing the distance, the intersection point \n    //and the proportion, in case we need these\n\n    haversineDistToLine: function (x, y, p1, p2)  {         \n        var u = ((x-p1[0])*(p2[0]-p1[0])+(y-p1[1])*(p2[1]-p1[1])) / (Math.pow(p2[0]-p1[0],2)+Math.pow(p2[1]-p1[1],2));        \n \n        var xintersection = p1[0]+u*(p2[0]-p1[0]), yintersection=p1[1]+u*(p2[1]-p1[1]);   \n        return (u>=0&&u<=1) ? {distance: this.haversineDist(x,y,xintersection,yintersection), intersection: [xintersection, yintersection], proportion:u} : null;\n    },     \n\n    haversineDist: function  (lon1, lat1, lon2, lat2)    {            \n        var R = 6371000;            \n        var dlon=(lon2-lon1)*(Math.PI / 180);            \n        var dlat=(lat2-lat1)*(Math.PI / 180);            \n        var slat=Math.sin(dlat/2);            \n        var slon=Math.sin(dlon/2);            \n        var a = slat*slat + Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180))*slon*slon;            \n        var c = 2 *Math.asin(Math.min(1,Math.sqrt(a)));            \n        return R*c;        \n    }\n};\n\n\n//# sourceURL=webpack://immersive-technologies-ar/./node_modules/jsfreemaplib/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;