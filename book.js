const bookTable = document.querySelector(".book-table");

// data
const books = [
  {
    id: 1,
    name: "Macbeth",
    author: "William Shakespare",
    publisher: "William Shakespare",
    publishYear: 1623,
    pages: 249,
    copies: 5,
  },
  {
    id: 2,
    name: "Dracula",
    author: "Bram Stoker",
    publisher: "Bram Stoker",
    publishYear: 1897,
    pages: 488,
    copies: 5,
  },
];

console.log(books);

// render
function renderBook() {
  let html = "";
  bookTable.innerHTML = "";

  books.forEach((book) => {
    html += `
      <tr>
        <td>${book.id}</td>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>${book.publishYear}</td>
        <td>${book.pages}</td>
        <td>${book.copies}</td>
        <td>
          <button popovertarget="edit-book-popover" onclick="editBook(${book.id})" class="edit-btn">edit</button>
          <button onclick="deleteBook(${book.id})" class="delete-btn">delete</button>
        </td>
      </tr>
    `;
  });

  bookTable.innerHTML = `<tr>
        <th style="width: 5%">ID</th>
        <th style="width: 15%">Book</th>
        <th style="width: 15%">Author</th>
        <th style="width: 15%">Publisher</th>
        <th style="width: 10%">Publish year</th>
        <th style="width: 10%">Pages</th>
        <th style="width: 10%">Copies</th>
        <th style="width: 10%">Actions</th>
      </tr>${html}`;
}

renderBook();

function deleteBook(id) {
  let matchingIndex = books.findIndex((book) => book.id === id);
  console.log(id);
  books.splice(matchingIndex, 1);
  console.log(books);

  renderBook();
}

const bookFormEl = document.querySelector(".new-book-form");
const addBookBtn = document.querySelector(".add-book-btn");

// add new book
addBookBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const formData = new FormData(bookFormEl);
  const book = Object.fromEntries(formData.entries());

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  book.id = Math.floor(Math.random() * 10001);

  books.push(book);
  renderBook();

  bookFormEl.reset();
  document.querySelector("#new-book-popover").hidePopover();
});

// edit book
const nameEl = document.querySelector(".js-name-container input");
const authorEl = document.querySelector(".js-author-container input");
const publisherEl = document.querySelector(".js-publisher-container input");
const publishYearEl = document.querySelector(
  ".js-publish-year-container input"
);
const pagesEl = document.querySelector(".js-pages-container input");
const copiesEl = document.querySelector(".js-copies-container input");

const saveBtn = document.querySelector(".save-book-btn");
const editBookForm = document.querySelector(".edit-book-form");

let bookId;

function editBook(id) {
  bookId = id;

  let matchingBook = books.find((book) => book.id === id);

  nameEl.value = matchingBook.name;
  authorEl.value = matchingBook.author;
  publisherEl.value = matchingBook.publisher;
  publishYearEl.value = matchingBook.publishYear;
  pagesEl.value = matchingBook.pages;
  copiesEl.value = matchingBook.copies;
}

// save edit
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData(editBookForm);
  const book = Object.fromEntries(formData.entries());

  book.id = bookId;

  let matchingIndex = books.findIndex((book) => book.id === bookId);

  books[matchingIndex] = book;
  renderBook(books);

  document.querySelector("#edit-book-popover").hidePopover();
});
