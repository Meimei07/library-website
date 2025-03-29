const tableEl = document.querySelector(".js-table");
const newFormEl = document.querySelector(".js-new-form");
const nameEl = document.querySelector(".js-name-container input");
const authorEl = document.querySelector(".js-author-container input");
const publisherEl = document.querySelector(".js-publisher-container input");
const publishYearEl = document.querySelector(
  ".js-publish-year-container input"
);
const pagesEl = document.querySelector(".js-pages-container input");
const copiesEl = document.querySelector(".js-copies-container input");
const editFormEl = document.querySelector(".js-edit-form");
const searchEl = document.querySelector(".js-search-bar");
const sortBtn = document.querySelector(".js-sort-btn");
const typeEl = document.querySelector(".js-sort-type");
const newBookOverlay = document.querySelector(".js-new-overlay");
const editBookOverlay = document.querySelector(".js-edit-overlay");

let bookId;
let matchingBooks;
let sortType;

// get data
let books = getFromLocalStorage("books") || [];
let cards = getFromLocalStorage("cards") || [];

// delete
function deleteBook(id) {
  const matchingCards = cards.filter((card) => card.bookId === id);
  let allBooksReturned = true;

  if (!matchingCards) {
    // can delete
    let matchingIndex = books.findIndex((book) => book.id === id);
    books.splice(matchingIndex, 1);
  } else {
    // can delete only if all books have been returned
    matchingCards.forEach((card) => {
      if (card.isReturned === false) {
        allBooksReturned = false;
        return;
      }
    });

    if (allBooksReturned === true) {
      // can delete
      let matchingIndex = books.findIndex((book) => book.id === id);
      books.splice(matchingIndex, 1);
    } else {
      alert("This book can't be deleted just yet!");
    }
  }

  // also delete from card
  if (matchingCards && allBooksReturned) {
    matchingCards.forEach((matchingCard) => {
      let matchingIndex = cards.findIndex(
        (card) => card.id === matchingCard.id
      );
      cards.splice(matchingIndex, 1);
    });
  }
  saveToLocalStorage("cards", cards);

  saveToLocalStorage("books", books);
  renderBook(books, tableEl);
}

// edit book
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

// search
function search(keyword) {
  matchingBooks = books.filter((book) => {
    return (
      book.name.toLowerCase().includes(keyword.toLowerCase()) ||
      book.author.toLowerCase().includes(keyword.toLowerCase()) ||
      book.publisher.toLowerCase().includes(keyword.toLowerCase())
    );
  });
}

// sort
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

// open new book popover
function openNewBookPopover() {
  newBookOverlay.style.display = "flex";
}

// close new book popover
function closeNewBookPopover() {
  newBookOverlay.style.display = "none";
}

// open edit book popover
function openEditBookPopover() {
  editBookOverlay.style.display = "flex";
}

// close edit book popover
function closeEditBookPopover() {
  editBookOverlay.style.display = "none";
}

renderBook(books, tableEl);

// add new book
newFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(newFormEl);
  const book = Object.fromEntries(formData.entries());

  if (book.publishYear < 1 || book.pages < 1 || book.copies < 1) {
    alert("please enter number greater than 0 only.");
    return;
  }

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  book.id = Math.floor(Math.random() * 10001);
  book.borrowCount = 0;

  books.push(book);
  saveToLocalStorage("books", books);
  renderBook(books, tableEl);

  newFormEl.reset();
  closeNewBookPopover();
});

// save edit
editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(editFormEl);
  const book = Object.fromEntries(formData.entries());

  if (book.publishYear < 1 || book.pages < 1 || book.copies < 1) {
    alert("please enter number greater than 0 only.");
    return;
  }

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  // book.id = bookId;

  let matchingIndex = books.findIndex((book) => book.id === bookId);
  const existingBook = books[matchingIndex];

  const updateBook = {
    ...existingBook,
    ...book,
    id: bookId,
  };

  books[matchingIndex] = updateBook;
  saveToLocalStorage("books", books);
  renderBook(books, tableEl);

  closeEditBookPopover();
});

// show search results
searchEl.addEventListener("keyup", () => {
  let keyword = searchEl.value;
  console.log(keyword);

  search(keyword);
  renderBook(matchingBooks, tableEl);
});

// show sort results
sortBtn.addEventListener("click", () => {
  let keyword = searchEl.value;
  sortType = typeEl.options[typeEl.selectedIndex].value;

  if (keyword === "") {
    // sort books

    sortBooks(books);
    renderBook(books, tableEl);
  } else if (keyword !== "") {
    // sort search results

    search(keyword);
    sortBooks(matchingBooks);
    renderBook(matchingBooks, tableEl);
  }
});

// handle navbar link click
styleActivePage();
