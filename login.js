const loginButton = document.querySelector('#login-btn');

const handleLogin = async (e) => {
    e.preventDefault();
    const inputs = [...document.querySelectorAll('form input')];
    const userInfo = [];
    inputs.map((input) => {
        userInfo.push(input.value);
    })
    console.log(userInfo);
    try {
        const resLogin = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo : userInfo[0],
                contrasena : userInfo[1]
            })
        });
        const data = await resLogin.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("jwt", data.token);
        window.location.href = "/index.html"
    } catch (error) {
        const errorTitle = document.querySelector('#error-title');
        errorTitle.textContent = "Revisa tus datos, algo salió mal"
    }
}

loginButton.addEventListener("click", (e) => handleLogin(e));