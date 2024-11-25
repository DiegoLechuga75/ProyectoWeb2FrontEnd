const registerButton = document.querySelector('#register-btn');


const sendRegistration = async (e) => {
    e.preventDefault();
    console.log("Enviando registro");
    const inputs = [...document.querySelectorAll('form input')];
    const userInfo = [];
    inputs.map((input) => {
        userInfo.push(input.value);
    })
    console.log(userInfo);
    try {
        const resCreation = await fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre : userInfo[3],
                correo : userInfo[0],
                telefono : userInfo[4],
                direccion : userInfo[5],
                rol : "cliente",
                usuario : userInfo[6],
                contrasena : userInfo[1]
            })
        });
        const dataCreation = await resCreation.json();
        console.log(dataCreation);
        const resConfirmation = fetch('http://localhost:3000/api/v1/auth/confirmation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo : userInfo[0],
            })
        })
        const form = document.querySelector('form');
        form.insertAdjacentHTML('beforeend', `
            <h1 style="align-self: center;">Usuario registrado!</h1>
        `)
    } catch (error) {
        console.error(error)
    }
    
}


registerButton.addEventListener("click", (e) => sendRegistration(e));