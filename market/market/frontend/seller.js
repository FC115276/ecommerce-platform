const user = requireAuth("SELLER");

function loadSellerProducts() {
    fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("productTableBody");
        tbody.innerHTML = "";
        data.forEach(p => {
            const isUrl = p.image && (p.image.startsWith('http://') || p.image.startsWith('https://'));
            const imageHtml = isUrl ? `<img src="${p.image}" alt="${p.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">` : `<span style="font-size: 1.5rem;">${p.image || '📦'}</span>`;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${imageHtml}</td>
                <td>${p.name}</td>
                <td>
                    <input type="number" id="price-${p.id}" value="${p.price}" step="0.01" class="form-control" style="width: 100px;">
                </td>
                <td>
                    <button class="btn-secondary" onclick="updatePrice(${p.id}, '${p.name}', '${p.image}')">Update</button>
                    <button class="btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("prodName").value;
    const price = document.getElementById("prodPrice").value;
    const image = document.getElementById("prodImage").value;

    fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, price: parseFloat(price), image})
    })
    .then(() => {
        document.getElementById("addProductForm").reset();
        loadSellerProducts();
    });
});

function updatePrice(id, name, image) {
    const newPrice = document.getElementById(`price-${id}`).value;
    fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, price: parseFloat(newPrice), image: image === 'null' ? null : image})
    })
    .then(() => alert("Price updated successfully!"));
}

function deleteProduct(id) {
    if(confirm("Are you sure you want to delete this product?")) {
        fetch(`${API_URL}/products/${id}`, {
            method: "DELETE"
        })
        .then(() => loadSellerProducts());
    }
}

loadSellerProducts();
