requirejs.config({
    baseUrl: 'res/js/libs',
    paths: {
        jquery: "jquery",
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],

            exports: 'Backbone'
        },
         'backbone.localStorage': {
            exports: 'Backbone.LocalStorage'
        },
        'underscore': {
            exports: '_'
        },
        'handlebars-v3.0.0': {
            exports: 'Handlebars'
        },
        'jquery.modal': {
            deps: ['jquery'],

            exports: '$.fn.modal'
        }
    }
});

requirejs(["../main", "../tracks"]);
