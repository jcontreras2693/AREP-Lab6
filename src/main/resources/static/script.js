const url = 'https://backtaller6arep.duckdns.org:5000';
const apiUrl = url + '/properties';
const authApiUrl = url + '/user';

const propertyTable = document.getElementById('property-table');
if (propertyTable) {
    const propertyForm = document.getElementById('property-form');
    const propertyTableBody = document.getElementById('property-table').getElementsByTagName('tbody')[0];
    let editingPropertyId = null;

    window.onload = fetchProperties;

    function getToken() {
        return localStorage.getItem('token');
    }

    function fetchProperties() {
        const token = getToken();

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching properties: ' + response.statusText);
            }
            return response.json();
        })
        .then(properties => {
            propertyTableBody.innerHTML = '';
            properties.forEach(property => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${property.address}</td>
                    <td>${property.price}</td>
                    <td>${property.size}</td>
                    <td>${property.description}</td>
                    <td>
                        <button class="btn" onclick="updateProperty(${property.id})">Edit</button>
                        <button class="btn" onclick="deleteProperty(${property.id})">Delete</button>
                    </td>
                `;
                propertyTableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    }

    propertyForm.onsubmit = function(event) {
        event.preventDefault();

        const propertyData = {
            address: document.getElementById('address').value,
            price: document.getElementById('price').value,
            size: document.getElementById('size').value,
            description: document.getElementById('description').value
        };

        const token = getToken();

        const requestOptions = {
            method: editingPropertyId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(propertyData)
        };

        fetch(editingPropertyId ? `${apiUrl}/${editingPropertyId}` : apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error saving property: ' + response.statusText);
                }
                return response.json();
            })
            .then(() => {
                fetchProperties();
                propertyForm.reset();
                editingPropertyId = null;
            })
            .catch(err => {
                console.error(err);
                alert(err.message);
            });
    };

    function updateProperty(propertyId) {
        const token = getToken();

        fetch(`${apiUrl}/${propertyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching property for edit: ' + response.statusText);
            }
            return response.json();
        })
        .then(property => {
            document.getElementById('address').value = property.address;
            document.getElementById('price').value = property.price;
            document.getElementById('size').value = property.size;
            document.getElementById('description').value = property.description;
            editingPropertyId = propertyId;
        })
        .catch(err => {
            console.error(err);
            alert(err.message);
        });
    }

    function deleteProperty(propertyId) {
        if (confirm('¿Do you want to delete this property?')) {
            const token = getToken();

            fetch(`${apiUrl}/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error deleting property: ' + response.statusText);
                }
                fetchProperties();
            })
            .catch(err => {
                console.error(err);
                alert(err.message);
            });
        }
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${authApiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid Credentials');
        }
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = 'home.html';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = error.message;
    });
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${authApiUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('message').textContent = 'Successful register. Redirecting...';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            throw new Error('Error on register');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = error.message;
    });
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});