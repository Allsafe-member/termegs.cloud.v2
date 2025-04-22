document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const productsTable = document.getElementById('productsTable');

    let currentView = 'grid';
    let products = [];

    // Nézet váltás kezelése
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));

    // Keresés kezelése
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.hungarianName.toLowerCase().includes(searchTerm) ||
            product.czechName.toLowerCase().includes(searchTerm) ||
            product.articleNumber.toLowerCase().includes(searchTerm) ||
            (product.label && product.label.toLowerCase().includes(searchTerm))
        );
        displayProducts(filteredProducts);
    });

    loadProducts();

    function switchView(view) {
        currentView = view;
        if (view === 'grid') {
            productsGrid.style.display = 'grid';
            productsTable.style.display = 'none';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else {
            productsGrid.style.display = 'none';
            productsTable.style.display = 'block';
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
        }
        displayProducts(products);
    }
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error('Hiba történt a termékek betöltése közben');
        }
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termékek betöltése közben');
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const tableBody = document.getElementById('productTableBody');

    // Grid nézet frissítése
    productsGrid.innerHTML = products.length ? '' : '<div class="no-products">Nincsenek termékek</div>';
    
    // Lista nézet frissítése
    tableBody.innerHTML = '';

    products.forEach(product => {
        // Grid nézet elem létrehozása
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.hungarianName}">` : '<div class="no-image">Nincs kép</div>'}
            </div>
            <div class="product-info">
                <h2>${product.hungarianName}</h2>
                <p>${product.czechName}</p>
                <p class="article-number">Cikkszám: ${product.articleNumber}</p>
                <p class="packaging">${getPackagingText(product.packaging)}: ${getQuantityText(product)}</p>
                ${product.label ? `<p class="label">Címke: ${product.label}</p>` : ''}
                <div class="action-buttons mt-3">
                    <button class="btn btn-sm btn-primary me-2 edit-btn">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;

        // Események hozzáadása a kártya gombjaihoz
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editProduct(product.id);
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProduct(product.id);
        });

        productsGrid.appendChild(card);

        // Lista nézet sor létrehozása
        const row = document.createElement('tr');
        
        const imageCell = document.createElement('td');
        if (product.image) {
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.hungarianName;
            img.className = 'product-image';
            imageCell.appendChild(img);
        } else {
            imageCell.textContent = 'Nincs kép';
        }

        const actionsCell = document.createElement('td');
        actionsCell.className = 'action-buttons';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-primary me-2';
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
        editButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editProduct(product.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProduct(product.id);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(imageCell);
        row.appendChild(createCell(product.hungarianName));
        row.appendChild(createCell(product.czechName));
        row.appendChild(createCell(product.articleNumber));
        row.appendChild(createCell(getPackagingText(product.packaging)));
        row.appendChild(createCell(product.label || '-'));
        row.appendChild(createCell(getQuantityText(product)));
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
        'bottle': 'Üveg',
        'capsule': 'Kapszula'
    };
    return packagingTypes[packaging] || packaging;
}

function getQuantityText(product) {
    if (product.packaging === 'capsule' && product.capsuleCount) {
        return `${product.capsuleCount} db`;
    } else if (product.packaging === 'bottle' && product.liquidVolume) {
        return `${product.liquidVolume} ml`;
    }
    return '-';
}

function editProduct(id) {
    window.location.href = `products.html?id=${id}`;
}

async function deleteProduct(id) {
    if (!confirm('Biztosan törölni szeretné ezt a terméket?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Hiba történt a termék törlése közben');
        }

        loadProducts();
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termék törlése közben');
=======
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
>>>>>>> 24192fbe205f4a275854eec7e9dfaef30fc121d3
    }
} 