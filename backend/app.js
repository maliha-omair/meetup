const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
// app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

  // backend/app.js
const routes = require('./routes');


// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}
  
  // helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({ 
      policy: "cross-origin" 
    })
);
  
  // Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

app.use(routes); // Connect all the routes


  // Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});


  // Process sequelize errors
app.use((err, _req, _res, next) => {
        // check if error is a Sequelize error:  
    if (err instanceof ValidationError) {
       var formattedErrors = {};

        err.errors.forEach((error) =>  {
          formattedErrors[error.path] = error.message;  
        });
        console.log(formattedErrors)
        err.errors = formattedErrors; 
        err.title = 'Validation Error';
        err.status = 400; 
    }
    
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  var respObj ={
    // title: err.title || 'Server Error',
    message: err.message,
    statusCode: err.status
  }; 

  if(err.errors) respObj.errors = err.errors;
  if (!isProduction) respObj.stack = err.stack;
  res.json(respObj);
});

module.exports = app;