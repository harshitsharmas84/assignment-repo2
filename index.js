const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs"); // File System
const path = require("path"); // Path module

const app = express();
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, "data.json"); // Path to the data file

// Helper function to read Data from the file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write data to the file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

//Addig a new Book
app.post("/books", (req, res) => {
  const books = readData();
  const newBook = req.body;
  books.push(newBook);
  writeData(books);
  res.status(201).send(newBook);
});

//Get all books
app.get("/books", (req, res) => {
  const books = readData();
  res.send(books);
});

//Get a single book
app.get("/books/:id", (req, res) => {
  const books = readData();
  const book = books.find((b) => b.book_id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//Update a book

app.put("/books/:id", (req, res) => {
  const books = readData();
  const index = books.findIndex((b) => b.book_id === req.params.id);
  if (index !== -1) {
    const updatedBook = { ...books[index], ...req.body };
    books[index] = updatedBook;
    writeData(books);
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//Delete a book
app.delete("/books/:id", (req, res) => {
  const books = readData();
  const index = books.findIndex((b) => b.book_id === req.params.id);
  if (index !== -1) {
    books.splice(index, 1);
    writeData(books);
    res.status(204).json({ message: "Book deleted sucessfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
