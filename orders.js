const user = JSON.parse(localStorage.getItem('user'));
const ordersContainer = document.querySelector('.orders-container');
const logoutButton = document.querySelector('#logout-btn');

const renderOrders = async () => {
    const token = localStorage.getItem('jwt');
    const resOrders = await fetch('http://localhost:3000/api/v1/profile/myOrders', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const orders = await resOrders.json();

    let orderCounter = 1;
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');
        orderDiv.innerHTML = `
        <h2>Pedido #${orderCounter}</h2>
        <p><strong>Cliente:</strong> ${order.user.nombre}</p>
        <p><strong>Forma de Pago:</strong> ${order.forma_de_pago}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Fecha:</strong> ${new Date(order.fecha_pedido).toLocaleDateString()}</p>
        <div class="items-container">
            ${order.items.length
                ? order.items
                    .map(
                        item => `
            <div class="item">
                <img src="${item.img}" alt="${item.nombre}">
                <div class="item-info">
                <h3>${item.nombre}</h3>
                <p><strong>Precio:</strong> $${item.precio}</p>
                <p><strong>Cantidad:</strong> ${item.DetailsOrders.cantidad}</p>
                </div>
            </div>
            `
                    )
                    .join('')
                : '<p>Este pedido no tiene productos.</p>'
            }
        </div>
        `;
        ordersContainer.appendChild(orderDiv);
        orderCounter++;
    });
}

const showUserInfo = () => {
    const usersName = document.querySelector('#client-info h1');
    const usersUsername = document.querySelector('#client-info p');
    usersName.textContent = user.nombre;
    usersUsername.textContent = user.usuario;
}

const handleLogout = async () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

document.addEventListener("DOMContentLoaded", () => {
    showUserInfo();
    renderOrders();
});

logoutButton.addEventListener('click', () => handleLogout());