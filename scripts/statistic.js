const popularTable = document.querySelector(".js-popular-book-table");
const bookSection = document.querySelector("#book");

// get data
let books = getFromLocalStorage("books") || [];

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

findPopular(books, renderBook, "popular books");

// handle navbar link click
styleActivePage();
