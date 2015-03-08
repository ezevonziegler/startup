define(function () {
 
    function Director (dName) {   
        his.name = dName;
        this.quotes = {};
    }
    
    Director.prototype.speak= function () {
        return this.quotes["quotes"]; 
    };

    Director.prototype.set= function (attr, value)  {
        this.quotes[attr] = value;
    };
    
    Director.prototype.getName= function ()  {
        return this.name;
    };

return Director;
});