
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Here you would typically send the data to your backend
    console.log('Registration data:', { username, email });
    alert('Registration successful!');
    
    // Clear the form
    this.reset();
});
