$(function(){

    var Movie = Backbone.Model.extend({

        defaults:{
            title: "Movie Title",
            genre: "Movie Genre",
            director: "Movie Director"
        },

    });

    var MovieList = Backbone.Collection.extend({

        model: Movie,
        localStorage: new Backbone.LocalStorage("movies-backbone"),
    });

  
    var movies = new MovieList([
        new Movie({ title: 'Transformers', genre: 'Action', director: 'Michael Bay'}),
        new Movie({ title: 'Captain America', genre: 'Action', director: 'Anthony Russo'}),
        new Movie({ title: 'Spiderman', genre: 'Action', director: 'Sam Raimi'}),
        new Movie({ title: 'The Avengers', genre: 'Action', director: 'Joss Whedon'})

    ]);

    var MovieView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#movie-template').html()),

        events:{
            "click .button"  : "edit",
            "click .details": "loadDetail",
            "click .destroy" : "clear",
            "keypress .edit"  : "updateOnEnter",
            "blur .editing"      : "close"
        },

        initialize: function(){

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('#edit-title');
            this.gen = this.$('#edit-genre');
            this.dir = this.$('#edit-director');

            return this;
        },

        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        loadDetail: function() {
            $("#movies").empty();
            
            var view1 = new DetailsView({model: this.model});
            $("#movies").append(view1.render().el);
            $("#new").hide();
        },

        close: function() {
            
            if (!this.input.val() || !this.gen.val() || !this.dir.val()) {
                return;
            } else {
                this.model.save({title: this.input.val(), genre: this.gen.val(), director: this.dir.val()});
                this.$el.removeClass("editing");
            }
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.close();
        },

        clear: function() {
            this.model.destroy();
        }
    });

    var DetailsView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#movie-details-template').html()),

        events:{
            "click .back" : "goBack"
        },

        initialize: function(){

            this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        },

        goBack: function(){

            $("#movies").empty();

             movies.each(function(movie){

                var view = new MovieView({ model: movie });
                $("#movies").append(view.render().el);
                $("#new").show();

            }, this);
         }

    });

   
    var App = Backbone.View.extend({

        el: $('#moviesapp'),

        events: {
            "keypress #new-movie":  "createOnEnter",
            "keypress #new-movie-genre":  "createOnEnter",
            "keypress #new-movie-director":  "createOnEnter"
        },

        initialize: function(){

            this.list = $('#movies');
            this.name = this.$("#new-movie");
            this.gen = this.$("#new-movie-genre");
            this.dir = this.$("#new-movie-director");

            this.listenTo(movies, 'add', this.addOne);
            this.listenTo(movies, 'reset', this.addAll);

            movies.each(function(movie){

                var view = new MovieView({ model: movie });
                this.list.append(view.render().el);
                

            }, this);
        },

        addOne: function(movie) {
            var view = new MovieView({model: movie});
            this.$("#movies").append(view.render().el);
        },

        createOnEnter: function(e) {
            if (e.keyCode != 13) return;
            if (!this.name.val() || !this.gen.val() || !this.dir.val()) return;

            movies.create({title: this.name.val(), genre: this.gen.val(), director: this.dir.val()});
            this.name.val('');
            this.gen.val('');
            this.dir.val('');
        },
    });

    new App();


});
