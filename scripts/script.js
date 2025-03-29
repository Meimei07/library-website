function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function renderBook(books, tableEl) {
  let html = "";
  tableEl.innerHTML = "";

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
        <td class="edit-delete-btn js-edit-delete-btn">
          <button onclick="editBook(${book.id}); openEditBookPopover();">
            <span class="edit material-symbols-outlined">
              edit_square
            </span>
          </button>
          <button onclick="deleteBook(${book.id})" class="js-delete-book-btn">
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
        <th style="width: 15%">Book</th>
        <th style="width: 15%">Author</th>
        <th style="width: 15%">Publisher</th>
        <th style="width: 10%">Publish year</th>
        <th style="width: 10%">Pages</th>
        <th style="width: 10%">Copies</th>
        <th class="js-actions-header" style="width: 5%">Actions</th>
      </tr>${html}`;
}

function renderVisitor(visitors, tableEl) {
  let html = "";
  tableEl.innerHTML = "";

  visitors.forEach((visitor) => {
    html += `
      <tr>
        <td>${visitor.id}</td>
        <td>${visitor.name}</td>
        <td>${visitor.phone}</td>
        <td class="edit-delete-btn js-edit-delete-btn">
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
        <th class="js-actions-header" style="width: 5%">Actions</th>
      </tr>${html}`;
}

function styleActivePage() {
  const activePage = window.location.pathname;
  const navLinks = document.querySelectorAll(".big-screen-navbar a");

  navLinks.forEach((link) => {
    if (link.href.includes(activePage)) {
      link.classList.add("active");
    }
  });
}
