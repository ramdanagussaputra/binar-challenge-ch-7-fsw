const btnSubmit = document.querySelector('.btn-form');
const form = document.querySelector('.form');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // GET DATA FROM FORM
    const formData = Object.fromEntries(new FormData(form).entries());
    console.log(formData);

    // ADD GAME HISTORY
    const user = {
        ...formData,
        win: 0,
        lose: 0,
        draw: 0,
        date: Date.now(),
    };

    // SEND DATA TO SERVER
    const response = await fetch('http://localhost:7000/api/user-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    window.location.reload();

    alert('Account successfully created');
});
