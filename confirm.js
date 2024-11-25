const confirmationButton = document.querySelector('#confirmation-btn');
const div = document.querySelector('div');

const handleConfirmation = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    try {
        const resConfirmation = await fetch('http://localhost:3000/api/v1/auth/confirmed', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        });
        div.children[1].remove();
        div.insertAdjacentHTML('beforeend', `
                <h1>Confirmado!</h1>
        `);
    } catch (error) {
        console.error(error);
    }
}

confirmationButton.addEventListener("click", () => handleConfirmation());