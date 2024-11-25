const categoryForm = document.getElementById('category-form');
const videogameForm = document.getElementById('videogame-form');

// Función para actualizar select dinámico
const updateCategorySelect = async () => {
    validateCredentials();
    const resCategories = await fetch('http://localhost:3000/api/v1/categories');
    const categories = await resCategories.json();
    const categorySelect = document.getElementById('game-category');
    categorySelect.innerHTML = '';
    const firstOption = document.createElement('option');
    firstOption.value = 'null';
    firstOption.textContent = 'Seleccionar categoria';
    categorySelect.appendChild(firstOption);
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.textContent = category.nombre;
        categorySelect.appendChild(option);
    });
};

// Función para añadir una nueva categoría
const addCategory = async (name) => {
    validateCredentials();
    const token = localStorage.getItem('jwt');
    try {
        const resCreation = await fetch('http://localhost:3000/api/v1/categories', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: name
            })
        });
        const dataCreation = await resCreation.json();
        await updateCategorySelect();
        const creationTitle = document.querySelector('#success-category');
        creationTitle.textContent = "Categoria creada!"
    } catch (error) {
        console.error(error)
    }
};

const addGame = async () => {
    validateCredentials();
    const token = localStorage.getItem('jwt');
    const videogameFields = [...document.querySelector("#videogame-form").children];
    const videogamesValues = videogameFields.map((input) => {
        const value = input.value;
        input.value = '';
        return value;
    })
    try {
        const resCreation = await fetch('http://localhost:3000/api/v1/videogames', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: videogamesValues[0],
                precio: videogamesValues[1],
                stock: videogamesValues[2],
                img: videogamesValues[3],
                trailer: videogamesValues[4],
                description: videogamesValues[5],
                id_categoria: videogamesValues[6],
                id_plataforma: videogamesValues[7],
                precio_real: videogamesValues[8]
            })
        });
        const dataCreation = await resCreation.json();
        console.log(dataCreation);
        const creationTitle = document.querySelector('#success-videogame');
        creationTitle.textContent = "Videojuego creado!"
    } catch (error) {
        console.error(error)
    }
}

const validateCredentials = () => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || token === 'undefined' || user.rol !== 'admin'){
        window.location.href = '/login.html';
        return;
    }
}

// Event Listener para el formulario de categorías
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('category-name').value;
    addCategory(categoryName);
    alert('Categoría añadida');
});

videogameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addGame();
})


document.addEventListener("DOMContentLoaded", () => updateCategorySelect());