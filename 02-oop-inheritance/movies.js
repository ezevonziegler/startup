
////InheritFunction
function inheritPrototype(childObject, parentObject) {
    // As discussed above, we use the Crockford’s method to copy the properties and methods from the parentObject onto the childObject
// So the copyOfParent object now has everything the parentObject has 
    var copyOfParent = Object.create(parentObject.prototype);

    //Then we set the constructor of this new object to point to the childObject.
// Why do we manually set the copyOfParent constructor here, see the explanation immediately following this code block.
    copyOfParent.constructor = childObject;

    // Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)
   childObject.prototype = copyOfParent;
}

////////////Observer list
function ObserverList(){
  this.observerList = [];
}
 
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};
 
ObserverList.prototype.count = function(){
  return this.observerList.length;
};
 
ObserverList.prototype.get = function( index ){
  if( index > -1 && index < this.observerList.length ){
    return this.observerList[ index ];
  }
};
 
ObserverList.prototype.indexOf = function( obj, startIndex ){
  var i = startIndex;
 
  while( i < this.observerList.length ){
    if( this.observerList[i] === obj ){
      return i;
    }
    i++;
  }
 
  return -1;
};
 
ObserverList.prototype.removeAt = function( index ){
  this.observerList.splice( index, 1 );
};

////////////Abstract subject

function Subject(){
  this.observers = new ObserverList();
}
 
Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};
 
Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};
 
Subject.prototype.notify = function( context ){
  var observerCount = this.observers.count();
  for(var i=0; i < observerCount; i++){
    this.observers.get(i).update( context );
  }
};


//////////MovieObserver

function MovieObserver(){
  this.update = function( context){
    console.log(context.attributes["state"] + " " + context.attributes["title"]);
  };
}

//////Movie
function Movie () {
    Subject.call(this);

    this.attributes = {};
    this.actors = [];
}

inheritPrototype(Movie, Subject);

Movie.prototype.play = function ()  {
    this.attributes["state"] = "Playing";
    this.notify(this);
};
Movie.prototype.stop = function ()  {
    this.attributes["state"] = "Stopped";
    this.notify(this);
};
Movie.prototype.set = function (attr, value)  {
    this.attributes[attr] = value;
};
Movie.prototype.setActor = function (actor)  {
    this.actors.push(actor);
};
Movie.prototype.setAllActors = function (actor)  {
    this.actors = actor;
};
Movie.prototype.get = function (attr) {
    return this.attributes[attr]; 
};
Movie.prototype.listActors = function () {
    console.log(this.attributes["title"] + "cast:")
    this.actors.forEach(function(value, index){
        console.log("\t"+value.attributes["name"]);
    }); 
};


//////DownloadableMovie
function DownloadableMovie () {
    Movie.call(this);
}

inheritPrototype(DownloadableMovie, Movie);

Movie.prototype.download = function ()  {
    console.log("Downloading " + this.attributes["title"])
};


/////////Main

var transformers = new Movie();
var transObserver = new MovieObserver();
transformers.set("title", "Transformers");
transformers.addObserver (transObserver);

var avengers = new Movie();
var avenObserver = new MovieObserver();
avengers.set("title", "The Avengers");
avengers.addObserver(avenObserver);

var captain = new Movie();
var capObserver = new MovieObserver();
captain.set("title", "Captain America");
captain.addObserver(capObserver);

transformers.play()
avengers.play();
captain.play();

transformers.stop();
avengers.stop();
captain.stop();

var pirates = new DownloadableMovie();
pirates.set("title", "Pirates of the Carribean");
pirates.download();



/////////MovieModule
var movieModule = function () {

    Subject.call(this);
    var attributes = {};

    return {
 
        play: function ()  {
            attributes["state"] = "Playing";
            this.notify(this);
        },
     
        stop: function ()  {
            attributes["state"] = "Stopped";
            this.notify(this);
        },
     
        set: function (attr, value)  {
            attributes[attr] = value;
        },
     
        get: function (attr) {
            return this.attributes[attr]; 
        }
    };
};


// Mixin
var Mixin = function () {

};
 
Mixin.prototype = {
 
    share: function (friendName) {
        console.log( "Sharing with " + friendName );
    },
 
    like: function () {
        console.log( "I like" );
    }
};
 
 
// Extend an existing object with a method from another
function augment( receivingClass, givingClass ) {
 
    // only provide certain methods
    if ( arguments[2] ) {
        for ( var i = 2, len = arguments.length; i < len; i++ ) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }
    // provide all methods
    else {
        for ( var methodName in givingClass.prototype ) {
 
            // check to make sure the receiving class doesn't
            // have a method of the same name as the one currently
            // being processed
            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
 
            // Alternatively (check prototype chain as well):
            // if ( !receivingClass.prototype[methodName] ) {
            //  receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            // }
        }
    }
}

augment( Movie, Mixin, "share", "like" );

var fast = new Movie();
fast.set("title", "Fast & Furious");
fast.share("Emiliano F.");


//////Actor
function Actor () {

    this.attributes = {};
}

Actor.prototype.set = function (attr, value)  {
    this.attributes[attr] = value;
};
Actor.prototype.get = function (attr) {
    return this.attributes[attr]; 
};


var actor1 = new Actor();
actor1.set("name", "Paul Walker");
var actor2 = new Actor();
actor2.set("name", "Vin Diesel");
var actor3 = new Actor();
actor3.set("name", "Eva Mendez");

fast.setActor(actor1);
fast.setActor(actor2);
fast.setActor(actor3);

fast.listActors();