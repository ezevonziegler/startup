define(["jquery", "handlebars-v3.0.0", "backbone", "backbone.localStorage", "./utils", "./data", "jquery.modal" ], function($, Handlebars, Backbone, LocalStorage, utils, data, modal) {

    $(function(){

        var userId="";

        var Track = Backbone.Model.extend({

            defaults:{
                name: "Track Name",
                artist: "Track Artist",
                id: "Track id",
                uri: "Track uri",
                preview: "Track preview",
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
                this.listenTo(this.model, 'destroy', this.remove);
            },

            render: function(){

                this.$el.html(this.template(this.model.toJSON()));

                return this;
            },

            toggleChecked: function() {
                this.model.toggle();
                this.$el.toggleClass("checked");
                $("#addToPlaylist").attr("disabled", !$("#tracks input[type='checkbox']").is(":checked"));
            }
        });

         var PlaylistTrackView = Backbone.View.extend({
            tagName: 'li',
            template: Handlebars.compile($('#playlist-track-template').html()),

            events: {
            },

            initialize: function(){

                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
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
                this.listenTo(this.model, 'destroy', this.remove);
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

                                    PlaylistTracks.create({ name: track.track.name, id: track.track.id, uri: track.track.uri, preview: track.track.preview_url, artist: track.track.artists[0].name});
                                });
                                $("#stopPlaylist").prop('disabled', true);
                                $("#nextPlaylist").prop('disabled', true);
                            }
                            else{
                                $("#mediaButtons input").prop('disabled', true);
                                $("#info").text("There´s no tracks in this playlist yet");
                            }
                        });
                    }
                }


                if(utils.getAccessToken() != null)
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

                _.each(_.clone(Tracks.models), function(model) {
                    model.destroy();
                });

                if (!$("#searchText").val()) return;

                data.searchTracks(function(response){
                     if (response.tracks.items.length) {
                        response.tracks.items.forEach(function(track, index){

                            Tracks.create({ name: track.name, id: track.id, uri: track.uri, preview: track.preview_url, artist: track.artists[0].name});
                            $("#searchInfo").text("");
                        });
                    }
                    else{
                        $("#searchInfo").text("Sorry, there's no tracks available");
                    }
                });

            },

            performSearchOnEnter: function(e){
                if (e.keyCode != 13) return;
                this.performSearch();
            },


            newPlaylist: function(){
                $("#newForm").modal();
            },

            savePlaylist: function(){
                if (!$("#playlistName").val()) return;
                function save(callback){
                    data.createPlaylist(function(response){
                        Playlists.create({ name: response.name, id: response.id, uri: response.uri});

                        $.modal.close();
                        $("#playlistName").val("");
                        callback();
                    });
                }

                function refreshPlaylists() {
                    _.each(_.clone(Playlists.models), function(model) {
                        model.destroy();
                    });

                    data.getPlaylists(function(response) {
                        if (response.items.length > 0) {
                            response.items.forEach(function(playlist, index){

                                Playlists.create({ name: playlist.name, id: playlist.id, uri: playlist.uri});
                            });
                        }
                    });
                }

                save(function(){
                    refreshPlaylists();
                });

                this.selectPlaylist();
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

                _.each(_.clone(Tracks.models), function(model) {
                    model.destroy();
                });

                $("#searchText").val("");
                $("#addToPlaylist").prop('disabled', true);

                this.selectPlaylist();
            },

            selectPlaylist: function(){
                 _.each(_.clone(PlaylistTracks.models), function(model) {
                    model.destroy();
                });

                var id = $('#selectPlaylist option:selected div').attr("value");

                data.getPlaylistTracks(id, function(response){
                     if (response.items.length > 0) {
                        response.items.forEach(function(track, index){

                            PlaylistTracks.create({ name: track.track.name, id: track.track.id, uri: track.track.uri, preview: track.track.preview_url, artist: track.track.artists[0].name});

                        });
                        $("#info").text("");
                        $("#listenPlaylist").prop('disabled', false);
                    }
                    else
                    {
                        $("#mediaButtons input").prop('disabled', true);
                        $("#info").text("There´s no tracks in this playlist yet");
                    }
                });
            },

            listenPlaylist: function(){

                $("#listenPlaylist").prop('disabled', true);
                $("#stopPlaylist").prop('disabled', false);
                $("#nextPlaylist").prop('disabled', false);

                var audio;
                var x = 0;
                function loop(arr) {
                    play(arr[x],function(){

                        x++;

                        if(x == (arr.length - 2)) {
                            $("#nextPlaylist").prop('disabled', true);
                        }

                        if(x < arr.length) {
                            loop(arr);
                        }
                    });
                }

                function play(item,callback) {
                    audio = new Audio(item.attributes.preview);
                    audio.play();

                    audio.addEventListener('ended', function () {
                        callback();
                    });

                    $("#nextPlaylist").click(function(){
                        audio.pause();
                        callback();
                    });

                    $("#stopPlaylist").click(function(){
                        audio.pause();
                        x = PlaylistTracks.models.length;
                        $("#listenPlaylist").prop('disabled', false);
                        $("#nextPlaylist").prop('disabled', true);
                        $("#stopPlaylist").prop('disabled', true);
                        callback();
                    });
                }

                loop(PlaylistTracks.models);
            }
        });

        new App();


    });

});
