const apiUrl = '/properties';

// DOM elements
const propertyForm = document.getElementById('property-form');
const propertyTableBody = document.getElementById('property-table').getElementsByTagName('tbody')[0];

let editingPropertyId = null; // Guarda el ID de la propiedad en edición

// Cargar propiedades al iniciar
window.onload = fetchProperties;

// Obtener todas las propiedades
function fetchProperties() {
    fetch(apiUrl)
        .then(response => response.json())
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
        .catch(err => console.error('Error fetching properties:', err));
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

// Editar propiedad (cargar datos en el formulario)
function editProperty(propertyId) {
    fetch(`${apiUrl}/${propertyId}`)
        .then(response => response.json())
        .then(property => {
            document.getElementById('address').value = property.address;
            document.getElementById('price').value = property.price;
            document.getElementById('size').value = property.size;
            document.getElementById('description').value = property.description;
            editingPropertyId = propertyId; // Guardar el ID para editar
        })
        .catch(err => console.error('Error fetching property for edit:', err));
}

// Eliminar propiedad
function deleteProperty(propertyId) {
    fetch(`${apiUrl}/${propertyId}`, { method: 'DELETE' })
        .then(() => fetchProperties())
        .catch(err => console.error('Error deleting property:', err));
}


