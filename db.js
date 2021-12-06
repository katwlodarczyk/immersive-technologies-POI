let db;

const indexedDB = window.indexedDB;
const request = indexedDB.open("POISdb", 1);

request.onsuccess = function(e) {
    db = e.target.result;
}
request.onerror = function(e) {
    console.log(e.target.errorCode)
}

request.onupgradeneeded = e=> {
    const db = e.target.result; // IDBDatabase instance
    console.log(db.version)
    // If upgrading to version >=2, delete the old object store
    if(db.version >= 2) {
        db.deleteObjectStore('pois');
    }

    const objectStore = db.createObjectStore("pois", {
            keyPath:"type"
    });

    // if(db.version == 2) {
    //     objectStore.createIndex("course", "course", { unique: false } );
    // }

    for(let i=0; i<pois.length; i++) {
        objectStore.add(pois[i]);
    }
};

// Assume we are responding to a button click
document.getElementById('search').addEventListener('click', e=> {
    const username = document.getElementById('username').value;
    const transaction = db.transaction("students");
    const objectStore = transaction.objectStore('students');
    const request = objectStore.get(username);
    request.onsuccess =  e => {
        if(e.target.result) {
            document.getElementById('username2').value  = e.target.result.username; 
            document.getElementById('name').value = e.target.result.name;
            document.getElementById('course').value = e.target.result.course;
        } else {
            displayMessage('No results!');
        } 
    };

    request.onerror = e => {
        displayMessage(`ERROR ${e.target.errorCode}`);
    };
});


