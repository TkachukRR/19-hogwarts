const BASE_URL = "https://hp-api.onrender.com";
const DEFUALT_BUTTONS = ["All students", "Favorites"];
const FILTERING_KEY = "house";
const TABLE_HEADERS = {
  Name: "name",
  "Date of birth": "dateOfBirth",
  House: "house",
  Wizard: "wizard",
  Ancestry: "ancestry",
  "Is student/staff": ["hogwartsStudent", "hogwartsStaff"],
};

const localStorageNamesArray =
  JSON.parse(localStorage.getItem("favorites")) || [];

let route = "";

const refs = {
  buttonsList: document.querySelector(".buttons__list"),
  pageTableHead: document.querySelector(".main__table_head"),
  pageTableBody: document.querySelector(".main__table_body"),
  backdrop: document.querySelector(".backdrop"),
  modalWindow: document.querySelector(".modal__content"),
  btnModalClose: document.querySelector('[data-action="close-modal"]'),
  btnSaveToLocalStorage: document.querySelector(
    '[data-action="save-to-localStorage"]'
  ),
  mainContainer: document.querySelector("main").querySelector(".container"),
  pageTable: document.querySelector(".main__table"),
  favoritesList: "",
};

fetchData()
  .then((data) => {
    const arrayAllFilterValues = getArrayOfValues(data, FILTERING_KEY);
    const arrayUniqueFilterValues = getArrayUniqueEl(arrayAllFilterValues);
    const arrayButtons = addEllementsFromArrayToSecondPossitionInArray(
      DEFUALT_BUTTONS,
      arrayUniqueFilterValues
    );

    let activeData = JSON.parse(JSON.stringify(data));
    let previosTargetValue = "";

    renderButtons(arrayButtons);
    renderTableHeader();
    addSortToButton("Name");
    addSortToButton("Date of birth");
    addSortToButton("House");
    renderTableRow(activeData);

    refs.buttonsList.addEventListener("click", (e) => {
      setBasicValueToSortButton();
      if (e.target.localName !== "button") {
        return;
      }

      if (e.currentTarget.querySelectorAll("button.active").length !== 0) {
        e.currentTarget
          .querySelectorAll("button.active")
          .forEach((e) => e.classList.remove("active"));
      }

      if (previosTargetValue === e.target.dataset.action) {
        if (refs.pageTable.classList.contains("hidden")) {
          refs.pageTable.classList.remove("hidden");
        }

        e.target.classList.remove("active");
        activeData = [];
        activeData = JSON.parse(JSON.stringify(data));
        renderTableRow(activeData);
        previosTargetValue = "";
        return;
      }

      if (refs.favoritesList.length !== 0) {
        refs.favoritesList.innerHTML = "";
      }

      switch (e.target.dataset.action) {
        case "allStudents":
          if (refs.pageTable.classList.contains("hidden")) {
            refs.pageTable.classList.remove("hidden");
          }
          route = "/students";
          previosTargetValue = e.target.dataset.action;
          e.target.classList.add("active");
          fetchDataByButton(route)
            .then((data) => {
              activeData = [];
              activeData = JSON.parse(JSON.stringify(data));
              renderTableRow(data);
            })
            .catch((error) => Error(error));
          break;

        case "favorites":
          refs.pageTable.classList.add("hidden");
          route = ``;
          previosTargetValue = e.target.dataset.action;
          e.target.classList.add("active");
          fetchDataByButton(route)
            .then((data) => {
              activeData = [];
              activeData = JSON.parse(JSON.stringify(data)).filter((e) => {
                if (localStorageNamesArray.includes(e.name)) {
                  return e;
                }
              });

              renderFavorites(activeData);

              refs.mainContainer
                .querySelector("ul")
                .addEventListener("click", makeSome);

              function makeSome(e) {
                if (e.target.localName !== "button") {
                  return;
                }

                const heroName = e.target.parentElement.children[1].textContent;

                if (localStorageNamesArray.indexOf(heroName) !== -1) {
                  localStorageNamesArray.splice(
                    localStorageNamesArray.indexOf(heroName),
                    1
                  );
                }

                localStorage.setItem(
                  "favorites",
                  JSON.stringify(localStorageNamesArray)
                );

                activeData = JSON.parse(JSON.stringify(data)).filter((e) => {
                  if (localStorageNamesArray.includes(e.name)) {
                    return e;
                  }
                });

                renderFavorites(activeData);
              }
            })
            .catch((error) => Error(error));
          break;

        default:
          if (refs.pageTable.classList.contains("hidden")) {
            refs.pageTable.classList.remove("hidden");
          }
          route = `/house/${e.target.dataset.action}`;
          previosTargetValue = e.target.dataset.action;
          e.target.classList.add("active");
          fetchDataByButton(route)
            .then((data) => {
              activeData = [];
              activeData = JSON.parse(JSON.stringify(data));
              renderTableRow(data);
            })
            .catch((error) => Error(error));
      }
    });

    refs.pageTableHead.addEventListener("click", (e) => {
      if (e.target.localName !== "button") {
        return;
      }

      const param = e.target.dataset.action;

      let direction = e.target.dataset.description;
      renderTableRow(sortBy(activeData, param, direction));

      if (direction === "increment") {
        e.target.textContent = "⇓";
        e.target.dataset.description = "decrement";
      }

      if (direction === "decrement") {
        e.target.textContent = "⇑";
        e.target.dataset.description = "noSorted";
      }

      if (direction === "noSorted") {
        e.target.textContent = "⇕";
        e.target.dataset.description = "increment";
      }

      refs.pageTableHead.querySelectorAll(".btn__sort").forEach((e) => {
        if (e.dataset.action !== param) {
          e.dataset.description = "noSorted";
          e.textContent = "⇕";
          e.dataset.description = "increment";
        }
      });
    });

    refs.pageTableBody.addEventListener("click", (e) => {
      const personName = e.target.textContent;
      activeData.filter((elem) => {
        if (elem.name === personName) {
          renderModalContext(elem);

          refs.btnSaveToLocalStorage = document.querySelector(
            '[data-action="save-to-localStorage"]'
          );
          refs.btnSaveToLocalStorage.addEventListener("click", (e) => {
            if (localStorageNamesArray.indexOf(elem.name) === -1) {
              localStorageNamesArray.push(elem.name);
              e.target.textContent = "Remove";
            } else if (localStorageNamesArray.indexOf(elem.name) !== -1) {
              localStorageNamesArray.splice(
                localStorageNamesArray.indexOf(elem.name),
                1
              );
              e.target.textContent = "Add";
            }

            localStorage.setItem(
              "favorites",
              JSON.stringify(localStorageNamesArray)
            );
          });
          return;
        }

        showModal();
        refs.btnModalClose.addEventListener("click", onCloseModal);
      });
    });
  })
  .catch((error) => Error(error));

