const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const userWithSameName = users.filter((user) => {
    return user.username == username
  });
  return (userWithSameName > 0);
}

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
      return (user.username == username && user.password == password)
  });
  return (validUsers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
          accessToken,
          username
      }

      return res.status(200).send("User successfully logged in");
  }
  else {
      return res.status(208).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username: authUser } = req.session.authorization;
    const isbn = req.params.isbn;
    const { username, message } = req.query;
    let bookForReview = books[isbn];
    if (authUser == username) {
      bookForReview.reviews[username] = message;
      return res.send(bookForReview);
    }
    return res.status(403).json({message: "Only logged in user can update their review"});
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const isbn = req.params.isbn;
  let bookForReview = books[isbn];
  delete bookForReview.reviews[username];
  return res.send(bookForReview);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
