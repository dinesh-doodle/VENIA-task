// script.js
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const sortSelect = document.getElementById('sort-price');
    const resultCount = document.getElementById('result-count');
    const filterForm = document.getElementById('filter-form');
    const searchInput = document.getElementById('search-input');
    const loadMoreBtn = document.getElementById('load-more');
    const filterBtn = document.getElementById('filter-btn');
    const filterContent = document.getElementById('filter-content');


    let products = [];
    let productsCategories = [];
    let filteredProducts = [];

    initialLoadingProducts();

     // Function to show product loaders
     function initialLoadingProducts() {
        const productCount = 5; // Number of shimmer placeholders to show
        productList.innerHTML = Array.from({ length: productCount }).map(() => `
            <div class="product-card shimmer-wrapper">
                <div class="shimmer-img"></div>
                <div class="shimmer-text" style="width: 80%;"></div>
                <div class="shimmer-text" style="width: 60%;"></div>                
            </div>
        `).join('');
    }    

    // Fetch products from the API
    fetch('https://fakestoreapi.com/products?limit=10')
        .then(response => response.json())
        .then(data => {
            products = data;
            filteredProducts = products;
            productsCategories = [...new Set(products.map(product => product.category))];
            displayProducts(products);
            displayCategories(productsCategories);
            resultCount.textContent = `${products.length} Results`;
        })
        .catch(error => console.error('Error fetching products:', error));

    // Function to display products
    function displayProducts(products) {

        if(products.length === 0) return displayNoProductsFound();

        loadMoreBtn.style.display = "block";

        productList.innerHTML = products.map(product => `
            <div class="product-card" data-price="${product.price}">
                <img src="${product.image}" class="product-image" alt="${product.title}">
                <p class="product-name">${product.title}</p>                
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <img class="product-wishlist" src="svg/heart.svg" />
            </div>
        `).join('');     
    } 

    // Function to display categories
    function displayCategories(productsCategories) {
        filterForm.innerHTML = productsCategories.map(productCategory => `
            <label>
                <input type="checkbox" name="category" value="${productCategory}">
                ${productCategory}
            </label>
        `).join('');     
    }

    // Function to update the displayed products
    function updateDisplayedProducts() {
        let displayedProducts = filteredProducts;

        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            displayedProducts = displayedProducts.filter(product => 
                product.title.toLowerCase().startsWith(searchTerm) || product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        const sortValue = sortSelect.value;
        if (sortValue === 'asc') {
            displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
        } else if (sortValue === 'desc') {
            displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price);
        } else if (sortValue === 'prdasc') {
            displayedProducts = [...displayedProducts].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortValue === 'prddesc') {
            displayedProducts = [...displayedProducts].sort((a, b) => b.title.localeCompare(a.title));
        }

        displayProducts(displayedProducts);
        resultCount.textContent = `${displayedProducts.length} Results`;
    }

     // Function to display "No products found" message
     function displayNoProductsFound() {
        loadMoreBtn.style.display = "none";
        productList.innerHTML = `<div class="no-products"><h2>No products found</h2></div>`;
    }

    // Event listener for sorting
    sortSelect.addEventListener('change', updateDisplayedProducts);
    
    // Filtering functionality
    filterForm.addEventListener('change', () => {
        const checkedCategories = Array.from(filterForm.querySelectorAll('input[name="category"]:checked'))
        .map(checkbox => checkbox.value);
    
        if (checkedCategories.length > 0) {
            filteredProducts = products.filter(product => checkedCategories.includes(product.category.toLowerCase()));
        } else {
            filteredProducts = products; // If no filters are applied, show all products
        }                    
        updateDisplayedProducts();        
    });

    loadMoreBtn.addEventListener("click", () => {
        loadMoreBtn.innerHTML = "Loading...";
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.color = "#000";
        // loadMoreBtn.cursor = "default";

        fetch('https://fakestoreapi.com/products?limit=10')
        .then(response => response.json())
        .then(data => {
            products = [...products, ...data];
            filteredProducts = products;
            productsCategories = [...new Set(products.map(product => product.category))];
            displayProducts(products);
            displayCategories(productsCategories);
            resultCount.textContent = `${products.length} Results`;

            loadMoreBtn.innerHTML = "Load More";
            loadMoreBtn.disabled = false;            
        })
        .catch(error => console.error('Error fetching products:', error));

    })

    // Event listener for searching
    searchInput.addEventListener('input', updateDisplayedProducts);

    // event listener for filter btn in mobile responsive
    filterBtn.addEventListener('click', () => {
        // console.log(filterBtn);
        filterContent.classList.toggle("show-filters")
    });
});