function fetchData() {
  return fetch(`${BASE_URL}/api/characters`).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function fetchDataByButton(param) {
  return fetch(`${BASE_URL}/api/characters${param}`).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function getArrayOfValues(obj, val) {
  const arr = [];
  obj.map((elem) => arr.push(elem[val]));
  return arr;
}

function getArrayUniqueEl(arr) {
  return arr.filter(
    (uniqueEl, index, array) =>
      array.indexOf(uniqueEl) === index && uniqueEl !== ""
  );
}

function addEllementsFromArrayToSecondPossitionInArray(arr1, arr2) {
  const firstPartOfArr1 = arr1.slice(0, 1);
  const secondPartOfArr1 = arr1.slice(1, arr1.length);

  return firstPartOfArr1.concat(arr2).concat(secondPartOfArr1);
}

function renderButtons(arr) {
  const buttonsMarkup = arr
    .map(
      (button) => `
      <li class="buttons__item">
          <button class="btn" data-action="${getCamelcaseString(
            button
          )}">${button}</button>
      </li>`
    )
    .join("");

  refs.buttonsList.insertAdjacentHTML("beforeend", buttonsMarkup);
}

function getCamelcaseString(val) {
  return val
    .toLocaleLowerCase()
    .trim()
    .split(" ")
    .map((word, index) =>
      index == 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join("");
}

function renderTableHeader() {
  const keys = Object.keys(TABLE_HEADERS);
  const tableThMarkup = keys
    .map(
      (key) => `
        <th data-action="${getCamelcaseString(key)}">${key}</th>`
    )
    .join("");
  const tableHeaderMarkup = `
      <tr>${tableThMarkup}</tr>
    `;
  refs.pageTableHead.insertAdjacentHTML("beforeend", tableHeaderMarkup);
}

function addSortToButton(param) {
  const th = refs.pageTableHead.querySelector(
    `[data-action="${getCamelcaseString(param)}"]`
  );
  const btnSortMarkup = `
    <button class="btn__sort" data-action="${param}" data-description="increment">&#8661</button>
  `;
  th.insertAdjacentHTML("beforeend", btnSortMarkup);
}

function setBasicValueToSortButton() {
  refs.pageTableHead.querySelectorAll(".btn__sort").forEach((e) => {
    e.textContent = "⇕";
    e.dataset.description = "increment";
  });
}

function renderTableRow(arr, paramKey, paramVal) {
  refs.pageTableBody.innerHTML = "";

  const values = Object.values(TABLE_HEADERS).flatMap((el) => el);
  const [name, birth, house, wizard, ancestry, student, staff] = values;

  const tableRowMarkup = arr
    .map((el) => {
      if (el[paramKey] === paramVal) {
        return `<tr>
            <td>${checkEmpty(el[name])}</td>
            <td>${checkEmpty(el[birth])}</td>
            <td>${checkEmpty(el[house])}</td>
            <td>${checkEmpty(el[wizard])}</td>
            <td>${checkEmpty(el[ancestry])}</td>
            <td>${isStudentOrStaff(el)}</td>
          </tr>`;
      }
    })
    .join("");

  function checkEmpty(p) {
    if (p === "") {
      return "-";
    }
    return p;
  }

  function isStudentOrStaff(el) {
    if (el[student]) {
      return "Student";
    } else if (el[staff]) {
      return "Staff";
    } else {
      return "-";
    }
  }

  refs.pageTableBody.insertAdjacentHTML("beforeend", tableRowMarkup);
}

function sortBy(arr, param, direction) {
  param = getCamelcaseString(param);
  const arrCopy = JSON.parse(JSON.stringify(arr));

  if (param === "dateOfBirth") {
    arrCopy.map((el) => {
      if (el.dateOfBirth !== "") {
        el.dateOfBirth = new Date(
          el.dateOfBirth.split("-").reverse().join("-")
        ).getTime();
      }
    });
  }

  const sortedBy = arrCopy.sort((a, b) => {
    if (a[param] === "") {
      return 1;
    }
    if (b[param] === "") {
      return -1;
    }

    if (direction === "increment") {
      return a[param] > b[param] ? 1 : -1;
    }

    if (direction === "decrement") {
      return a[param] < b[param] ? 1 : -1;
    }
  });

  if (param === "dateOfBirth") {
    arrCopy.map((el) => {
      if (el.dateOfBirth !== "") {
        el.dateOfBirth = new Date(el.dateOfBirth)
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("-");
      }
    });
  }
  return sortedBy;
}

function showModal() {
  refs.backdrop.addEventListener("click", onBackdropClick);
  document.addEventListener("keydown", onEscKeydown);
  refs.backdrop.classList.toggle("hidden");
  refs.backdrop.classList.remove("hidden");
}

function onCloseModal() {
  refs.backdrop.removeEventListener("click", onBackdropClick);
  document.removeEventListener("keydown", onEscKeydown);
  refs.backdrop.classList.toggle("hidden");
  refs.backdrop.classList.add("hidden");
}

function onEscKeydown(e) {
  if (e.code === "Escape") {
    onCloseModal();
  }
}

function onBackdropClick(e) {
  if (e.currentTarget === e.target) {
    onCloseModal();
  }
}

function renderModalContext(obj) {
  refs.modalWindow.innerHTML = "";
  let imgUrl = obj.image;
  if (obj.image === "") {
    imgUrl = "./img/303792.svg";
  }

  let buttonName = "Add";

  if (localStorageNamesArray.indexOf(obj.name) !== -1) {
    buttonName = "Remove";
  }

  const context = `
    <h2>Person characteristic:</h2>
    <img src="${imgUrl}" alt="image ${obj.name}" width="150px">
    <h3>Hero: ${obj.name}</h3>
    <p>Actor: ${obj.actor}</p>
    <p>Gender: ${obj.gender}</p>
    <p>Date of birth: ${obj.dateOfBirth}</p>
    <button class="btn" data-action="save-to-localStorage">${buttonName}</button>
  `;

  refs.modalWindow.insertAdjacentHTML("beforeend", context);
}

function renderFavorites(arr) {
  const cardsMarkup = arr
    .map(({ name, image }) => {
      if (image === "") {
        image = "./img/303792.svg";
      }
      return `
    <li class="favorites__item">
    <div>
    <img class="favorites__img" src="${image}" alt="image ${name}" width="150px"></img>
      </div>
      <h3 class="favorites__name">${name}</h3>
      <button class="btn favorites__btn" data-action="remove-from-localStorage">Remove</button>
    </li>`;
    })
    .join("");

  const cardsListMarkup = `<ul class="favorites__list">${cardsMarkup}</ul>`;

  if (refs.favoritesList.length !== 0) {
    refs.favoritesList.innerHTML = "";
    refs.favoritesList.insertAdjacentHTML("beforeend", cardsMarkup);
    return;
  }
  refs.mainContainer.insertAdjacentHTML("beforeend", cardsListMarkup);
  refs.favoritesList = document.querySelector(".favorites__list");
}
