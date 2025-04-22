document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Hiba történt a termékek betöltése közben!');
    }
}

function displayProducts(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Kép cella
        const imgCell = document.createElement('td');
        if (product.image) {
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.hungarianName;
            img.className = 'product-image';
            imgCell.appendChild(img);
        } else {
            imgCell.textContent = 'Nincs kép';
        }
        row.appendChild(imgCell);

        // Többi adat
        row.appendChild(createCell(product.hungarianName));
        row.appendChild(createCell(product.czechName));
        row.appendChild(createCell(product.articleNumber));
        row.appendChild(createCell(getPackagingText(product.packaging)));
        row.appendChild(createCell(getQuantityText(product.quantity, product.packaging)));

        // Műveletek
        const actionsCell = document.createElement('td');
        actionsCell.className = 'action-buttons';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-primary me-2';
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
        editButton.onclick = () => editProduct(product.id);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.onclick = () => deleteProduct(product.id);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function createCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text || '-';
    return cell;
}

function getPackagingText(packaging) {
    const packagingTypes = {
        'piece': 'Darab',
        'box': 'Doboz',
        'package': 'Csomag'
    };
    return packagingTypes[packaging] || packaging;
}

function getQuantityText(quantity, packaging) {
    if (packaging === 'piece') {
        return `${quantity} db`;
    }
    return quantity.toString();
}

function editProduct(productId) {
    window.location.href = `products.html?id=${productId}`;
}

async function deleteProduct(productId) {
    if (!confirm('Biztosan törölni szeretné ezt a terméket?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        loadProducts(); // Termékek újratöltése
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Hiba történt a termék törlése közben!');
    }
} 