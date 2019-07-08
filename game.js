



const addBookForm = document.querySelector("#add-book");
addBookForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = getFieldData(event.target);
  console.log("main", "data", data);

  toggleClass(".add-book", "loading");

  createRequest({ path: `/api/v001/books`, method: "POST" }, {}, data)
    .then(response => {
      toggleClass(".add-book", "loading");
      console.log("Книга добавлена", response);
    })
    .catch(() => {
      toggleClass(".add-book", "loading");
      console.log("Не удалось добавить книгу");
    });
});