const express = require('express');
const requireAll = require('require-all');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const morgan = require('morgan');
const { errorHandler, logger } = require('forest-express');
const {
  ensureAuthenticated,
  PUBLIC_ROUTES,
} = require('forest-express-sequelize');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json({ limit: "5mb" })); // Important here, max file size
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let allowedOrigins = [/\.forestadmin\.com$/];

if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(','));
}

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
}));

app.use(jwt({
  secret: process.env.FOREST_AUTH_SECRET,
  credentialsRequired: false,
}));

/* Handle Hasura Actions */
app.post('/hasura/approve-user', (request, response, next) => {
  const models = require('./models');

  console.log('/hasura/approve-user ==> ' + JSON.stringify(request.body));
  const userId = request.body.input.id;
  models.users.update(
    { status: 'approved' },
    { where: { id: userId } }
  )
  .then(result => {
    if (result[0] ===1) {
      response.send({status: 'OK'});
    }
    else {
      response.send({status: 'FAILURE'});
    }
  })
  .catch(next);
});

app.post('/hasura/suspend-user', (request, response, next) => {
  const models = require('./models');

  console.log('/hasura/suspend-user ==> ' + JSON.stringify(request.body));
  const userId = request.body.input.id;
  models.users.update(
    { status: 'suspended' },
    { where: { id: userId } }
  )
  .then(result => {
    if (result[0] ===1) {
      response.send({status: 'OK'});
    }
    else {
      response.send({status: 'FAILURE'});
    }
  })
  .catch(next);
});
/* End of Hasura Section */

app.use('/forest', (request, response, next) => {
  if (PUBLIC_ROUTES.includes(request.url)) {
    return next();
  }
  return ensureAuthenticated(request, response, next);
});

requireAll({
  dirname: path.join(__dirname, 'routes'),
  recursive: true,
  resolve: (Module) => app.use('/forest', Module),
});

requireAll({
  dirname: path.join(__dirname, 'middlewares'),
  recursive: true,
  resolve: (Module) => Module(app),
});

app.use(errorHandler());

module.exports = app;
