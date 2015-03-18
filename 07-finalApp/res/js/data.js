define(["jquery", "./utils"], function($, utils) {
    return{

        getProfile: function(callback){
          $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + utils.getAccessToken()
                      },

                    success: function (response) {
                        callback(response);
                    }

                });
        },

        getPlaylists: function(callback){
         $.ajax({
              url: "https://api.spotify.com/v1/users/" + utils.getUserId() +"/playlists",
              headers: {
                  'Authorization': 'Bearer ' + utils.getAccessToken()
                },

              success: function (response) {
                  callback(response);
              }
          });

        },

        createPlaylist: function(callback){
          $.ajax({

              url: "https://api.spotify.com/v1/users/"+ utils.getUserId() +"/playlists",
              type: 'POST',
              dataType: 'json',
              data:JSON.stringify({
                  name: $("#playlistName").val()
              }),
              headers:
              {
                  'Authorization': 'Bearer ' + utils.getAccessToken(),
                  'Content-Type': 'application/json'
              },
              success: function (response) {
                  callback(response);
              }
          });
        },

        searchTracks: function(callback){
          $.ajax({
                url: 'https://api.spotify.com/v1/search',
                data: {
                    q: $("#searchText").val(),
                    type: 'track',
                    limit: '10',
                    market: 'from_token'
                },
                headers:
                {
                    'Authorization': 'Bearer ' + utils.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                success: function (response) {
                   callback(response);
                }
            });
        },

        addTracks: function(id, uris){

          $.ajax({
                      url: "https://api.spotify.com/v1/users/"+ utils.getUserId() +"/playlists/"+ id +"/tracks",
                      type: 'POST',
                      dataType: 'json',
                      data:JSON.stringify({
                        uris: uris
                    }),
                      headers:
                      {
                          'Authorization': 'Bearer ' + utils.getAccessToken(),
                          'Content-Type': 'application/json'
                      },
                      success: function (response) {

                      }
                });
        },

        getPlaylistTracks: function(id, callback){
           $.ajax({
                      url: "https://api.spotify.com/v1/users/"+ utils.getUserId() +"/playlists/"+ id +"/tracks",
                      type: 'GET',
                      headers:
                      {
                          'Authorization': 'Bearer ' + utils.getAccessToken(),
                          'Content-Type': 'application/json'
                      },
                      success: function (response) {
                        callback(response);
                      }
                });
        }
    }
});

