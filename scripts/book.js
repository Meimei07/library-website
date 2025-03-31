const tableEl = document.querySelector(".js-table");
const newFormEl = document.querySelector(".js-new-form");
const editFormEl = document.querySelector(".js-edit-form");
const searchEl = document.querySelector(".js-search-bar");
const sortBtn = document.querySelector(".js-sort-btn");
const typeEl = document.querySelector(".js-sort-type");

let bookId;
let keyword = "";
let sortType;

// get data
let books = getFromLocalStorage("books") || [
  {
    id: 5723,
    name: "The Silent Echo",
    author: "James Thornton",
    publisher: "Harper & Sons",
    publishYear: 2015,
    pages: 320,
    copies: 5,
    borrowCount: 0,
  },
  {
    id: 8391,
    name: "Whispering Shadows",
    author: "Emily Carter",
    publisher: "Penguin Books",
    publishYear: 2019,
    pages: 450,
    copies: 3,
    borrowCount: 0,
  },
  {
    id: 4762,
    name: "Lost in the Fog",
    author: "Daniel Smith",
    publisher: "Orbit Publications",
    publishYear: 2012,
    pages: 275,
    copies: 7,
    borrowCount: 0,
  },
  {
    id: 1920,
    name: "The Forgotten Path",
    author: "Sophia Bennett",
    publisher: "Random House",
    publishYear: 2008,
    pages: 390,
    copies: 4,
    borrowCount: 0,
  },
  {
    id: 6583,
    name: "Echoes of Time",
    author: "Oliver Greene",
    publisher: "Vintage Press",
    publishYear: 2016,
    pages: 310,
    copies: 6,
    borrowCount: 0,
  },
  {
    id: 3748,
    name: "Midnight Tales",
    author: "Isabella Clarke",
    publisher: "Scholastic",
    publishYear: 2021,
    pages: 500,
    copies: 2,
    borrowCount: 0,
  },
  {
    id: 9251,
    name: "Beneath the Waves",
    author: "Henry Dawson",
    publisher: "Pearson Publishing",
    publishYear: 2017,
    pages: 280,
    copies: 9,
    borrowCount: 0,
  },
  {
    id: 8326,
    name: "Crimson Sky",
    author: "Charlotte Taylor",
    publisher: "HarperCollins",
    publishYear: 2013,
    pages: 420,
    copies: 3,
    borrowCount: 0,
  },
  {
    id: 1209,
    name: "Fading Footsteps",
    author: "Lucas Martin",
    publisher: "Simon & Schuster",
    publishYear: 2005,
    pages: 350,
    copies: 8,
    borrowCount: 0,
  },
  {
    id: 4917,
    name: "Veil of Secrets",
    author: "Grace Harrison",
    publisher: "Macmillan",
    publishYear: 2020,
    pages: 295,
    copies: 5,
    borrowCount: 0,
  },
  {
    id: 6782,
    name: "The Hidden Truth",
    author: "Ethan Cooper",
    publisher: "Oxford Press",
    publishYear: 2018,
    pages: 330,
    copies: 7,
    borrowCount: 0,
  },
  {
    id: 8564,
    name: "Frozen Memories",
    author: "Amelia Richardson",
    publisher: "Hachette",
    publishYear: 2014,
    pages: 470,
    copies: 3,
    borrowCount: 0,
  },
  {
    id: 2035,
    name: "The Last Chapter",
    author: "Noah Scott",
    publisher: "Little, Brown & Co.",
    publishYear: 2009,
    pages: 390,
    copies: 6,
    borrowCount: 0,
  },
  {
    id: 7651,
    name: "Dark Waters",
    author: "Ava Lewis",
    publisher: "Tor Books",
    publishYear: 2011,
    pages: 310,
    copies: 4,
    borrowCount: 0,
  },
  {
    id: 4829,
    name: "Shattered Reflections",
    author: "William Foster",
    publisher: "Doubleday",
    publishYear: 2010,
    pages: 440,
    copies: 2,
    borrowCount: 0,
  },
  {
    id: 9213,
    name: "The Celestial Key",
    author: "Olivia Bennett",
    publisher: "Anchor Books",
    publishYear: 2022,
    pages: 360,
    copies: 5,
    borrowCount: 0,
  },
  {
    id: 3174,
    name: "Timeless Journey",
    author: "Benjamin Harris",
    publisher: "Penguin Random House",
    publishYear: 2007,
    pages: 390,
    copies: 8,
    borrowCount: 0,
  },
  {
    id: 7345,
    name: "Echoes of Destiny",
    author: "Lily Evans",
    publisher: "Ballantine Books",
    publishYear: 2006,
    pages: 410,
    copies: 4,
    borrowCount: 0,
  },
  {
    id: 5812,
    name: "The Enigma Code",
    author: "Jack Mitchell",
    publisher: "Harvard Press",
    publishYear: 2018,
    pages: 350,
    copies: 6,
    borrowCount: 0,
  },
  {
    id: 4129,
    name: "Distant Horizons",
    author: "Hannah Carter",
    publisher: "Simon & Schuster",
    publishYear: 2016,
    pages: 290,
    copies: 7,
    borrowCount: 0,
  },
];
let cards = getFromLocalStorage("cards") || [];

saveToLocalStorage("books", books);

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

  let matchingBook = matchingBooks.find((book) => book.id === id);

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

  book.publishYear = parseInt(book.publishYear);
  book.pages = parseInt(book.pages);
  book.copies = parseInt(book.copies);

  let matchingIndex = books.findIndex((book) => book.id === bookId);
  const existingBook = books[matchingIndex];

  book.id = bookId;
  book.borrowCount = existingBook.borrowCount;

  books[matchingIndex] = book;
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
