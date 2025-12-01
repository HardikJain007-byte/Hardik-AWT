// Load stock
async function loadItems() {
    let res = await fetch("/items");
    let items = await res.json();

    let table = document.getElementById("itemTable");
    table.innerHTML = "";

    items.forEach(i => {
        table.innerHTML += `
        <tr>
            <td>${i.name}</td>
            <td>${i.price}</td>
            <td>${i.quantity}</td>
            <td>
                <button onclick="deleteItem('${i._id}')">Delete</button>
                <button onclick="updateItem('${i._id}')">Update</button>
                <button onclick="saleItem('${i._id}')">Sale</button>
            </td>
        </tr>`;
    });
}
loadItems();

// Add item
document.getElementById("addForm").addEventListener("submit", async e => {
    e.preventDefault();

    let data = Object.fromEntries(new FormData(e.target).entries());

    await fetch("/items/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    e.target.reset();
    loadItems();
});

// Delete
async function deleteItem(id) {
    await fetch(`/items/delete/${id}`, { method: "DELETE" });
    loadItems();
}

// Update
async function updateItem(id) {
    let price = prompt("Enter new price:");
    let qty = prompt("Enter new quantity:");

    await fetch(`/items/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, quantity: qty })
    });

    loadItems();
}

// Sale
async function saleItem(id) {
    let qty = prompt("Enter quantity sold:");

    await fetch(`/items/sale/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty })
    });

    loadItems();
}