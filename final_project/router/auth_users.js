const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userwithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userwithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if(validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message: "You should provide both username and password"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
      accessToken, username
    }
    // Store token in session
    if (!req.session.authorization) {
      req.session.authorization = {};
    }
    req.session.authorization.accessToken = accessToken;
    return res.status(200).json({ message: "User successfully logged in", accessToken });
    //return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  if(book) {
    book.reviews = review;
    res.status(200).json("Review successfully added");
  }
  //res.status(200).json("Review successfully added");
});


// Delete a book


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
