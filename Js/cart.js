/* Abrir y cerrar Carrito */


let total = 0;
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");


cartIcon.addEventListener("click", () => {
    cart.classList.add("active");
} );

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
} );


/* Comenzar cuando el documento este listo */

if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", start);
}else{
    start();
}


//Comenzar
function start(){
    addEvents();
}


//ACTUALIZAR Y VOLVER A PRESENTAR
function update(){
    addEvents();
    updateTotal();
}

//EVENTOS
function addEvents(){

    //quitar articulo
    let cartRemove_btns = document.querySelectorAll(".cart-remove");

    console.log(cartRemove_btns);

    cartRemove_btns.forEach((btn) =>{
        btn.addEventListener("click", handle_removeCartItem);
    });


    //CAMBIA CANTIDAD DE ARTICULOS

    let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");

    cartQuantity_inputs.forEach((input) =>{
        input.addEventListener("change", handle_changeItemQuantity);
    });


    //añadir articulos
    let addCart_btns = document.querySelectorAll(".add-cart");

    addCart_btns.forEach((btn) =>{
        btn.addEventListener("click", handle_addCartItem);
    });
}

//comprar orden
const buy_btn = document.querySelector(".btn-buy");
buy_btn.addEventListener("click", handle_buyOrden)


//funcion de manejo de eventos

let itemsAdded = [];

function handle_addCartItem(){
    let product = this.parentElement;
    let title = product.querySelector(".product-title").innerHTML;
    let price = product.querySelector(".product-price").innerHTML;
    let imgSrc = product.querySelector(".product-img").src;

    console.log(title,price,imgSrc);


let newToAdd = {
    title,
    price,
    imgSrc,
};


//si el elemento ya existe

if(itemsAdded.find((el) => el.title == newToAdd.title)){
    alert("Lo sentimos, Este articulo ya ah sido seleccionado 😢");
    return;
}else{
    itemsAdded.push(newToAdd);
}

//añadir productos al carrito

let carBoxElement = cartBoxComponent(title,price,imgSrc);
let newNode = document.createElement("div");
newNode.innerHTML = carBoxElement;
const cartContent = cart.querySelector(".cart-content");
cartContent.appendChild(newNode);

update();

}


function handle_removeCartItem(){
    this.parentElement.remove();

    itemsAdded = itemsAdded.filter(
        (el) => 
        el.title != this.parentElement.querySelector(".cart-product-title").innerHTML
    );

    update();
}

function handle_changeItemQuantity(){
    if(isNaN(this.value) || this.value < 1){
        this.value = 1;
    }

    this.value = Math.floor(this.value); //PARA MANTENER  EL NUMERO ENTERO

    update();
}


function handle_buyOrden(){
    if(itemsAdded.length <= 0){
        alert("¡Aún no hay ningun pedido para realizar!");
        return;
    }

    const cartContent = cart.querySelector(".cart-content");
    cartContent.innerHTML = "";
    alert("Su pedido se realizo con exito🤩: ");
    itemsAdded = [];
    update();
}



function formatNumber(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

function updateTotal() {
    let cartBoxes = document.querySelectorAll(".cart-box");
    let total = 0;

    cartBoxes.forEach((cartBox) => {
        let quantity = cartBox.querySelector(".cart-quantity").value;
        let price = parseFloat(cartBox.querySelector(".cart-price").innerHTML.replace(",", ".").replace("$", ""));
        let subtotal = price * quantity;

        total += subtotal;
    });

    const totalElement = document.querySelector(".total-price");
    totalElement.innerHTML = "$" + formatNumber(total) + " MXN";

    return total;
    console.log(total);
}

function generarTicket() {
    let fechaHora = new Date().toLocaleString();
    let ticket = `
        <div class="ticket">
            <img
                src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
                alt="Logotipo" style="width: 100px; height: 100px; display: block; margin: 15px auto;">
                <br>
            <p class="centrado">Jesus Alberto Zavala
                <br>Hermosillo, Sonora
                <br>${fechaHora}</p>
            <table>
                <thead>
                    <tr>
                        <th>CANTIDAD</th>
                        <th>PRODUCTO</th>
                        <th>PRECIO</th>
                    </tr>
                </thead>
                <tbody>`;

    let cartBoxes = document.querySelectorAll(".cart-box");
    let total = 0;

    cartBoxes.forEach((cartBox) => {
        let quantity = cartBox.querySelector(".cart-quantity").value;
        let title = cartBox.querySelector(".cart-product-title").innerHTML;
        let price = parseFloat(cartBox.querySelector(".cart-price").innerHTML.replace(",", ".").replace("$", ""));
        let subtotal = price * quantity;

        ticket += `
            <tr>
                <td>${quantity}</td>
                <td>${title}</td>
                <td>${price.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="3">------------------------------</td>
            </tr>`;

        total += subtotal;
    });

    ticket += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2">TOTAL</td>
                        <td>${total.toFixed(2)}</td>
                        <br>
                        <br>
                    </tr>
                </tfoot>
            </table>
            <br>
            <p class="centrado">¡GRACIAS POR SU COMPRA!
                <br>
                <br>Zavalin blin les deja este QR</p>
                <br>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=onesquareminesweeper.com" alt="Código QR" style="width: 100px; height: 100px; display: block; margin: 15px auto;">
            
        </div>`;

    return ticket;
}


function imprimirTicket() {
    let ticket = generarTicket();
    let ventana = window.open('', '_blank');
    ventana.document.open();
    ventana.document.write(ticket);
    ventana.document.close();

    // Esperar 100 ms antes de imprimir para asegurar que la ventana emergente se haya cargado completamente
    setTimeout(() => {
        ventana.print();
    }, 100);
}



function cartBoxComponent(title, price, imgSrc){
    return `
    
    <div class="cart-box">

        <img src=${imgSrc} alt="" class="cart-img">

        <div class="detail-box">

        <div class="cart-product-title"> ${title}</div>

        <div class="cart-price"> ${price}</div>

        <input type="number" value="1" class="cart-quantity"> 

        </div>

        <i class="bi bi-trash3-fill cart-remove"></i>

    </div>`;
}
