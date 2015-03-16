define(["jquery", "handlebars-v3.0.0", "backbone", "backbone.localStorage", "./main", "./data", "jquery.modal" ], function($, Handlebars, Backbone, LocalStorage, main, data, modal) {

    $(function(){

        var userId="";

        var Track = Backbone.Model.extend({

            defaults:{
                name: "Track Name",
                id: "Track id",
                uri: "Track uri",
                checked: false
            },

            toggle: function() {
              this.set('checked', !this.get('checked'));
            }
        });

        var TrackList = Backbone.Collection.extend({

            model: Track,
            localStorage: new Backbone.LocalStorage("tracks-backbone"),

            checked: function() {
              return this.where({checked: true});
            },

            getAll: function(){
                return this;
            }
        });

        var Tracks = new TrackList;
        var PlaylistTracks = new TrackList;

        var TrackView = Backbone.View.extend({
            tagName: 'li',
            template: Handlebars.compile($('#track-template').html()),

            events: {
                "click .toggle": "toggleChecked"
            },

            initialize: function(){

                this.listenTo(this.model, 'change', this.render);
                //this.listenTo(this.model, 'destroy', this.remove);
            },

            render: function(){

                this.$el.html(this.template(this.model.toJSON()));

                return this;
            },

            toggleChecked: function() {
                this.model.toggle();
            }
        });

         var PlaylistTrackView = Backbone.View.extend({
            tagName: 'li',
            template: Handlebars.compile($('#playlist-track-template').html()),

            events: {
            },

            initialize: function(){

                this.listenTo(this.model, 'change', this.render);
                //this.listenTo(this.model, 'destroy', this.remove);
            },

            render: function(){

                this.$el.html(this.template(this.model.toJSON()));

                return this;
            }
        });

        var Playlist = Backbone.Model.extend({

            defaults:{
                name: "Playlist Name",
                id: "Playlist id",
                uri: "Playlist uri",
                selected: false
            },

            toggle: function() {
              this.set("selected", !this.get("selected"));
            }
        });

        var PlaylistList = Backbone.Collection.extend({

            model: Playlist,
            localStorage: new Backbone.LocalStorage("playlist-backbone"),

            selected: function() {
              return this.where({selected: true});
            },

            getAll: function(){
                return this;
            }
        });

        var Playlists = new PlaylistList;

        var PlaylistView = Backbone.View.extend({
            tagName: 'option',
            template: Handlebars.compile($('#playlist-template').html()),

            events: {

            },

            initialize: function(){

                this.listenTo(this.model, 'change', this.render);
                //this.listenTo(this.model, 'destroy', this.remove);
            },

            render: function(){

                this.$el.html(this.template(this.model.toJSON()));

                return this;
            }
        });

        var App = Backbone.View.extend({

            el: $('#playlistsapp'),

            events: {
                "keypress #searchText":  "performSearchOnEnter",
                "click #search":  "performSearch",
                "click #savePlaylist":  "savePlaylist",
                "click #listenPlaylist": "listenPlaylist",
                "change #selectPlaylist": "selectPlaylist",
                "click #newPlaylist": "newPlaylist",
                "click #cancelPlaylist": "cancelPlaylist",
                "click #addToPlaylist": "addToPlaylist"


            },

            render: function(){

            },

            initialize: function(){

                this.list = $('#tracks');

                this.listenTo(Tracks, 'add', this.addOne);
                this.listenTo(Tracks, 'reset', this.addAll);
                this.listenTo(Tracks, 'all', this.render);

                this.listenTo(Playlists, 'add', this.addOnePlaylist);
                this.listenTo(Playlists, 'reset', this.addAllPlaylist);
                this.listenTo(Playlists, 'all', this.render);

                this.listenTo(PlaylistTracks, 'add', this.addOneTrack);
                this.listenTo(PlaylistTracks, 'reset', this.addAllTracks);
                this.listenTo(PlaylistTracks, 'all', this.render);

                function loadProfile(callback) {
                    data.getProfile(function(response) {
                        localStorage.setItem('userId', response.id);
                        $('#user').text(response.id);
                        callback();
                    });
                }

                function loadPlaylists(callback) {
                    data.getPlaylists(function(response) {
                           if (response.items.length > 0) {
                          response.items.forEach(function(playlist, index){

                              Playlists.create({ name: playlist.name, id: playlist.id, uri: playlist.uri});
                            });
                        }
                        callback();
                    });
                }

                function loadTracks() {
                    if($('#selectPlaylist option:selected div').attr("value") != null)
                    {
                        var id = $('#selectPlaylist option:selected div').attr("value");

                        data.getPlaylistTracks(id, function(response){
                            if (response.items.length) {
                                response.items.forEach(function(track, index){

                                    PlaylistTracks.create({ name: track.track.name, id: track.track.id, uri: track.track.uri});
                                });
                            }
                        });
                    }
                }


                if(main.getAccessToken() != null)
                {
                    loadProfile(function(){
                        loadPlaylists(function(){
                            loadTracks();
                        });
                    });
                }
            },

            addOne: function(track) {
                var view = new TrackView({model: track});
                this.$("#tracks").append(view.render().el);
            },

            addAll: function() {
                Tracks.each(this.addOne, this);
            },

            addOnePlaylist: function(playlist) {
                var view = new PlaylistView({model: playlist});
                this.$("#selectPlaylist").append(view.render().el);
            },

            addAllPlaylist: function() {
                Playlists.each(this.addOnePlaylist, this);
            },

            addOneTrack: function(track) {
                var view = new PlaylistTrackView({model: track});
                this.$("#playlistTracks").append(view.render().el);
            },

            addAllTracks: function() {
                PlaylistTracks.each(this.addOneTrack, this);
            },

            performSearch: function(){

                _.invoke(Tracks.getAll(), 'destroy');
                $("#tracks").empty();

                if (!$("#searchText").val()) return;

                data.searchTracks(function(response){
                     if (response.tracks.items.length) {
                        response.tracks.items.forEach(function(track, index){

                            Tracks.create({ name: track.name, id: track.id, uri: track.uri});

                        });
                    }
                });

            },

            performSearchOnEnter: function(e){
                if (e.keyCode != 13) return;
                $("#search").click();
            },

            newPlaylist: function(){
                $("#newForm").modal();
            },

            savePlaylist: function(){
                if (!$("#playlistName").val()) return;
                data.createPlaylist(function(response){
                    Playlists.create({ name: response.name, id: response.id, uri: response.uri});

                    $.modal.close();
                    $("#playlistName").val("");
                });
            },

            cancelPlaylist: function(){
                $.modal.close();
                $("#playlistName").val("");
            },

            addToPlaylist: function(){
                var add = Tracks.checked();
                var uris= [];

                add.forEach(function(track, index){
                    uris.push(track.attributes.uri);
                });

                var id = $('#selectPlaylist option:selected div').attr("value");

                data.addTracks(id, uris);

                //_.invoke(Tracks.getAll(), 'destroy');
                //$("#tracks").empty();

            },

            selectPlaylist: function(){
                _.invoke(Tracks.getAll(), 'destroy');
                $("#playlistTracks").empty();

                var id = $('#selectPlaylist option:selected div').attr("value");

                data.getPlaylistTracks(id, function(response){
                     if (response.items.length) {
                        response.items.forEach(function(track, index){

                            PlaylistTracks.create({ name: track.track.name, id: track.track.id, uri: track.track.uri});

                        });
                    }
                });
            }
        });

        new App();


    });

});
