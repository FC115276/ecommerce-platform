const user = requireAuth("BUYER");

function loadCart() {
    fetch(`${API_URL}/cart`)
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById("cartTableBody");
        tbody.innerHTML = "";
        data.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${item.productId}</td>
                <td>
                    <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" class="form-control" style="width: 80px; display: inline-block;">
                </td>
                <td>
                    <button class="btn-secondary" onclick="updateCartQuantity(${item.id}, ${item.productId})">Update</button>
                    <button class="btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function updateCartQuantity(id, productId) {
    const newQty = document.getElementById(`qty-${id}`).value;
    fetch(`${API_URL}/cart/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ productId: productId, quantity: parseInt(newQty) })
    })
    .then(() => alert("Quantity updated!"))
    .catch(err => alert("Error updating quantity."));
}

function removeFromCart(id) {
    if(confirm("Are you sure you want to remove this item?")) {
        fetch(`${API_URL}/cart/${id}`, {
            method: "DELETE"
        })
        .then(() => loadCart())
        .catch(err => alert("Error removing item."));
    }
}

loadCart();
