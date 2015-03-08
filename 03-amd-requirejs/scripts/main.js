define(["jquery", "./movie", "./director"], function($, Movie, Director) {

  $(function() {
        
        var alien = new Movie(); 
        alien.set("name", "Alien");
        var ridleyScott = new Director('Ridley Scott'); 
        ridleyScott.set('quotes', ['Cast is everything.', 'Do what ...']); 
        alien.set('director', ridleyScott); 
        console.log(alien.get('director').getName() + " says: " + alien.get('director').speak());
    });
});