const tableEl = document.querySelector(".js-table");
const newFormEl = document.querySelector(".js-new-form");
const editFormEl = document.querySelector(".js-edit-form");
const searchEl = document.querySelector(".js-search-bar");
const sortBtn = document.querySelector(".js-sort-btn");
const typeEl = document.querySelector(".js-sort-type");

let bookId;
let keyword;
let sortType;

// get data
let books = getFromLocalStorage("books") || [];
let cards = getFromLocalStorage("cards") || [];

let matchingBooks = books;

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

  matchingBooks = books;

  // in case user search or search and sort, then delete
  search(keyword);
  sortBooks(matchingBooks);

  renderBook(matchingBooks, tableEl);
}

// edit book
function editBook(id) {
  bookId = id;

  let matchingBook = books.find((book) => book.id === id);

  document.querySelector(".js-name-container input").value = matchingBook.name;
  document.querySelector(".js-author-container input").value =
    matchingBook.author;
  document.querySelector(".js-publisher-container input").value =
    matchingBook.publisher;
  document.querySelector(".js-publish-year-container input").value =
    matchingBook.publishYear;
  document.querySelector(".js-pages-container input").value =
    matchingBook.pages;
  document.querySelector(".js-copies-container input").value =
    matchingBook.copies;
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

renderBook(matchingBooks, tableEl);

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

  matchingBooks = books;
  renderBook(matchingBooks, tableEl);

  newFormEl.reset();
  newOverlay.style.display = "none";
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

  let matchingIndex = books.findIndex((book) => book.id === bookId);
  const existingBook = books[matchingIndex];

  const updateBook = {
    ...existingBook,
    ...book,
    id: bookId,
  };

  books[matchingIndex] = updateBook;
  saveToLocalStorage("books", books);

  matchingBooks = books;

  // in case user search or sort and search, then edit
  search(keyword);
  sortBooks(matchingBooks);

  renderBook(matchingBooks, tableEl);

  editOverlay.style.display = "none";
});

// show search results
searchEl.addEventListener("keyup", () => {
  keyword = searchEl.value;
  console.log(keyword);

  search(keyword);
  renderBook(matchingBooks, tableEl);
});

// show sort results
sortBtn.addEventListener("click", () => {
  sortType = typeEl.options[typeEl.selectedIndex].value;

  sortBooks(matchingBooks);
  renderBook(matchingBooks, tableEl);
});

// handle navbar link click
styleActivePage();
