const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.termegs.cloud';

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const productsTable = document.getElementById('productsTable');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');

// View state
let currentView = 'grid';
let products = [];

// Event listeners for view switching
gridViewBtn.addEventListener('click', () => switchView('grid'));
listViewBtn.addEventListener('click', () => switchView('list'));

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.czechName.toLowerCase().includes(searchTerm) ||
        product.articleNumber.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// Modal close events
modalClose.addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);

// Fetch and display products
async function fetchProducts() {
    try {
        console.log('Fetching products from:', `${API_BASE_URL}/api/products`);
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received products:', data);
        
        if (!Array.isArray(data)) {
            console.error('Received data is not an array:', data);
            throw new Error('Invalid data format received from server');
        }
        
        products = data;
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = `
            <div class="alert alert-danger">
                Hiba történt a termékek betöltése során: ${error.message}
                <br>
                <small>Kérjük, ellenőrizze a konzolt további információkért.</small>
            </div>`;
    }
}

// Switch view function
function switchView(view) {
    currentView = view;
    if (view === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        productsGrid.style.display = 'flex';
        productsTable.style.display = 'none';
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        productsGrid.style.display = 'none';
        productsTable.style.display = 'block';
    }
    displayProducts(products);
}

// Display products function
function displayProducts(productsToDisplay) {
    if (currentView === 'grid') {
        productsGrid.innerHTML = productsToDisplay.map(product => `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image">
                    <img src="${product.image || 'placeholder.jpg'}" alt="${product.hungarianName}">
                </div>
                <div class="product-info">
                    <h3>${product.hungarianName}</h3>
                    <p class="czech-name">${product.czechName || ''}</p>
                    <p class="article-number">Cikkszám: ${product.articleNumber}</p>
                    <div class="info-row">
                        <div class="packaging">
                            ${product.packaging === 'capsule' ? 
                                `<i class="bi bi-capsule"></i> Kapszula: ${product.capsuleCount || 0} db` :
                                `<i class="bi bi-droplet-fill"></i> Kiszerelés: ${product.liquidVolume || 0} ml`
                            }
                        </div>
                        ${product.weight ? `
                            <div class="weight">
                                <i class="bi bi-box-seam"></i> ${product.weight} g
                            </div>
                        ` : ''}
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${product._id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers for grid view
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-buttons')) {
                    const productId = card.dataset.productId;
                    const product = products.find(p => p._id === productId);
                    if (product) {
                        openProductModal(product);
                    }
                }
            });
        });

        // Add click handlers for action buttons in grid view
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                window.location.href = `products.html?id=${productId}`;
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
                    deleteProduct(productId);
                }
            });
        });
    } else {
        const tableBody = document.getElementById('productTableBody');
        tableBody.innerHTML = productsToDisplay.map(product => `
            <tr data-product-id="${product._id}">
                <td>
                    <img src="${product.image || 'placeholder.jpg'}" alt="${product.hungarianName}" style="width: 50px; height: 50px; object-fit: cover;">
                </td>
                <td>
                    <div>${product.hungarianName}</div>
                    <small class="text-muted">${product.czechName || ''}</small>
                </td>
                <td>${product.articleNumber}</td>
                <td>
                    ${product.packaging === 'capsule' ? 
                        `<i class="bi bi-capsule"></i> ${product.capsuleCount || 0} db` :
                        `<i class="bi bi-droplet-fill"></i> ${product.liquidVolume || 0} ml`
                    }
                    ${product.weight ? `<br><i class="bi bi-box-seam"></i> ${product.weight} g` : ''}
                </td>
                <td>
                    <button class="btn btn-primary btn-sm edit-btn me-2" data-id="${product._id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add click handlers for table rows
        document.querySelectorAll('#productTableBody tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const productId = row.dataset.productId;
                    const product = products.find(p => p._id === productId);
                    if (product) {
                        openProductModal(product);
                    }
                }
            });
        });

        // Add click handlers for action buttons in list view
        document.querySelectorAll('#productTableBody .edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                window.location.href = `products.html?id=${productId}`;
            });
        });

        document.querySelectorAll('#productTableBody .delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
                    deleteProduct(productId);
                }
            });
        });
    }
}

// Delete product function
async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        products = products.filter(p => p._id !== productId);
        displayProducts(products);
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Hiba történt a termék törlése során');
    }
}

// Modal functions
function openProductModal(product) {
    const modalTitle = document.getElementById('modalTitle');
    const modalCzechName = document.getElementById('modalCzechName');
    const modalArticleNumber = document.getElementById('modalArticleNumber');
    const modalPackaging = document.getElementById('modalPackaging');
    const modalWeight = document.getElementById('modalWeight');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = product.hungarianName;
    modalCzechName.textContent = product.czechName || '';
    modalArticleNumber.textContent = `Cikkszám: ${product.articleNumber}`;

    if (product.packaging === 'capsule') {
        modalPackaging.innerHTML = `
            <i class="bi bi-capsule"></i>
            Kapszula: ${product.capsuleCount} db
        `;
    } else {
        modalPackaging.innerHTML = `
            <i class="bi bi-droplet-fill"></i>
            Kiszerelés: ${product.liquidVolume} ml
        `;
    }

    modalWeight.innerHTML = `
        <i class="bi bi-box-seam"></i>
        Súly: ${product.weight} g
    `;

    modalDescription.textContent = formatDescription(product.description);

    modalOverlay.classList.add('active');
    productModal.classList.add('active');
}

function closeProductModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const productModal = document.getElementById('productModal');

    modalOverlay.classList.remove('active');
    productModal.classList.remove('active');
}

function formatDescription(description) {
    if (!description) return '';
    
    // Split by newlines and filter out empty lines
    const lines = description.split('\n').filter(line => line.trim());
    
    // Join with double line breaks for better spacing
    return lines.join('\n\n');
}

// Initialize
fetchProducts();