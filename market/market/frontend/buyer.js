const user = requireAuth("BUYER");

function loadBuyerProducts() {
    fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById("productGrid");
        grid.innerHTML = "";
        data.forEach(p => {
            const isUrl = p.image && (p.image.startsWith('http://') || p.image.startsWith('https://'));
            const imageHtml = isUrl ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">` : (p.image || '📦');
            
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-image" style="${isUrl ? 'padding:0; overflow:hidden;' : ''}">${imageHtml}</div>
                <div class="product-details">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">Rs ${p.price}</div>
                    <button class="btn-primary mt-auto" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
    });
}

function addToCart(id) {
    fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ productId: id, quantity: 1 })
    })
    .then(() => alert("Added to Cart!"))
    .catch(err => alert("Error adding to cart."));
}

loadBuyerProducts();
