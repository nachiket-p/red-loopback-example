'use strict';

module.exports = function(Movie) {
  Movie.isGood = function(movieId, cb){
    Movie.findById(movieId, function(err, instance) {
      if(err) {
        cb(err, null);
        return;
      }
      if(!instance) {
        cb(new Error(`Coudn't find Movie with id ${movieId}`), null)
        return;
      }
      const resp = instance.rating > 7
      cb(null, resp)
      console.log("isGood: " + instance.name + "? : " + resp?"YES":"NO");
    })
  }


  Movie.prototype.isBad = function(cb){
      const resp = this.rating <= 7
      cb(null, resp)
      console.log("isGood: " + this.name + "? : " + resp?"YES":"NO");
  }

  Movie.remoteMethod("isGood",{
    http: {path: "/isGood", verb: "get"},
    accepts: {arg: "id", type: 'string', http:{source: 'query'}, required: true},
    returns: {arg: 'isGood', type: 'string'}
  })
  //This is TEST remote method
  Movie.remoteMethod("isBad",{
    isStatic: false,
    http: {path: "/isBad", verb: "get"},
    returns: {arg: 'isBad', type: 'string'}
  })
};
