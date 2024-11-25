const getGames = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/videogames');
        const data = await res.json();
        menuItems = data;
    } catch (error) {
        console.error(error)
    }
}

let cartItems = [];

let menuItems = [];

let clearCartBtn = document.querySelector("#clear-cart");
let navItems = [...document.querySelectorAll(".brand-nav")];
let logoContainer = document.querySelector(".logo-container");
let searchGame = document.querySelector("#search-game");
let profileButton = document.querySelector("#profile-button");
let checkoutButton = document.querySelector("#checkout-button");


const renderCards = () => {
    let cardsContainer = document.querySelector(".cards-container");
    while(cardsContainer.firstChild){
        cardsContainer.firstChild.remove();
    }
    menuItems.map((card) => {
        cardsContainer.insertAdjacentHTML("beforeend", `
            <div class="card">
                <div class="image-card-container">
                    <img src="${card.img}" alt="${card.nombre}">
                </div>
                <div class="info-container">
                    <h2>${card.nombre}</h2>
                    <p>${card.description}</p>
                    <h3>$${card.precio}</h3>
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/022/093/083/small_2x/star-rating-review-clip-art-free-png.png" alt="stars-icon">
                </div>
                <button>Añadir al carrito</button>
            </div>
        `)
    });
    const cardSelection = [...document.querySelectorAll(".card")];
    cardSelection.forEach((card) => {
        card.addEventListener("click", async (e) => await displayGame(e));
    })
    const cardsButtons = [...document.querySelectorAll(".card button")];
    cardsButtons.forEach((button) => {
        button.addEventListener("click", (e) => addToCart(e));
    })
}

const renderItems = () => {
    let shoppingItems = document.querySelector(".shopping-items");
    while(shoppingItems.firstChild){
        shoppingItems.firstChild.remove();
    }
    cartItems.forEach((item) => {
        shoppingItems.insertAdjacentHTML("beforeend", `
            <div class="shopping-cart-item">
                <div class="info-item">
                    <img src="${item.img}" alt="${item.nombre}">
                    <h2>${item.nombre}</h2>
                    <h5>$${item.precio}</h5>
                </div>
                <button>Eliminar</button>
            </div>
        `)
    })
    const itemsButtons = [...document.querySelectorAll(".shopping-cart-item button")];
    itemsButtons.forEach((button) => {
        button.addEventListener("click", (e) => removeFromCart(e));
    })
    renderPrice();
}

const handleBrand = async (e) => {
    let selectedBrand = e.target.alt.split("-")[0];
    handleColorChange(selectedBrand);
    let query = '';
    if(selectedBrand === "xbox"){
        query = `?id_plataforma=1`;
    } else if (selectedBrand === "playstation"){
        query = `?id_plataforma=2`;
    } else if (selectedBrand === "nintendo"){
        query = `?id_plataforma=3`;
    }
    const res = await fetch(`http://localhost:3000/api/v1/videogames${query}`);
    const newMenuItems = await res.json();
    menuItems.splice(0, menuItems.length);
    newMenuItems.forEach((item) => {
        menuItems.push(item);
    });
    renderCards();
}

const renderPrice = () => {
    let price = document.querySelector("#total-checkout");
    let newPrice = 0;
    cartItems.forEach((item) => {
        newPrice += parseFloat(item.precio);
    })
    price.textContent = `$${newPrice.toFixed(2)}`;
}

const addToCart = async (e) => {
    e.stopPropagation();
    let titleCard = e.target.parentElement.children[1].children[0].textContent;
    let indexOnItems = menuItems.findIndex((item) => item.nombre === titleCard);
    let isAlreadyOnCart = cartItems.some((item) => item.nombre === titleCard);
    if(!isAlreadyOnCart){
        cartItems.push(menuItems[indexOnItems]);
        renderItems();
    }
    menuItems.splice(indexOnItems, 1);
    renderCards();
}

const removeFromCart = (e) => {
    let titleItem = e.target.parentElement.children[0].children[1].textContent;
    let indexOnItems = cartItems.findIndex((item) => item.title === titleItem);
    menuItems.push(cartItems[indexOnItems]);
    renderCards();
    cartItems.splice(indexOnItems, 1);
    renderItems();
}

const clearCart = () => {
    cartItems.forEach((item) => {
        menuItems.push(item);
    })
    cartItems.splice(0, cartItems.length);
    renderItems();
    renderCards();
}

const handleColorChange = (brand) => {
    let header = document.querySelector("header");
    let buttonHeader = document.querySelector("#search-game button");
    let color = ``;
    if(brand === "xbox"){
        color = `rgba(14, 122, 13,`;
    } else if (brand === "playstation"){
        color = `rgba(0, 112, 209,`;
    } else if (brand === "nintendo"){
        color = `rgba(228, 0, 15,`;
    } else {
        color = `rgba(240, 46, 170,`;
    }
    header.style.boxShadow = `${color} 0.8) 0px 5px, ${color} 0.5) 0px 10px, ${color} 0.3) 0px 15px, ${color} 0.2) 0px 20px, ${color} 0.1) 0px 25px`;
    buttonHeader.style.backgroundColor = `${color} 0.99)`;
};

const handleSearch = async (e) => {
    e.preventDefault();
    let inputText = document.querySelector("#search-game input").value;
    const res = await fetch(`http://localhost:3000/api/v1/videogames?nombre=${inputText}`);
    const newMenuItems = await res.json();
    menuItems.splice(0, menuItems.length);
    newMenuItems.forEach((item) => {
        menuItems.push(item);
    });
    renderCards();
}

const displayGame = async (e) => {
    let clickedGame = e.currentTarget.children[1].children[0].textContent;
    let res = await fetch(`http://localhost:3000/api/v1/videogames?nombre=${clickedGame}`);
    let selectedGameArr = await res.json();
    let selectedGame = selectedGameArr[0];
    let infoDisplayed = document.querySelector(".info-displayed");
    infoDisplayed.children[0].textContent = selectedGame.nombre;
    infoDisplayed.children[1].textContent = selectedGame.description;
    let videoContainer = document.querySelector(".video-container");
    videoContainer.children[0].src = `${selectedGame.trailer}&amp;start=25&autoplay=1`;
    document.querySelector(".displayed-container").scrollIntoView({ behavior: "smooth", block: "start" });
}

const handleProfile = () => {
    const token = localStorage.getItem('jwt');
    if(!token || token === 'undefined'){
        window.location.href = '/login.html';
        return;
    }
    window.location.href = '/orders.html';
}

const orderGames = () => {
    localStorage.setItem('games', JSON.stringify(cartItems));
    clearCart();
    window.location.href = "/createOrder.html"
}

document.addEventListener("DOMContentLoaded", async () => {
    await getGames();
    renderCards();
});
clearCartBtn.addEventListener("click", () => clearCart());
navItems.forEach((item) => {
    item.addEventListener("click", (e) => handleBrand(e));
})

profileButton.addEventListener("click", () => handleProfile());

logoContainer.addEventListener("click", async () => {
    await getGames();
    renderCards();
    handleColorChange();
});
searchGame.addEventListener("submit", (e) => handleSearch(e));
checkoutButton.addEventListener("click", () => orderGames());