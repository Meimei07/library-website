const tableEl = document.querySelector(".js-table");
const newFormEl = document.querySelector(".js-new-form");
const nameEl = document.querySelector(".js-name-container input");
const phoneEl = document.querySelector(".js-phone-container input");
const editFormEl = document.querySelector(".js-edit-form");
const searchEl = document.querySelector(".js-search-bar");
const sortBtn = document.querySelector(".js-sort-btn");
const typeEl = document.querySelector(".js-sort-type");
const newVisitorOverlay = document.querySelector(".js-new-overlay");
const editVisitorOverlay = document.querySelector(".js-edit-overlay");
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll(".big-screen-navbar a");

let visitorId;
let matchingVisitors;
let sortType;

// get data
let visitors = getFromLocalStorage("visitors") || [];
let cards = getFromLocalStorage("cards") || [];

// render
function renderVisitor(visitors) {
  let html = "";
  tableEl.innerHTML = "";

  visitors.forEach((visitor) => {
    html += `
      <tr>
        <td>${visitor.id}</td>
        <td>${visitor.name}</td>
        <td>${visitor.phone}</td>
        <td class="edit-delete-btn">
          <button onclick="editVisitor(${visitor.id}); openEditVisitorPopover();">
            <span class="edit material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button onclick="deleteVisitor(${visitor.id})">
            <span class="delete material-symbols-outlined">
              delete_forever
            </span>
          </button>
        </td>
      </tr>
    `;
  });

  tableEl.innerHTML = `<tr>
        <th style="width: 5%">ID</th>
        <th style="width: 15%">Name</th>
        <th style="width: 15%">Phone Numbers</th>
        <th style="width: 5%">Actions</th>
      </tr>${html}`;
}

// delete
function deleteVisitor(id) {
  const matchingCards = cards.filter((card) => card.visitorId === id);
  let allBooksReturned = true;

  if (!matchingCards) {
    // can delete
    let matchingIndex = visitors.findIndex((visitor) => visitor.id === id);
    visitors.splice(matchingIndex, 1);
  } else {
    // can delete only if visitor has return books
    matchingCards.forEach((card) => {
      if (card.isReturned === false) {
        allBooksReturned = false;
        return;
      }
    });

    if (allBooksReturned === true) {
      // can delete
      let matchingIndex = visitors.findIndex((visitor) => visitor.id === id);
      visitors.splice(matchingIndex, 1);
    } else {
      alert("This visitor can't be deleted just yet!");
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

  saveToLocalStorage("visitors", visitors);
  renderVisitor(visitors);
}

// edit book
function editVisitor(id) {
  visitorId = id;

  let matchingVisitor = visitors.find((visitor) => visitor.id === id);

  nameEl.value = matchingVisitor.name;
  phoneEl.value = matchingVisitor.phone;
}

// search
function search(keyword) {
  matchingVisitors = visitors.filter((visitor) => {
    return (
      visitor.name.toLowerCase().includes(keyword.toLowerCase()) ||
      visitor.phone.includes(keyword)
    );
  });
}

// sort
function sortVisitors(visitors) {
  switch (sortType) {
    case "id":
      visitors.sort((a, b) => a.id - b.id);
      break;
    case "name":
      visitors.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
}

// open new visitor popover
function openNewVisitorPopover() {
  newVisitorOverlay.style.display = "flex";
}

// close new visitor popover
function closeNewVisitorPopover() {
  newVisitorOverlay.style.display = "none";
}

// open edit visitor popover
function openEditVisitorPopover() {
  editVisitorOverlay.style.display = "flex";
}

// close edit visitor popover
function closeEditVisitorPopover() {
  editVisitorOverlay.style.display = "none";
}

renderVisitor(visitors);

// add new visitor
newFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(newFormEl);
  const visitor = Object.fromEntries(formData.entries());

  if (parseInt(visitor.phone) < 1) {
    alert("please enter correct phone numbers.");
    return;
  }

  visitor.id = Math.floor(Math.random() * 10001);

  visitors.push(visitor);
  saveToLocalStorage("visitors", visitors);
  renderVisitor(visitors);

  newFormEl.reset();
  closeNewVisitorPopover();
});

// save edit
editFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(editFormEl);
  const visitor = Object.fromEntries(formData.entries());

  if (parseInt(visitor.phone) < 1) {
    alert("please enter correct phone numbers.");
    return;
  }

  visitor.id = visitorId;
  let matchingIndex = visitors.findIndex((visitor) => visitor.id === visitorId);

  visitors[matchingIndex] = visitor;
  saveToLocalStorage("visitors", visitors);
  renderVisitor(visitors);

  closeEditVisitorPopover();
});

// show search results
searchEl.addEventListener("keyup", () => {
  let keyword = searchEl.value;
  console.log(keyword);

  search(keyword);
  renderVisitor(matchingVisitors);
});

// show sort results
sortBtn.addEventListener("click", () => {
  let keyword = searchEl.value;
  sortType = typeEl.options[typeEl.selectedIndex].value;

  if (keyword === "") {
    // sort books

    sortVisitors(visitors);
    renderVisitor(visitors);
  } else if (keyword !== "") {
    // sort search results

    search(keyword);
    sortVisitors(matchingVisitors);
    renderVisitor(matchingVisitors);
  }
});

// handle navbar link click
navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active");
  }
});
