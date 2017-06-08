# red-loopback-example

Make sure you have Node.js and MongoDB installed.  

Clone the red-loopback-example project from Repository:  
git clone [project url]  

after project cloned go to project directory and fire below command
* npm install  

### Before start the local serve make sure you have started `mongodb`  
To start server
* npm start

Browse your REST API at http://localhost:3000/explorer  
Browse your NODE FLOW at http://localhost:3000/red

To access NODE FLOW goto api explorer and do login as a reviewer  
(credential {"email": "foo@bar.com","password": "foobar"})

### Project description
Movie based review and userRating system in which Reviewer can review to individual movie and also can rate that movie.

In Node Flow example demonstrate all red-llopback`s node 
* Validation Tab  
this tab validates year of movie which should be after 2000 and must be a valid year.  
* Opration Tab  
this tab performs various oprations  
-Average user rating opration  
-Movie release updation
* Events  
this tab performs Reviewer reset password event
