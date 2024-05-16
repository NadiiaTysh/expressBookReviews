const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        else {
            return res.status(404).json({message: "User already exists"});
        }
    }
    return res.status(404).json({message: "Unable to register user."})
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let fetchedBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  })
  fetchedBooksPromise.then((data) => {
    return res.send(JSON.stringify(data, null, 4));
  });
  fetchedBooksPromise.catch((err) => {
    return res.send(err);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let fetchedBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  })
  fetchedBooksPromise.then((data) => {
    return res.send(JSON.stringify(data[isbn], null, 4));
  });
  fetchedBooksPromise.catch((err) => {
    return res.send(err);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let fetchedBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  })
  fetchedBooksPromise.then((data) => {
    const booksvalues = Object.values(data);
    const authorQuery = booksvalues.filter(book => book.author == author);
    return res.send(authorQuery);
  });
  fetchedBooksPromise.catch((err) => {
    return res.send(err);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let fetchedBooksPromise = new Promise((resolve, reject) => {
    resolve(books);
  })
  fetchedBooksPromise.then((data) => {
    const booksvalues = Object.values(data);
    const titleQuery = booksvalues.filter(book => book.title == title);
    return res.send(titleQuery);
  });
  fetchedBooksPromise.catch((err) => {
    return res.send(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
