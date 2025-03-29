const popularTable = document.querySelector(".js-popular-book-table");
const bookSection = document.querySelector("#book");
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll(".big-screen-navbar a");

let books = getFromLocalStorage("books");
let visitors = getFromLocalStorage("visitors");

function findPopular(array, render, text) {
  array.sort((a, b) => b.borrowCount - a.borrowCount);
  const popularArray = array.filter((item, index) => index <= 4);

  render(popularArray, popularTable);
  console.log(popularArray);

  document.querySelector(".text").innerHTML = `Top 5 ${text}`;

  document.querySelectorAll(".js-edit-delete-btn").forEach((btn) => {
    btn.style.display = "none";
  });
  document.querySelector(".js-actions-header").style.display = "none";
}

findPopular(books, renderBook);

// handle navbar link click
navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active");
  }
});
