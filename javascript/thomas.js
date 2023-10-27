/**
 * EVENEMENTS CUSTOM :
 */
const closeModalEvent = new Event("closeModalEvent");

getUsers();

function populateUsers(users) {
  const usersSection = document.getElementById("usersSection");
  while (usersSection.lastChild.id !== "addingCard") {
    usersSection.removeChild(usersSection.lastChild);
  }

  users.forEach((user, index) => {
    const searchValue = document.getElementById("search").value;

    if (
      user.name.toLowerCase().includes(searchValue) ||
      user.work.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
    ) {
      const card = document.createElement("article");
      card.className = "card";
      card.id = "userCard_" + index;

      card.innerHTML = `
            <div class="card_images">
                <img src="/asset/avatars/${user.image}.jpg" id="userImage_${index}" data-id="${user.image}" style="width: 100%; height: auto;" alt="">
            </div>
            <div class="descrip_card">
                <div class="btn_card align-right pr-1">
                    <a href="#" data-toggle="modal" data-tooltip="Supprimer l'utilisateur" data-id="${index}" data-target="#deleteModal" class="icon"></a>
                    <a href="#" data-toggle="modal" data-tooltip="Modifier l'utilisateur" data-id="${index}" data-target="#userModal" class="icon"></a>
                </div>
                <div class="card_spec text-center">
                    <p class="spec bold text-red" id="userName_${index}">${user.name}</p>
                    <p class="spec mb-2" id="userWork_${index}">${user.work}</p>
                    <p class="mail_link"><a href="mailto://${user.email}"><span id="userEmail_${index}">${user.email}</span></a></p>
                </div>
            </div>`;

      usersSection.appendChild(card);
    }
  });

  //On instancie les fonctions liés à l'affichage des utilisateurs
  function disableScrolling() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    window.onscroll = function () {
      window.scrollTo(0, scrollPosition);
    };
  }

  function enableScrolling() {
    window.onscroll = null;
  }

  //Affichage du "Tooltip"
  let tt_elements = document.querySelectorAll("[data-tooltip]");
  tt_elements.forEach((element) => {
    const tooltipText = element.getAttribute("data-tooltip");

    if (tooltipText) {
      const tooltip = document.createElement("span");
      tooltip.style.backgroundColor = "#403D39";
      tooltip.style.position = "absolute";
      tooltip.style.color = "#FFFCF2";
      tooltip.style.padding = "7px";
      tooltip.style.fontSize = "12px";
      tooltip.style.borderRadius = "3px";

      const elementRect = element.getBoundingClientRect();
      const tooltipWidth = 100;
      const leftOffset =
        elementRect.left + elementRect.width / 2 - tooltipWidth / 2;
      const topOffset = elementRect.bottom + 10;

      tooltip.style.left = leftOffset + "px";
      tooltip.style.top = topOffset + "px";

      tooltip.textContent = tooltipText;

      element.addEventListener("mouseover", () => {
        document.body.appendChild(tooltip);
      });

      element.addEventListener("mouseout", () => {
        document.body.removeChild(tooltip);
      });
    }
  });

  //Fermeture des modals
  let hm_buttons = document.querySelectorAll('[data-dismiss="modal"]');
  hm_buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.querySelector(".modal.show").dispatchEvent(closeModalEvent);
    });
  });

  //Ouverture des modals
  let sm_buttons = document.querySelectorAll('[data-toggle="modal"]');
  sm_buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const modalId = e.currentTarget.getAttribute("data-target");
      const modal = document.querySelector(modalId);
      const userId = e.currentTarget.getAttribute("data-id");

      const eventDetails = {
        userId: userId,
      };
      const openModalEvent = new CustomEvent("openModalEvent", {
        detail: eventDetails,
      });

      modal.classList.add("show");

      modal.dispatchEvent(openModalEvent);
    });
  });

  //Events liés aux modals
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    //Event d'ouverture
    modal.addEventListener("openModalEvent", (e) => {
      disableScrolling();
      document.getElementById("activeUserId").value = e.detail.userId;

      const inputs = document.querySelectorAll(
        "#" + e.target.id + " input[type='text']"
      );
      inputs.forEach((input, index) => {
        if (index === 0 && input.id !== null)
          document.getElementById(input.id).focus();

        input.value = "";
      });
      const radios = document.querySelectorAll(
        "#" + e.target.id + ' input[type="radio"]'
      );
      radios.forEach((radio) => {
        radio.checked = false;
        document
          .querySelector(`.avatar-selector[data-id="` + radio.value + `"]`)
          .classList.remove("selected");
      });

      //Si on click en dehors de la fenêtre on ferme le modal
      window.addEventListener("click", (e) => {
        const dialog = modal.querySelector(".dialog");
        if (!dialog.contains(e.target)) {
          const modalId = e.target.id;
          if (modalId !== undefined && modalId !== "") {
            modal.dispatchEvent(closeModalEvent);
          }
        }
      });
    });

    //Event de fermeture
    modal.addEventListener("closeModalEvent", (e) => {
      document.getElementById("search").value = "";
      document.getElementById("activeUserId").value = "";
      if (document.querySelector(".modal.show") !== null)
        document.querySelector(".modal.show").classList.remove("show");
      enableScrolling();
    });
  });

  //Préparation de la modal de l'utilisateur (avec les infos)
  const updatingModal = document.getElementById("userModal");
  updatingModal.addEventListener("openModalEvent", (e) => {
    const userId = document.getElementById("activeUserId").value;

    document.querySelector(".form-selector").classList.remove("is-invalid");
    document.getElementById("userNameInput").classList.remove("is-invalid");
    document.getElementById("userWorkInput").classList.remove("is-invalid");
    document.getElementById("userEmailInput").classList.remove("is-invalid");

    //On modifie un utilisateur
    if (userId >= 0) {
      const img = document
        .getElementById("userImage_" + userId)
        .getAttribute("data-id");
      const name = document.getElementById("userName_" + userId).innerHTML;
      const work = document.getElementById("userWork_" + userId).innerHTML;
      const desc = document.getElementById("userEmail_" + userId).innerHTML;

      document.querySelector("#userModal .modal-title").innerHTML =
        `Modification du collaborateur (<span class="text-red">` +
        name +
        `</span>)`;
      document.getElementById("randomButton").classList.add("hidden");
      document.getElementById("userNameInput").value = name;
      document.getElementById("userWorkInput").value = work;
      document.getElementById("userEmailInput").value = desc;

      const image = document.querySelector(
        '.avatar-selector[data-id="' + img + '"]'
      );
      image.classList.add("selected");
      document.getElementById("updateUserImgRadio_" + img).checked = true;
    }
    //On ajoute un nouvel utilisateur
    else {
      document.querySelector(
        "#userModal .modal-title"
      ).innerHTML = `Ajout d'un collaborateur`;
      document.getElementById("randomButton").classList.remove("hidden");
    }
  });
}

