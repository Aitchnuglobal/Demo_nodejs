document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const phone_number = document.getElementById('phone_number').value;
    const email = document.getElementById('email').value;
    const college_name = document.getElementById('college_name').value;
    const branch = document.getElementById('branch').value;
    const password = document.getElementById('password').value;

    fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name, last_name, phone_number, email, college_name, branch, password })
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('message').textContent = data;
        })
        .catch(error => console.error('Error:', error));
});