(function() {
  const DB_NAME = 'dbNotes';
  const DB_VERSION = 1;
  const DB_STORE_NAME = 'notes';

  var db;

  function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      db = this.result;
      console.log("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    };
  }

  function clearObjectStore(store_name) {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      console.log("Object store deleted")
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
    };
  }

  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function addNote(note) {
    var obj = note;
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req;
    try {
      req = store.add(obj);
    } catch (e) {
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
    };
    req.onerror = function() {
      console.error("addNote error", this.error);
    };
  }

  var id = 0;
  var note;

  $("#saveText").click(function(){
    
    if($("#textToSave").val() != ""){

      note = new Note(id,$("#textToSave").val());

      $("#info").show();
      saveLocal(note);

      addNote(note);

      $("#textToSave").val("");
    id++;
    }
  })

  $("#clearData").click(function(){
    
    localStorage.clear();

    clearObjectStore("notes");
    
    $("#info").hide();
    $("#savedText").text("Deleted all data");

  });

  function Note(id, text){
    this.id = id;
    this.text= text;
  }
  
  function saveLocal(note){

    if (!localStorage.notes) localStorage.notes = JSON.stringify([]);


    var notes = JSON.parse(localStorage["notes"]);
    notes.push(note);
    localStorage["notes"] = JSON.stringify(notes);

    var allNotes = JSON.parse(localStorage["notes"]);
    var lastNote;
    allNotes.forEach(function(note) {
      if (note.id == id) {
        lastNote = note;
      }
    });

    $("#savedText").text(lastNote.text);
  }

  openDb();
})();