//Recherche parmi les utilisateurs
document.getElementById("search").addEventListener("keyup", (e) => {
  populateUsers(JSON.parse(localStorage.getItem("users")));
});

function getUsers() {
  if (localStorage.getItem("users") === null) {
    const count = 17;
    const apiUrl = "https://random-data-api.com/api/v2/users?size=" + count;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          showAlert(
            "danger",
            "La requête à l'API a échoué.",
            "exclamation-triangle"
          );
          throw new Error("Impossible de se connecter à l'API");
        }

        return response.json();
      })
      .then((users) => {
        let usersInfo = [];

        for (let index = 0; index < count; index++) {
          const genderMale = ["Polygender", "Male", "Non-binary", "Bigender"];
          const imgId =
            (genderMale.includes(users[index].gender) ? "male_0" : "female_0") +
            Math.floor(Math.random() * (4 - 1) + 1);

          usersInfo.push({
            name: users[index].first_name + " " + users[index].last_name,
            image: imgId,
            work: users[index].employment.title,
            email: users[index].email,
          });
        }

        localStorage.setItem("users", JSON.stringify(usersInfo));
        populateUsers(usersInfo);
      })
      .catch((error) => {
        showAlert(
          "danger",
          "La requête à l'API a échoué.",
          "exclamation-triangle"
        );
      });
  }

  populateUsers(JSON.parse(localStorage.getItem("users")) || []);
}

function randomizeUser() {
  const apiUrl = "https://random-data-api.com/api/v2/users";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        showAlert(
          "danger",
          "La requête à l'API a échoué.",
          "exclamation-triangle"
        );
        throw new Error("Impossible de se connecter à l'API");
      }

      return response.json();
    })
    .then((users) => {
      const genderMale = ["Polygender", "Male", "Non-binary", "Bigender"];
      const imgId =
        (genderMale.includes(users.gender) ? "male_0" : "female_0") +
        Math.floor(Math.random() * (4 - 1) + 1);

      document.querySelector(
        "#userModal .modal-title"
      ).innerHTML = `Ajout d'un collaborateur <small class="text-red">(généré par API)</small>`;
      document.getElementById("userNameInput").value =
        users.first_name + " " + users.last_name;
      document.getElementById("userWorkInput").value = users.employment.title;
      document.getElementById("userEmailInput").value = users.email;

      //Effacement des avatars
      const imageSelectors = document.querySelectorAll(".avatar-selector");
      imageSelectors.forEach((image) => {
        imageSelectors.forEach((div) => {
          div.classList.remove("selected");
        });
      });

      const image = document.querySelector(
        '.avatar-selector[data-id="' + imgId + '"]'
      );
      image.classList.add("selected");
      document.getElementById("updateUserImgRadio_" + imgId).checked = true;
    })
    .catch((error) => {
      showAlert(
        "danger",
        "La requête à l'API a échoué.",
        "exclamation-triangle"
      );
    });
}

