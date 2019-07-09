const createUser = function () {

    const userName = "IvanIvan";

    createRequest({ path: `/api/v001/user/create`, method: "POST" }, {}, {})
    .then(response => {
        toggleClass(".add-user", "loading");
        console.log("Юзер добавлен", response);
    })
    .catch(() => {
        toggleClass(".add-user", "loading");
        console.log("Не удалось добавить юзера");
    });
}



