// Пример получения
const renderBook = book => `
    <div class="book">
        <div class="book_name">${book.name}</div>
        <div class="book_author">${book.author}</div>
    </div>
`;

const getAllBooks = function() {
  createRequest({ path: "/api/v001/books", method: "GET" })
    .then(response => {
      document.querySelector("#books").innerHTML = response
        .map(renderBook)
        .join("");
      console.log("Результат запроса книг", response);
    })
    .catch(err => {
      document.querySelector("#books").innerHTML =
        "Не удалось получить список книг";
      console.log("Ошибка при получении списка книг", err);
    });
};

getAllBooks();

const getOneBookForm = document.querySelector("#get-one-book");
getOneBookForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = getFieldData(event.target);

  toggleClass(".one-book", "loading");

  createRequest({ path: `/api/v001/books/${data.bookId}`, method: "GET" })
    .then(response => {
      document.querySelector("#one-book").innerHTML = renderBook(response);
      toggleClass(".one-book", "loading");
      console.log("Данные книги получены", response);
    })
    .catch(() => {
      document.querySelector("#one-book").innerHTML =
        "Книги с таким id не нашлось :(";
      toggleClass(".one-book", "loading");
      console.log("Не нашли книгу с id=", data.bookId);
    });
});

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

const userSelector = document.querySelector('.select_control-user');
userSelector.addEventListener('change', event => {
  userId = event.target.value;
  getAllBooks();
});