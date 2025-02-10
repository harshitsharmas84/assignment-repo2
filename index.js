const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, "data.json");

const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.post("/books", (req, res) => {
  const books = readData();
  const newBook = req.body;
  books.push(newBook);
  writeData(books);
  res.status(201).send(newBook);
});

app.get("/books", (req, res) => {
  const books = readData();
  res.send(books);
});

app.get("/books/:id", (req, res) => {
  const books = readData();
  const book = books.find((b) => b.book_id === req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
