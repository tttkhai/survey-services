const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const PORT = process.env.PORT || 5000;
require('./db/db')(mongoose);
require('./models/User');
require('./services/passport');


const app = express();

app.use(
    cookieSession({
      maxAge: 30*24*60*60*1000,
      keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);


app.listen(PORT,
  console.log(`Server is running on port ${PORT}`)
);
