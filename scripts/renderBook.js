function renderBook(books) {
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
        <td class="edit-delete-btn">
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
        <th style="width: 5%">Actions</th>
      </tr>${html}`;
}
