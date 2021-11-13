const Sequelize = require('sequelize')
const db = require('../config/database')


const Word = db.define("allword", {
  word: {
    type: Sequelize.STRING,
  },
  definition: {
    type: Sequelize.STRING,
  },
  letter: {
    type: Sequelize.STRING,
  },  

});

module.exports = Word