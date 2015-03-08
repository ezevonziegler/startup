define(["./director"], function (Director) {
    
function Movie () {
    this.attributes = {};
   
}

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
Movie.prototype.get = function (attr) {
    return this.attributes[attr]; 
};

 return Movie;
});