//Sauvegarde des informations de l'utilisateur (nouveau ou ancien)
function saveUser() {
  //On nettoie les erreurs
  document.querySelector(".form-selector").classList.remove("is-invalid");
  document.getElementById("userNameInput").classList.remove("is-invalid");
  document.getElementById("userWorkInput").classList.remove("is-invalid");
  document.getElementById("userEmailInput").classList.remove("is-invalid");
  let errors = 0;

  const imageRadio = document.querySelector(
    'input[name="userImgageRadio"]:checked'
  );
  let image = "";
  if (imageRadio !== undefined && imageRadio !== null) {
    image = imageRadio.value;
  } else {
    errors++;
    document.querySelector(".form-selector").classList.add("is-invalid");
  }
  const name = document.getElementById("userNameInput").value;
  const work = document.getElementById("userWorkInput").value;
  const email = document.getElementById("userEmailInput").value;

  if (name.trim() === "") {
    errors++;
    document.getElementById("userNameInput").classList.add("is-invalid");
  }
  if (work.trim() === "") {
    errors++;
    document.getElementById("userWorkInput").classList.add("is-invalid");
  }
  if (email.trim() === "") {
    errors++;
    document.getElementById("userEmailInput").classList.add("is-invalid");
  }

  if (errors === 0) {
    const userId = document.getElementById("activeUserId").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];

    //On modifie un utilisateur
    if (userId >= 0) {
      document
        .getElementById("userImage_" + userId)
        .setAttribute("data-id", image);
      document.getElementById("userImage_" + userId).src =
        "./src/asset/avatars/" + image + ".jpg";
      document.getElementById("userName_" + userId).innerHTML = name;
      document.getElementById("userWork_" + userId).innerHTML = work;
      document.getElementById("userEmail_" + userId).innerHTML = email;

      users[userId].image = image;
      users[userId].name = name;
      users[userId].work = work;
      users[userId].email = email;
    }
    //On créer un nouvel utilisateur
    else {
      users.unshift({
        image: image,
        name: name,
        work: work,
        email: email,
      });
    }

    localStorage.setItem("users", JSON.stringify(users));
    populateUsers(users);

    document.getElementById("userModal").dispatchEvent(closeModalEvent);

    showAlert(
      "success",
      "Les informations ont été sauvegardées.",
      "check-circle"
    );
  }
}

//Suppression d'un utilisateur
function deleteUser() {
  const userId = document.getElementById("activeUserId").value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(userId, 1);

  localStorage.setItem("users", JSON.stringify(users));

  populateUsers(users);
  document.querySelector("#deleteModal").dispatchEvent(closeModalEvent);

  showAlert("success", "Le collaborateur a bien été supprimé.", "check-circle");
}

//Fonction pour afficher les message d'alerte
function showAlert(color, text, icon = null) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${color}`;
  alertDiv.innerHTML =
    (icon !== null ? `<i class="fa-solid fa-${icon} mr-2"></i> ` : "") + text;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.display = "none";
    alertDiv.remove();
  }, 5000);
}

//Selection des avatars pour les utilisateurs
const imageSelectors = document.querySelectorAll(".avatar-selector");
imageSelectors.forEach((image) => {
  image.addEventListener("click", (e) => {
    const imgId = e.currentTarget.getAttribute("data-id");

    imageSelectors.forEach((div) => {
      div.classList.remove("selected");
    });

    image.classList.add("selected");
    document.getElementById("updateUserImgRadio_" + imgId).checked = true;
  });
});

const logo_burger = document.getElementById("logo_burger");
const menu_burger = document.querySelector(".menu_burger");

logo_burger.addEventListener("click", (e) => {
  e.preventDefault();

  if (menu_burger.style.display == "flex") {
    menu_burger.style.display = "none";
  } else {
    menu_burger.style.display = "flex";
  }
});
