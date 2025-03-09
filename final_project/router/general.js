const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(300).json({message: "User couldn't be registered"});
});

// Get the book list available in the shop
// Function to get the book list with a callback
function getBookList(callback) {
  // Simulating an asynchronous operation (e.g., database call, file read)
  setTimeout(() => {
      // If books exist, call the callback with null for error and books data
      if (books) {
          callback(null, books);
      } else {
          // If no books, call the callback with an error message
          callback("Books not found", null);
      }
  }, 1000); // Simulated delay of 1 second
}

public_users.get('/', function (req, res) {
  getBookList((error, bookList) => {
      if (error) {
          // Handling error
          res.status(500).json({ message: error });
      } else {
          // Sending the books as a JSON response
          res.send(JSON.stringify(bookList, null, 4));
      }
  });
});

function getBookDetail(isbn) {
  return new Promise((resolve, reject) => {
    // Simulating asynchronous operation with a setTimeout (like a database or API call)
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);  // Resolve the promise with the book data if found
      } else {
        reject("Book not found");  // Reject the promise if no book is found
      }
    }, 1000); // Simulated delay of 1 second
  });
}


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Using the getBookDetail function which returns a promise
  getBookDetail(isbn)
    .then((book) => {
      // Send the book details if resolved
      res.json(book);
    })
    .catch((error) => {
      // Handle error if rejected (e.g., book not found)
      res.status(404).json({ message: error });
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   res.json(book);
//  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   let filtered_book = Object.values(books).filter(book => book.author === author);
//   res.json(filtered_book);
// });


// Get book details based on author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    // Simulating an asynchronous operation with a setTimeout (like a database or API call)
    setTimeout(() => {
      // Filtering books by author
      const filteredBooks = Object.values(books).filter(book => book.author === author);
      
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);  // Resolve with the filtered books if found
      } else {
        reject("No books found by this author");  // Reject if no books are found
      }
    }, 1000); // Simulated delay of 1 second
  });
}

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Using the getBooksByAuthor function which returns a promise
  getBooksByAuthor(author)
    .then((filteredBooks) => {
      // Send the filtered books if resolved
      res.json(filteredBooks);
    })
    .catch((error) => {
      // Handle error if rejected (e.g., no books found by the author)
      res.status(404).json({ message: error });
    });
});

// Get books based on title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    // Simulating an asynchronous operation (e.g., fetching data from a database)
    setTimeout(() => {
      // Filter books by the provided title
      const filteredBooks = Object.values(books).filter(book => book.title === title);
      
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);  // Resolve with the filtered books if found
      } else {
        reject("No books found with this title");  // Reject if no books were found
      }
    }, 1000); // Simulated delay of 1 second
  });
}

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Using the getBooksByTitle function which returns a promise
  getBooksByTitle(title)
    .then((filteredBooks) => {
      // Send the filtered books if resolved
      res.json(filteredBooks);
    })
    .catch((error) => {
      // Handle error if rejected (e.g., no books found with the title)
      res.status(404).json({ message: error });
    });
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   let filtered_book = Object.values(books).filter(book => book.title === title);
//   res.json(filtered_book);
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const review = book.reviews;
  res.json(review);
});

module.exports.general = public_users;
