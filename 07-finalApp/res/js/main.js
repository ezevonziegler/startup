define(["jquery", "handlebars-v3.0.0"], function($, Handlebars) {

    (function() {

        Handlebars.registerHelper('list', function(context, options) {
          var ret = "<ul>";

          for(var i=0, j=context.length; i<j; i++) {
            ret = ret + "<li>" + options.fn(context[i]) + "</li>";
          }
          return ret + "</ul>";
       });

        $.urlParam = function(name){
            var results = new RegExp('[\#&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
               return null;
            }
            else{
               return results[1] || 0;
            }
        }

        function login() {
            var CLIENT_ID = '72c2a51a946f487388198ad6da79f6ca';
            var REDIRECT_URI = 'http://localhost:8080';
            function getLoginURL(scopes) {
                return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
                  '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
                  '&scope=' + encodeURIComponent(scopes.join(' ')) +
                  '&response_type=token';
            }

            var url = getLoginURL([
                'user-read-email playlist-modify-public'
            ]);

            window.location.href = url;

        }

        $( "#main" ).hide();

        $( "#btnLogin" ).click(function() {
            login();
        });

        if($.urlParam("access_token") != null)
        {
            localStorage.setItem('access_token', $.urlParam("access_token"));
            $( "#main" ).show();
            $( "#login" ).hide();
        }

    })();

     return {
          getAccessToken: function(){
          return  localStorage.getItem('access_token');
        }
      }
});
