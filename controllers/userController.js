const Validator = require("fastest-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const models = require("./../models");

// --- Create new user
exports.signup = (req, res) => {
  // --- Check if email is used
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) res.status(409).json({ message: "Email already exists" });
      else {
        // --- Encrypt password using bcryptjs
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(req.body.password, salt, (err, hash) => {
            const user = {
              email: req.body.email,
              password: hash,
              name: req.body.name,
              dob: req.body.dob,
              phoneNb: req.body.phoneNb,
              country: req.body.country,
            };
            // --- Validating data passed in body
            const user_schema = {
              email: { type: "string", optional: false },
              password: { type: "string", optional: false },
              name: { type: "string", optional: false },
              dob: { type: "date", optional: true },
              phoneNb: { type: "string", optional: true },
              country: { type: "string", optional: true },
            };
            const v = new Validator();
            const validationResponse = v.validate(user, user_schema);
            if (validationResponse != true) {
              return res.status(400).json({
                message: "Error in Data format",
                error: validationResponse,
              });
            }
            // --- Add new user to database
            models.User.create(user)
              .then((result) => {
                res.status(201).json({
                  messsage: "User created successfully",
                  user: result,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Server error! - Location: userController>signup>1",
                  error,
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error! - Location: userController>signup>2",
        error,
      });
    });
};

// --- Login with an existing user
exports.login = (req, res) => {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user == null) {
        res.status(401).json({
          messsage: "Invalid email address",
        });
      } else {
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            // --- Delete any previous token for this user
            models.Token.destroy({ where: { userID: user.id } })
              .then((result) => {
                console.log(
                  "All token records deleted successfully for user with id ",
                  user.id
                );
              })
              .catch((error) => {
                console.log(
                  "Error while deleing token records for user with id ",
                  user.id
                );
              });
            // --- Create new token
            const jwtToken = jwt.sign(
              { email: user.email, userId: user.id },
              process.env.JWT_KEY,
              (err, token) => {
                // --- Save token in database
                const tokenObject = {
                  token: token,
                  userID: user.id,
                };
                models.Token.create(tokenObject)
                  .then((result) => {
                    console.log(
                      "Token record added to database for user with id ",
                      user.id
                    );
                  })
                  .catch((error) => {
                    console.log(
                      "Error while adding token record to database for user with id ",
                      user.id
                    );
                  });
                // --- Return success
                res.status(200).json({
                  messsage: "Logged in successfully",
                  token: token,
                });
              }
            );
          } else {
            res.status(401).json({
              messsage: "Invalid password",
            });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error! - Location: userController>login>2",
        error,
      });
    });
};

// --- Get single user
exports.getUser = (req, res) => {
  const jwtToken = req.headers.authorization.split(" ")[1];
  // --- Search for token record and get userID
  models.Token.findOne({ where: { token: jwtToken } })
    .then((record) => {
      if (record == null) {
        res.status(401).json({
          messsage: "Invalid or expired token",
        });
      } else {
        // --- Get user with id userID
        models.User.findOne({ where: { id: record.userID } })
          .then((user) => {
            if (user == null) {
              res.status(401).json({
                messsage: "Invalid or expired token",
              });
            } else {
              res.status(200).json({
                messsage: "Success",
                user: user,
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: "Server error! - Location: userController>getUser>1",
              error,
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error! - Location: userController>getUser>2",
        error,
      });
    });
};

// --- Logout a user
exports.logout = (req, res) => {
  const jwtToken = req.headers.authorization.split(" ")[1];
  // --- Delete token record from database
  models.Token.destroy({ where: { token: jwtToken } })
    .then((result) => {
      if (result == null) {
        res.status(401).json({
          messsage: "Invalid or expired token",
        });
      } else {
        res.status(200).json({
          messsage: "Success",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error! - Location: userController>logout>1",
        error,
      });
    });
};
