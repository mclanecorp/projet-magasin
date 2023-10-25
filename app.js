//const input_card = document.querySelectorAll(".nbr_card");
const plus = document.querySelectorAll(".plus");
const moins = document.querySelectorAll(".moins");
const trash = document.querySelectorAll(".trash");

plus.forEach((bouton) => {
  bouton.addEventListener("click", (e) => {
    e.preventDefault();
    const input_card = bouton.parentElement.querySelector(".nbr_card");
    const prixElement =
      bouton.parentElement.parentElement.querySelector(".prix");
    if (input_card) {
      const prix = parseFloat(prixElement.getAttribute("data-prix"));
      input_card.value = parseInt(input_card.value) + 1;
      let result = prix * input_card.value;
    }
    Total();
  });
});
moins.forEach((bouton) => {
  bouton.addEventListener("click", (e) => {
    e.preventDefault();
    const input_card = bouton.parentElement.querySelector(".nbr_card");
    const prixElement =
      bouton.parentElement.parentElement.querySelector(".prix");
    if (input_card) {
      const prix = parseFloat(prixElement.getAttribute("data-prix"));
      input_card.value = parseInt(input_card.value) - 1;
    }
    Total();
  });
});
trash.forEach((bouton) => {
  bouton.addEventListener("click", (e) => {
    e.preventDefault();
    const input_card = bouton.parentElement.querySelector(".nbr_card");
    const prixElement =
      bouton.parentElement.parentElement.querySelector(".prix");
    if (input_card) {
      const prix = parseFloat(prixElement.getAttribute("data-prix"));
      input_card.value = 0;
    }
    Total();
  });
});

Total();

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
  console.log(prixTotal);
  text_total.textContent = prixTotal + " Euros";
}
