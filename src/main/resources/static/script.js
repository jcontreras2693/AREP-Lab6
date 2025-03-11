const url = 'https://backtaller6arep.duckdns.org:5000';
const apiUrl = url + '/properties';
// URL base para las solicitudes de autenticación
const authApiUrl = url + '/user';

// DOM elements
const propertyForm = document.getElementById('property-form');
const propertyTableBody = document.getElementById('property-table').getElementsByTagName('tbody')[0];

let editingPropertyId = null; // Guarda el ID de la propiedad en edición

// Cargar propiedades al iniciar
window.onload = fetchProperties;

// Obtener todas las propiedades
function fetchProperties() {
    fetch(apiUrl, { credentials: 'include' })
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
                        <button class="btn" onclick="editProperty(${property.id})">Edit</button>
                        <button class="btn" onclick="deleteProperty(${property.id})">Delete</button>
                    </td>
                `;
                propertyTableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error(err);
            alert(err.message); // Mostrar mensaje de error al usuario
        });
}

// Enviar formulario (Crear o actualizar propiedad)
propertyForm.onsubmit = function(event) {
    event.preventDefault();

    const propertyData = {
        address: document.getElementById('address').value,
        price: document.getElementById('price').value,
        size: document.getElementById('size').value,
        description: document.getElementById('description').value
    };

    const requestOptions = {
        method: editingPropertyId ? 'PUT' : 'POST', // Si hay un ID, actualizar con PUT, si no, crear con POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
    };

    fetch(editingPropertyId ? `${apiUrl}/${editingPropertyId}` : apiUrl, requestOptions)
        .then(response => response.json())
        .then(() => {
            fetchProperties(); // Refrescar la lista
            propertyForm.reset(); // Limpiar el formulario
            editingPropertyId = null; // Resetear el ID después de editar
        })
        .catch(err => console.error('Error saving property:', err));
};

function editProperty(propertyId) {
    fetch(`${apiUrl}/${propertyId}`, { credentials: 'include' })
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
            editingPropertyId = propertyId; // Guardar el ID para editar
        })
        .catch(err => {
            console.error(err);
            alert(err.message); // Mostrar mensaje de error al usuario
        });
}

function deleteProperty(propertyId) {
    if (confirm('¿Do you want to delete this property?')) {
        fetch(`${apiUrl}/${propertyId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting property: ' + response.statusText);
            }
            fetchProperties(); // Refrescar la lista
        })
        .catch(err => {
            console.error(err);
            alert(err.message); // Mostrar mensaje de error al usuario
        });
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
        credentials: 'include' // Incluir credenciales
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parsear la respuesta JSON
        } else {
            throw new Error('Invalid Credentials');
        }
    })
    .then(data => {
        // Guardar datos del usuario en localStorage o sessionStorage si es necesario
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'index.html'; // Redirige a la página principal
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
                window.location.href = 'login.html'; // Redirige al login después del registro
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

// Asignar eventos a los formularios
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
