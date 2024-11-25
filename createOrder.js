const createOrderButton = document.querySelector("#create-order-btn");
const selectedGames = JSON.parse(localStorage.getItem('games'));
const successTitle = document.querySelector('#success-title');

const handleOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    if(!token){
        window.location.href = '/login.html';
        return;
    }
    const payingMethod = document.querySelector('#forma-de-pago').value;
    try {
        const resOrder = await fetch('http://localhost:3000/api/v1/orders', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                forma_de_pago: payingMethod
            })
        });
        const dataOrder = await resOrder.json();

        selectedGames.forEach(async(item) => {
            const resDetails = await fetch('http://localhost:3000/api/v1/detailsOrder', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_pedido: dataOrder.id_pedido,
                    id_videojuego: item.id_videojuego,
                    cantidad: 1,
                    precio: item.precio
                })
            });
        })

        successTitle.textContent = "Orden creada!";
    } catch (error) {
        console.error(error)
    }
}

const renderOrderedGames = () => {
    const container = document.querySelector('.ordered-games-container');
    const totalTitle = document.querySelector('#total-price');
    let total = 0;
    selectedGames.forEach((item) => {
        container.insertAdjacentHTML("beforeend", `
            <div class="card">
                <div class="image-card-container">
                    <img src="${item.img}" alt="${item.nombre}">
                </div>
                <div class="info-container">
                    <h2>${item.nombre}</h2>
                    <h3>$${item.precio}</h3>
                </div>
            </div>
        `)
        total += parseFloat(item.precio);
    })
    totalTitle.textContent = `$${total}`;
}

createOrderButton.addEventListener("click", (e) => handleOrder(e));
document.addEventListener("DOMContentLoaded", () => renderOrderedGames());