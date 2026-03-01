let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    displayCart();
}

function displayCart() {
    let cartDiv = document.getElementById("cartItems");
    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        total += item.price;
        cartDiv.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
}

function placeOrder() {
    let message = "Hello, I want to order:\n";
    cart.forEach(item => {
        message += item.name + "\n";
    });

    let phone = "919457775451";
    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}