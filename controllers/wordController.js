const Word = require("../models/word");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var autocorrect;

// --- Get all words
exports.getAll = (req, res) => {
  Word.findAll({ order: [["word", "ASC"]] })
    .then((words) => {
      if (words.length === 0) {
        res.status(409).json({ message: "No words in the dictionary", words });
      }
      res.status(200).json({ message: "Words Accessed Successfuly", words });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error Occured!", err });
    });
};

// --- Add a word
exports.addWord = (req, res) => {
  let { word, definition } = req.body;
  word = word.toLowerCase().replace(/\s+/g, " ").trim();
  const letter = word[0];
  Word.create({ word, definition, letter })
    .then((word) => {
      res.status(200).json({ message: "Word Successfully Added!", word });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error Occured", err });
    });
};

// --- Search for a word
exports.searchWord = (req, res) => {
  let word = req.body.word;
  console.log(req.body);
  word = word.toLowerCase();
  Word.findAll({
    where: {
      word: {
        [Op.and]: {
          [Op.or]: { [Op.like]: word + " %", [Op.substring]: `${word}(` },
          [Op.like]: `${word}%`,
        },
      },
    },
    order: [["word", "ASC"]],
  })
    .then((words) => {
      if (words.length === 0) {
        this.autocorrectFunc(req, res);
      } else {
        res
          .status(200)
          .json({ message: "Searched Successfully", words });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error Occured > searchWord > 2", err });
    });
};

// --- Search for a word Option 
exports.searchWordOpt = (req, res) => {
  let word = req.body.word;
  console.log(req.body);
  word = word.toLowerCase();
  Word.findAll({
    where: {
      word: {
        [Op.or]: {
          [Op.substring]: ` ${word}`,
          [Op.like]: `${word}%`,
        },
      },
    },
    order: [["word", "ASC"]],
  })
    .then((words) => {
      if (words.length === 0) {
        res.status(200).json({ message: "Invalid Word", words });
      } else {
        res.status(200).json({ message: "Searched Successfully", words });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error Occured", err });
    });
};

// --- VefiryAdmin
exports.verifyAdmin = (req, res) => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin";
  const { email, password } = req.body;
  if (adminEmail === email && adminPassword === password) {
    res.status(200).json({ message: "Successful Authentication!" });
  } else {
    res.status(409).json({ message: "Invalid Password or Username" });
  }
};

// --- Delete a word
exports.deleteWord = (req, res) => {
  const wordID = req.params.id;
  Word.destroy({ where: { id: wordID } })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Word Deleted Successfuly", result });
      } else {
        res.status(401).json({
          message: "Invalid ID",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error!",
        error,
      });
    });
};

// --- AutoCorrect a word
exports.autocorrectFunc = (req, res) => {
  const word = req.body.word;

  Word.findAll({ order: [["word", "ASC"]] })
    .then((words) => {
      if (words.length === 0) {
        res.status(409).json({ message: "No words in the dictionary", words });
      }
      var frenchWords = [];
      for (var i = 0; i < words.length; i++) {
        let splittedWord = words[i].word;
        if (splittedWord.includes("(")) {
          splittedWord = splittedWord.split("(");
          splittedWord = splittedWord[0].trim();
        }
        frenchWords.push(splittedWord);
      }
      autocorrect = require("autocorrect")({ words: frenchWords });
      const correctedWord = autocorrect(word);
      if (!correctedWord) {
        res.status(409).json({ message: "Word not found" });
      }
      res.status(201).json({ message: "Do you mean", correctedWord });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error Occured!", err });
    });
};
