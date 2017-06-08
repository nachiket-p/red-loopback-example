'use strict';
const async = require('async');
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {
  app.models.RoleMapping.defineProperty('principalId', { type: ObjectId });

  app.models.Movie.count({}, (error, count) => {
    if (error) {
      throw error;
    }
    if (count) {
      return;
    }
    addData();
  })
  //add data
  const addData = () => {
    async.parallel({
      reviewers: async.apply(createReviewers),
      movies: async.apply(createMovies)
    }, (err, results) => {
      if (err)
        throw err;
      createReviews(results.reviewers, results.movies, function (err) {
        console.log('> models created sucessfully');
        var where = {
          "release": false,
          "releaseDate": {
            lt: new Date()
          }
        }
      });
    });
  }
  //create reviewers
  function createReviewers(cb) {
    const createReviewers = (err, role) => {
      const Reviewer = app.models.Reviewer;
      Reviewer.create([
        {
          "email": "foo@bar.com",
          "password": "foobar"
        }, {
          email: 'john@doe.com',
          password: 'johndoe'
        }, {
          email: 'jane@doe.com',
          password: 'janedoe'
        }
      ], (err, reviewers) => {
        role.principals.create({
          principalId: reviewers[0].id,
          principalType: "USER"
        })
        cb(err, reviewers)
      });
    }
    app.models.Role.create({
      name: "ADMIN"
    }, createReviewers);
  }
  //create movies
  function createMovies(cb) {
    const Movie = app.models.Movie;
    Movie.create([
      {
        name: 'Content One',
        year: 2005,
        rating: 7,
        release: true,
        releaseDate: new Date("December 17, 2005 00:00:00")
      }, {
        name: 'Content Two',
        year: 2007,
        rating: 8,
        release: true,
        releaseDate: new Date("December 17, 2007 00:00:00")
      }, {
        name: 'Content Three',
        year: 2009,
        release: false,
        releaseDate: new Date("December 17, 2017 00:00:00")
      }
    ], cb);
  }
  //create reviews
  function createReviews(reviewers, movies, cb) {
    const Review = app.models.Review;
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    Review.create([
      {
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        rating: 5,
        comments: 'A very good coffee shop.',
        publisherId: reviewers[0].id,
        movieId: movies[0].id
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        rating: 5,
        comments: 'Quite pleasant.',
        publisherId: reviewers[1].id,
        movieId: movies[0].id
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        rating: 4,
        comments: 'It was ok.',
        publisherId: reviewers[1].id,
        movieId: movies[1].id
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
        rating: 4,
        comments: 'I go here everyday.',
        publisherId: reviewers[2].id,
        movieId: movies[2].id
      }
    ], cb);
  }
};
