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
