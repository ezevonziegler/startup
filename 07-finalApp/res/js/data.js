define(["jquery", "./main"], function($, main) {
    return{

        getProfile: function(callback){
          $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + main.getAccessToken()
                      },

                    success: function (response) {
                        callback(response);
                    }

                });
        },

        getPlaylists: function(callback){
         $.ajax({
              url: "https://api.spotify.com/v1/users/" + localStorage.getItem("userId") +"/playlists",
              headers: {
                  'Authorization': 'Bearer ' + main.getAccessToken()
                },

              success: function (response) {
                  callback(response);
              }
          });

        },

        createPlaylist: function(callback){
          $.ajax({

              url: "https://api.spotify.com/v1/users/"+ localStorage.getItem("userId") +"/playlists",
              type: 'POST',
              dataType: 'json',
              data:JSON.stringify({
                  name: $("#playlistName").val()
              }),
              headers:
              {
                  'Authorization': 'Bearer ' + main.getAccessToken(),
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
                    limit: '10'
                },
                success: function (response) {
                   callback(response);
                }
            });
        },

        addTracks: function(id, uris){

          $.ajax({
                      url: "https://api.spotify.com/v1/users/"+ localStorage.getItem("userId") +"/playlists/"+ id +"/tracks",
                      type: 'POST',
                      dataType: 'json',
                      data:JSON.stringify({
                        uris: uris
                    }),
                      headers:
                      {
                          'Authorization': 'Bearer ' + main.getAccessToken(),
                          'Content-Type': 'application/json'
                      },
                      success: function (response) {

                      }
                });
        },

        getPlaylistTracks: function(id, callback){
           $.ajax({
                      url: "https://api.spotify.com/v1/users/"+ localStorage.getItem("userId") +"/playlists/"+ id +"/tracks",
                      type: 'GET',
                      headers:
                      {
                          'Authorization': 'Bearer ' + main.getAccessToken(),
                          'Content-Type': 'application/json'
                      },
                      success: function (response) {
                        callback(response);
                      }
                });
        }
    }
});

