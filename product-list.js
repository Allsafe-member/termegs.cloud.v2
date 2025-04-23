const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://termegs-cloud-v2-1.onrender.com';

let products = [];

document.addEventListener('DOMContentLoaded', () => {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.getElementById('productsGrid');
    const productsTable = document.getElementById('productsTable');

    let currentView = 'grid';

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
        console.log('Termékek betöltése...');
        const response = await fetch(`${API_BASE_URL}/products`);
        console.log('Szerver válasz:', response);
        
        if (!response.ok) {
            throw new Error('Hiba történt a termékek betöltése közben');
        }
        
        const data = await response.json();
        console.log('Betöltött termékek:', data);
        
        products = data;
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
            editProduct(product._id);
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProduct(product._id);
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
            editProduct(product._id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteProduct(product._id);
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
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Hiba történt a termék törlése közben');
        }

        loadProducts();
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a termék törlése közben');
    }
} 