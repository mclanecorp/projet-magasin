//-----------------coded by Damien Buisson-----------------------------//

function selectedProduct(type) {
  const jsonUrl = "json/produit.json";
  const box_card = document.getElementById("box_card");

  fetch(jsonUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La requête a échouée.");
      }
      return response.json();
    })
    .then((produits) => {
      box_card.innerHTML = "";
      type == produits.all;
      produits.forEach((produit) => {
        if (
          produit.categorie.includes(type) ||
          produit.all == type ||
          produit.description1.includes(type) ||
          produit.description2.includes(type) ||
          produit.description3.includes(type) ||
          produit.prix.includes(type)
        ) {
          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
      <div class="card_images">
      <img src="${produit.image}" alt="">
  </div>
  <div class="descrip_card">
      <div class="card_spec">
          <p class="spec bold">${produit.description1}</p>
          <p class="spec">${produit.description2}</p>
          <p class="spec">${produit.description3}</p>
          <div class="box_prix">
          <p class="prix" data-prix="${produit.prix}">${produit.prix}</p>
          <p class="prix prix_total" data-prix="${produit.prix}"></p>
          </div>
      </div>
      <div class="btn_card">
          <a href="" class="trash"><i class="fa-regular fa-trash-can"></i></a>
          <input type="text" class="nbr_card" value="0" id="input_card">
          <a href="" class="plus"><i class="fa-solid fa-plus"></i></a>
          <a href="" class="moins"><i class="fa-solid fa-minus"></i></a>
      </div>
  </div>
      `;
          box_card.appendChild(card);
        }
      });

      const plus = document.querySelectorAll(".plus");
      const moins = document.querySelectorAll(".moins");
      const trash = document.querySelectorAll(".trash");
      const nbr_card = document.querySelectorAll(".nbr_card");

      plus.forEach((bouton) => {
        bouton.addEventListener("click", (e) => {
          e.preventDefault();
          const input_card = bouton.parentElement.querySelector(".nbr_card");
          const prixTotalElement =
            bouton.parentElement.parentElement.querySelector(".prix_total");
          const prixUnitaire = parseFloat(
            prixTotalElement.getAttribute("data-prix")
          );
          if (input_card) {
            input_card.value = parseInt(input_card.value) + 1;
          }
          prixTotalElement.textContent =
            prixUnitaire * input_card.value + " Euros";
          Total();
        });
      });
      moins.forEach((bouton) => {
        bouton.addEventListener("click", (e) => {
          e.preventDefault();
          const input_card = bouton.parentElement.querySelector(".nbr_card");
          const prixTotalElement =
            bouton.parentElement.parentElement.querySelector(".prix_total");
          const prixUnitaire = parseFloat(
            prixTotalElement.getAttribute("data-prix")
          );
          if (input_card) {
            if (input_card.value <= 0) {
              input_card.value = 0;
              prixTotalElement.style.display = "none";
            } else {
              input_card.value = parseInt(input_card.value) - 1;
            }
          }
          prixTotalElement.textContent =
            prixUnitaire * input_card.value + " Euros";
          Total();
        });
      });
      trash.forEach((bouton) => {
        bouton.addEventListener("click", (e) => {
          e.preventDefault();
          const input_card = bouton.parentElement.querySelector(".nbr_card");
          const prixTotalElement =
            bouton.parentElement.parentElement.querySelector(".prix_total");
          const prixUnitaire = parseFloat(
            prixTotalElement.getAttribute("data-prix")
          );
          if (input_card) {
            input_card.value = 0;
          }
          prixTotalElement.textContent =
            prixUnitaire * input_card.value + " Euros";
          Total();
        });
      });
      nbr_card.forEach((bouton) => {
        bouton.addEventListener("input", (e) => {
          e.preventDefault();
          const input_card = bouton.parentElement.querySelector(".nbr_card");
          const prixTotalElement =
            bouton.parentElement.parentElement.querySelector(".prix_total");
          const prixUnitaire = parseFloat(
            prixTotalElement.getAttribute("data-prix")
          );
          if (input_card) {
            let currentValue = input_card.value;
            const newValue = currentValue.replace(/\D/g, "");
            input_card.value = newValue;
          }
          prixTotalElement.textContent =
            prixUnitaire * input_card.value + " Euros";
          Total();
        });
      });

      function Total() {
        let prixTotal = 0;
        const cards = document.querySelectorAll(".card");
        const text_total = document.getElementById("text_total");

        cards.forEach((card) => {
          const prixElement = card.querySelector(".prix");
          const quantite = parseInt(card.querySelector(".nbr_card").value);
          const prix = parseFloat(prixElement.getAttribute("data-prix"));
          prixTotal += prix * quantite;
        });
        text_total.textContent = prixTotal + " Euros";
        return prixTotal;
      }
    })
    .catch((error) => {
      console.error("Impossible de récupérer les données : ", error);
    });
}

selectedProduct("all");

const select_prod = document.getElementById("select_prod");
select_prod.addEventListener("change", (e) => {
  const selected = select_prod.value;
  selectedProduct(selected);
});

search_bar.addEventListener("input", () => {
  const valeur_input = search_bar.value;
  result = valeur_input;
  console.log(result);
  selectedProduct(result);
});
window.addEventListener("scroll", () => {
  if (window.scrollY == 0) {
    const element = document.querySelector(".text1");
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = null;
  }
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

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

function toggleModal() {
  modalContainer.classList.toggle("active");
}
