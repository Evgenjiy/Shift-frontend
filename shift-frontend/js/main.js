const autoMoveTimer = 30;//Время на ход в секундах, по истечению которого происходит автоход
const checkTimer = 500;//Таймер проверки комнаты в миллисекундах
var roomId;
var userId;
var roundsCount = 0;
//var userId;
const button_ROCK = document.querySelector('#ROCK');
const button_SCISSORS = document.querySelector('#SCISSORS');
const button_PAPER = document.querySelector('#PAPER');
const element_me = document.querySelector('#elements_me');


const createUser = function (userName) {
    //Запрос на создание юзера
    createRequest({ path: `/api/v001/user/create/fast`, method: "POST" }, {}, {}, "userName", userName)
        //Запрос на создание комнаты,  передаём данные дальше
        .then(response => {
            toggleClass(".add-user", "loading");
            console.log("Юзер добавлен", response);
            if (response.free) {
                userId = response.usersId[0];
            }
            else {
                userId = response.usersId[1];
            }
            roomId = response.roomId;
            //return createRequest({ path: `/api/v001/room/create`, method: "POST" }, {}, {}, "userId", userId);
        },
        () => {
            console.log("Ошибка при создании юзера");
        })
        //Отрисовка страницы игры
        .then(function() {
            //console.log("roomID", response_room.roomId);
            //return //Функция игры(response_room.roomId);

            //нарисовали комнату, кнопки
            //var timerId = setTimeout(autoMove, autoMoveTimer*1000); //таймер автохода
            //clearTimeout(timerId);

            button_ROCK.addEventListener("click", event => {
                event.preventDefault();
                setMove(roomId, userId, "ROCK")
            });
            button_SCISSORS.addEventListener("click", event => {
                event.preventDefault();
                setMove(roomId, userId, "SCISSORS")
            });
            button_PAPER.addEventListener("click", event => {
                event.preventDefault();
                setMove(roomId, userId, "PAPER")
            });

            //при нажатии на кнопку делать запрос и менять флаг автохода
            //проверять состояние комнаты
        },
        () => {
            console.log("Ошибка при создании комнаты");
        });
}

createUser("Ivan (front)");


const autoMove = function () {
    alert('Время на ход истекло');
    setMove(0);
}

const setMove = function (roomId, userId, userMove) {
    button_ROCK.disabled = true;
    button_SCISSORS.disabled = true;
    button_PAPER.disabled = true;

    console.log("url",`url('${userMove}.png')`);
    element_me.style.backgroundImage = "url('"+userMove+".png')";

    createRequest({ path: `/api/v001/room/${roomId}/${userId}/move`, method: "PUT" }, {}, {}, "userMove", userMove)
        .then(response => {

            var timerId = setTimeout(function () { checkRoom(roomId) }, checkTimer); //Проверять комнату каждые checkTimer миллисекунд

            //(function () {
            //    clearInterval(timerId);
            //    alert('Нет ответа от сервера. Возможно, противник вышел');
            //}, autoMoveTimer*1000+10000); //Остановить проверку комнаты,если слишком долго нет ответа

            console.log("Сделан ход: ", userMove, response);
        })
        .catch(() => {
            console.log("Не удалось сделать ход:", response);
        });
}

const checkRoom = function (roomId) {
    createRequest({ path: `/api/v001/room/${roomId}/state`, method: "GET" })
        .then(response => {
            if (response.free) {
                console.log("Ожидаем противника");
                setTimeout(function () { checkRoom(roomId) }, checkTimer); //Проверять комнату каждые checkTimer миллисекунд
            }
            else {
                console.log("Есть противник");
                if (response.roundNumber >= roundsCount + 1) {
                    console.log("Противник сделал ход");
                    button_ROCK.disabled = false;
                    button_SCISSORS.disabled = false;
                    button_PAPER.disabled = false;

                    if (response.resultsRounds[roundsCount] == userId) alert('Вы победили');
                    else alert('Вы проиграли');

                    roundsCount++;

                    if (roundsCount >= 11) {
                        if (response.winner == userId) alert('Вы победили');
                        else alert('Вы проиграли');
                        return;
                    }
                }
                else {
                    console.log("Ожидаем ход противника");
                    setTimeout(function () { checkRoom(roomId) }, checkTimer); //Проверять комнату каждые checkTimer миллисекунд
                }
            }
            //var timerId = setTimeout(function () { checkRoom() }, checkTimer); //Проверять комнату каждые checkTimer миллисекунд

            //(function () {
            //    clearInterval(timerId);
            //    alert('Нет ответа от сервера. Возможно, противник вышел');
            //}, autoMoveTimer*1000+10000); //Остановить проверку комнаты,если слишком долго нет ответа

            console.log("Состояние комнаты: ", response);
        })
        .catch(() => {
            console.log("Не удалось получить состояние комнаты");
        });
}

/*
const createRoom = function (userId) {
    createRequest({ path: `/api/v001/room/create`, method: "POST" }, {}, {}, "userId", userId)
        .then(response => {
            toggleClass(".add-room", "loading");
            console.log("Комната создана", response);
            var roomId = response.roomId;
            console.log("roomID", roomId);
        })
        .catch(() => {
            toggleClass(".add-room", "loading");
            console.log("Не удалось создать комнату");
        });
}*/

//createRoom();

//setTimeout(createRoom(), 5000);

/*
const setMove = document.querySelector("#resaultClick");
setMove.addEventListener("submit", event => {
    event.preventDefault();

    const data = getFieldData(event.target);
    console.log("main", "data", data);

    //toggleClass(".add-book", "loading");

    createRequest({ path: `/api/v001/room/${ roomID }/move`, method: "POST" }, {}, data)
        .then(response => {
            toggleClass(".add-book", "loading");
            console.log("Книга добавлена", response);
        })
        .catch(() => {
            toggleClass(".add-book", "loading");
            console.log("Не удалось добавить книгу");
        });
});


// Пример получения и вывода списка книг
const renderBook = book => `
    <div class="book">
        <div class="book_name">${book.name}</div>
        <div class="book_author">${book.author}</div>
    </div>
`;

const getAllBooks = function() {
  createRequest({ path: "/api/v001/users", method: "GET" })
    .then(response => {
        document.querySelector("#users").innerHTML = response
        .map(renderBook)
        .join("");
      console.log("Результат запроса юзеров", response);
    })
    .catch(err => {
        document.querySelector("#users").innerHTML =
            "Не удалось получить список юзеров";
      console.log("Ошибка при получении списка юзеров", err);
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
*/