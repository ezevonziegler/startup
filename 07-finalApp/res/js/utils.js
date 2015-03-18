define(["jquery"], function($) {
    return {
        getAccessToken: function(){
            return  localStorage.getItem('access_token');
        },

        getUserId: function(){
            return localStorage.getItem("userId");
        }
      }
});
