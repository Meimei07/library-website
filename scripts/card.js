const tabelEl = document.querySelector(".js-table");
const newFormEl = document.querySelector(".js-new-form");
const newCardOverlay = document.querySelector(".js-new-overlay");
const visitorSelectEl = document.querySelector(".js-visitor-options");
const bookSelectEl = document.querySelector(".js-book-options");
const sortBtn = document.querySelector(".js-sort-btn");
const typeEl = document.querySelector(".js-sort-type");
const searchEl = document.querySelector(".js-search-bar");
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll(".big-screen-navbar a");

let sortType;
let displayingCards;

const cards = getFromLocalStorage("cards") || [];

// const cards = [
//   {
//     id: 1,
//     visitorId: 5444,
//     bookId: 2182,
//     borrowDate: new Date(),
//     returnDate: "",
//   },
//   {
//     id: 2,
//     visitorId: 5444,
//     bookId: 7605,
//     borrowDate: new Date(),
//     returnDate: "",
//   },
// ];

const visitors = getFromLocalStorage("visitors") || [];
const books = getFromLocalStorage("books") || [];

function renderVisitorOptions() {
  let html = "";
  visitorSelectEl.innerHTML = "";

  visitors.forEach((visitor) => {
    html += `<option value="${visitor.id}">${visitor.name}</option>`;
  });

  visitorSelectEl.innerHTML = html;
}

function renderBookOptions() {
  let html = "";
  bookSelectEl.innerHTML = "";

  books.forEach((book) => {
    if (book.copies > 0) {
      html += `<option value="${book.id}">${book.name}</option>`;
    }
  });

  bookSelectEl.innerHTML = html;
}

// open new card popover
function openNewCardPopover() {
  newCardOverlay.style.display = "flex";
}

// close new card popover
function closeNewCardPopover() {
  newCardOverlay.style.display = "none";
}

function renderCards(cards) {
  let html = "";

  cards.forEach((card) => {
    const matchingVisitor = visitors.find((visitor) => {
      return visitor.id === card.visitorId;
    });
    const matchingBook = books.find((book) => book.id === card.bookId);

    const borrowDate = new Date(card.borrowDate).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const returnDate = new Date(card.returnDate).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    html += `
      <tr>
        <td>${card.id}</td>
        <td>${matchingVisitor.name}</td>
        <td>${matchingBook.name}</td>
        <td>${borrowDate}</td>
        <td class="return-date-container">
          <button style="display: ${
            !card.isReturned ? "inline-block" : "none"
          }" onclick="handleReturnBtnClick(${card.id})" class="return-btn">
            <span class="return material-symbols-outlined">
              reply_all
            </span>
          </button>
          <span style="display: ${
            card.isReturned ? "block" : "none"
          }" class="return-date">${returnDate}</span>
        </td>
      </tr>`;
  });

  tabelEl.innerHTML = `<tr>
        <th style="width: 5%">ID</th>
        <th style="width: 15%">Visitor</th>
        <th style="width: 15%">Book</th>
        <th style="width: 12%">Borrow Date</th>
        <th style="width: 12%">Return Date</th>
      </tr>${html}`;
}

function handleReturnBtnClick(id) {
  const matchingCard = cards.find((card) => card.id === id);
  matchingCard.returnDate = new Date();
  matchingCard.isReturned = true;

  saveToLocalStorage("cards", cards);
  renderCards(cards);

  // return 1 book back
  const matchingBook = books.find((book) => book.id == matchingCard.bookId);
  matchingBook.copies += 1;
  console.log(matchingBook);
  saveToLocalStorage("books", books);
  renderBookOptions();
}

function sortCards(cards) {
  switch (sortType) {
    case "id":
      cards.sort((a, b) => a.id - b.id);
      break;
    case "borrowDate":
      cards.sort((a, b) => new Date(a.borrowDate) - new Date(b.borrowDate));
      break;
    case "returnDate":
      cards.sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
  }
}

function search(keyword) {
  displayingCards = cards.filter((card) => {
    let matchingVisitor = visitors.find(
      (visitor) => visitor.id === card.visitorId
    );
    let visitorName = matchingVisitor.name;

    let matchingBook = books.find((book) => book.id === card.bookId);
    let bookName = matchingBook.name;

    return (
      bookName.toLowerCase().includes(keyword.toLowerCase()) ||
      visitorName.toLowerCase().includes(keyword.toLowerCase())
    );
  });
}

// add new card
newFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(newFormEl);
  const card = Object.fromEntries(formData.entries());

  card.visitorId = parseInt(card.visitorId);
  card.bookId = parseInt(card.bookId);
  card.id = Math.floor(Math.random() * 10001);

  // borrow date
  card.borrowDate = new Date();

  // return date
  card.returnDate = "";
  card.isReturned = false;

  cards.push(card);
  saveToLocalStorage("cards", cards);
  renderCards(cards);

  // remove 1 copy from book
  const matchingBook = books.find((book) => book.id == card.bookId);
  matchingBook.copies -= 1;

  // increase book borrow count by 1
  matchingBook.borrowCount += 1;

  saveToLocalStorage("books", books);
  renderBookOptions();

  // increase visitor borrow count by 1
  const matchingVisitor = visitors.find(
    (visitor) => visitor.id === card.visitorId
  );
  matchingVisitor.borrowCount += 1;

  newFormEl.reset();
  closeNewCardPopover();
});

// show sort results
sortBtn.addEventListener("click", () => {
  let keyword = searchEl.value;
  sortType = typeEl.options[typeEl.selectedIndex].value;

  if (keyword === "") {
    // sort cards

    sortCards(cards);
    renderCards(cards);
  } else if (keyword !== "") {
    // sort search results

    search(keyword);
    sortCards(displayingCards);
    renderCards(displayingCards);
  }
});

// show search results
searchEl.addEventListener("keyup", () => {
  let keyword = searchEl.value;
  console.log(keyword);

  search(keyword);
  renderCards(displayingCards);
});

// handle navbar link click
navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active");
  }
});

renderVisitorOptions();
renderBookOptions();
renderCards(cards);
