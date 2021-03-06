//store data locally until getting network
let db;
const request = window.indexedDB.open("budget", 1);

// Create schema
request.onupgradeneeded = event => {
    const db = event.target.result;
    // Creates an object store 
    db.createObjectStore("pending", { autoIncrement: true });
};

// Opens a transaction, accesses the objectStore and transactionIndex.
request.onsuccess = event => {
    db = event.target.result;

    //check if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = event => {
    console.log("Woops" + event.target.errorCode)
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                });
        }
    }
};

function deletePending() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.clear();
  }
  
window.addEventListener("online", checkDatabase)