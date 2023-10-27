const buttonPlus = document.querySelectorAll(".fa-plus")
const buttonMoins = document.querySelectorAll(".fa-minus")
const buttonTrash = document.querySelectorAll(".fa-trash-can")
const total = document.getElementById("total")
const itemSousTotal = document.querySelectorAll(".sous-total")
const items = document.querySelectorAll(".item")
const input = document.querySelectorAll("input")

buttonPlus.forEach(v => {
    const quantity = v.parentNode.parentNode.children[1]
    v.addEventListener("click", (e) => {
        e.preventDefault()
        quantity.value ++
        recalc()
})})

buttonMoins.forEach(v => {
    const quantity = v.parentNode.parentNode.children[1]
    v.addEventListener("click", (e) => {
        e.preventDefault()
        if (quantity.value < 1) {
            ;
        } else {
            quantity.value --
            recalc()
        }
})})

buttonTrash.forEach(v => {
    const quantity = v.parentNode.parentNode.children[1]
    v.addEventListener("click", (e) => {
        e.preventDefault()
        quantity.value = "0"
        recalc()
        v.parentNode.parentNode.parentNode.parentNode.setAttribute('hidden', 'hidden')
})})

input.forEach(v => {
    const quantity = v.parentNode.parentNode.children[2].children[1]
    let saisi = ''
    v.addEventListener("input", (e) => {
        saisi = e.currentTarget.value.replace(/\D+/g, '')
        quantity.value = saisi
        recalc()
})})


function recalc () {
    let itemQuantity = 0
    let itemPrice = 0
    let itemTotal = 0
    let totalPrice = 0

    itemSousTotal.forEach(v => {
        itemPrice = v.parentNode.parentNode.parentNode.children[1].children[0].children[0].innerText
        itemQuantity = v.parentNode.parentNode.parentNode.children[2].children[1].value
        v.innerText = Number(itemPrice) * Number(itemQuantity)
    })

    items.forEach(v => {
        itemTotal = v.children[3].children[0].children[0].innerText
        totalPrice = Number(totalPrice) + Number(itemTotal)
    })
    
    total.innerText = totalPrice
}
