const keys = require('../config/keys');

module.exports = (mongoose)=>{
  mongoose.connect(keys.mongoURI);
}
