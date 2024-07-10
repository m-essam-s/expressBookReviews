const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.query;
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
  }
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
  req.session.token = token;
  return res.status(200).json({ message: "Login successful", token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username; // Assuming req.user is already populated

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Ensure req.user is populated

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
