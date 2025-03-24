const bookTable = document.querySelector(".js-book-table");

// get data
let books = getFromLocalStorage();
if (books === null || books.length === 0) {
  books = [];
}

// const books = [
//   {
//     id: 1,
//     name: "Macbeth",
//     author: "William Shakespare",
//     publisher: "William Shakespare",
//     publishYear: 1623,
//     pages: 249,
//     copies: 5,
//   },
//   {
//     id: 2,
//     name: "Dracula",
//     author: "Bram Stoker",
//     publisher: "Bram Stoker",
//     publishYear: 1897,
//     pages: 488,
//     copies: 5,
//   },
// ];

console.log(books);

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("books"));
}

// render
function renderBook(books) {
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
          <button popovertarget="edit-book-popover" onclick="editBook(${book.id})" class="edit-book-btn js-edit-book-btn">edit</button>
          <button onclick="deleteBook(${book.id})" class="delete-book-btn js-delete-book-btn">delete</button>
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

renderBook(books);

// add new book
const bookFormEl = document.querySelector(".js-new-book-form");

bookFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookFormEl);
  const book = Object.fromEntries(formData.entries());

  if (book.publishYear < 1 || book.pages < 1 || book.copies < 1) {
    alert("please enter number greater than 0 only.");
    return;
  }

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  book.id = Math.floor(Math.random() * 10001);

  books.push(book);
  saveToLocalStorage();

  renderBook(books);

  bookFormEl.reset();
  document.querySelector("#new-book-popover").hidePopover();
});

console.log(books);

// delete
function deleteBook(id) {
  let matchingIndex = books.findIndex((book) => book.id === id);
  console.log(id);
  books.splice(matchingIndex, 1);
  console.log(books);

  saveToLocalStorage();
  renderBook(books);
}

// edit book
const nameEl = document.querySelector(".js-name-container input");
const authorEl = document.querySelector(".js-author-container input");
const publisherEl = document.querySelector(".js-publisher-container input");
const publishYearEl = document.querySelector(
  ".js-publish-year-container input"
);
const pagesEl = document.querySelector(".js-pages-container input");
const copiesEl = document.querySelector(".js-copies-container input");

const editBookForm = document.querySelector(".js-edit-book-form");

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
editBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(editBookForm);
  const book = Object.fromEntries(formData.entries());

  if (book.publishYear < 1 || book.pages < 1 || book.copies < 1) {
    alert("please enter number greater than 0 only.");
    return;
  }

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  book.id = bookId;

  let matchingIndex = books.findIndex((book) => book.id === bookId);

  books[matchingIndex] = book;
  saveToLocalStorage();
  renderBook(books);

  document.querySelector("#edit-book-popover").hidePopover();
});

// search
const searchEl = document.querySelector(".js-search-bar");
let matchingBooks;

function search(keyword) {
  matchingBooks = books.filter((book) => {
    return (
      book.name.toLowerCase().includes(keyword.toLowerCase()) ||
      book.author.toLowerCase().includes(keyword.toLowerCase()) ||
      book.publisher.toLowerCase().includes(keyword.toLowerCase())
    );
  });
}

searchEl.addEventListener("keyup", () => {
  let keyword = searchEl.value;
  console.log(keyword);

  search(keyword);
  renderBook(matchingBooks);
});

// sort
const sortBtn = document.querySelector(".js-sort-book-btn");
const typeEl = document.querySelector(".js-sort-type");

let sortType;

function sortBooks(books) {
  switch (sortType) {
    case "name":
      books.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "author":
      books.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "copies":
      books.sort((a, b) => b.copies - a.copies);
      break;
    default:
      break;
  }
}

sortBtn.addEventListener("click", () => {
  let keyword = searchEl.value;
  sortType = typeEl.options[typeEl.selectedIndex].value;

  if (keyword === "") {
    // sort books

    sortBooks(books);
    renderBook(books);
  } else if (keyword !== "") {
    // sort search results

    search(keyword);
    sortBooks(matchingBooks);
    renderBook(matchingBooks);
  }
});
