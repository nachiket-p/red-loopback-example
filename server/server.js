'use strict';
var path = require('path')
var loopback = require('loopback');
var boot = require('loopback-boot');
var redLoopback = require('red-loopback');
var secureRed = require('red-loopback/secure');
var app =  loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

  // Bootstrap the application, configure models, datasources and middleware.
  // Sub-apps like REST API are mounted via boot scripts.
  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) {
      console.log("IN STARTUP", module)
      var server = app.start();

      var redSettings = {
          httpAdminRoot:"/red",
          httpNodeRoot: "/red-api",
          flowFile: "flows.json",
          userDir: path.join(__dirname, '..', ".node-red"),
      };
      const RED = redLoopback(app, server, redSettings)
      RED.start();
      app.models.Reviewer.afterRemote('login', secureRed.setLoginCookie)
      console.log("Movie: " , app.models.Movie)
      var methods = [
        "isGood", "*.isGood", "*.isBad","prototype.isBad"
      ]
      methods.forEach((method) => {
        const afterFn = function(ctx, instance, next){
          console.log("### IN-AFTER " + method, instance)
          next();
        };
        app.models.Movie.afterRemote(method, afterFn)
        app.models.Movie.beforeRemote(method, function(ctx, instance, next){
          console.log("### IN-BEFORE " + method, instance)
          next();
        })

        app.models.Movie.removeObserver(method, afterFn)
      })
      
    }
  });
