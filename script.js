

const foodItems = [
    { name: "Rajma Chawal", price: 120, category: "Veg" },
    { name: "Paneer Thali", price: 180, category: "Veg" },
    { name: "Chicken Curry", price: 220, category: "Non-Veg" },
    { name: "Dal Tadka", price: 100, category: "Low Spice" }
];



let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "All";
let discountAmount = 0;



function displayFood() {
    const container = document.getElementById("foodContainer");
    if (!container) return;

    container.innerHTML = "";

    const searchValue = document.getElementById("search")?.value.toLowerCase() || "";

    const filtered = foodItems.filter(item =>
        (currentCategory === "All" || item.category === currentCategory) &&
        item.name.toLowerCase().includes(searchValue)
    );

    filtered.forEach(item => {
        container.innerHTML += `
            <div class="card">
                <h3>${item.name}</h3>
                <p>Category: ${item.category}</p>
                <p class="price">₹${item.price}</p>
                <button onclick="addToCart('${item.name}', ${item.price})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}



function filterCategory(category) {
    currentCategory = category;
    displayFood();
}

function filterFood() {
    displayFood();
}



function toggleCart() {
    const cartPanel = document.getElementById("sideCart");
    if (cartPanel) {
        cartPanel.classList.toggle("active");
    }
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
}

function increaseQty(index) {
    cart[index].quantity++;
    saveCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ₹${item.price}
                </div>
                <div class="quantity-controls">
                    <button onclick="decreaseQty(${index})">−</button>
                    ${item.quantity}
                    <button onclick="increaseQty(${index})">+</button>
                </div>
            </div>
        `;
    });

    if (cartTotal) cartTotal.textContent = total;
    if (cartCount) cartCount.textContent = count;
}



function displayCheckout() {
    const cartDetails = document.getElementById("cartDetails");
    if (!cartDetails) return;

    const subtotalElement = document.getElementById("subtotal");
    const gstElement = document.getElementById("gst");
    const finalTotalElement = document.getElementById("finalTotal");

    let subtotal = 0;
    cartDetails.innerHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        cartDetails.innerHTML += `
            <div class="row">
                <span>${item.name} x${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });

    let gst = subtotal * 0.05;
    let delivery = 40;

    if (subtotalElement) subtotalElement.textContent = "₹" + subtotal;
    if (gstElement) gstElement.textContent = "₹" + gst.toFixed(2);

    let finalTotal = subtotal + gst + delivery - discountAmount;

    if (finalTotalElement)
        finalTotalElement.textContent = "₹" + finalTotal.toFixed(2);
}



function applyCoupon() {
    const input = document.getElementById("couponCode");
    if (!input) return;

    const code = input.value.trim();

    if (code === "HOME10") {
        discountAmount = 10;
        alert("Coupon Applied! ₹10 Off");
    } else if (code === "HOME50") {
        discountAmount = 50;
        alert("Coupon Applied! ₹50 Off");
    } else {
        discountAmount = 0;
        alert("Invalid Coupon");
    }

    updateFinalTotal();
}

function updateFinalTotal() {
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    let gst = subtotal * 0.05;
    let delivery = 40;

    let finalTotal = subtotal + gst + delivery - discountAmount;

    const discountElement = document.getElementById("discount");
    const finalTotalElement = document.getElementById("finalTotal");

    if (discountElement)
        discountElement.textContent = "- ₹" + discountAmount;

    if (finalTotalElement)
        finalTotalElement.textContent = "₹" + finalTotal.toFixed(2);
}



function placeOrder() {
    alert("Order Placed Successfully!");
    localStorage.removeItem("cart");
    window.location.href = "./success.html";
}




function goToCheckout() {
    window.location.href = "cart.html";
}

function scrollToMenu() {
    const menu = document.getElementById("menu");
    if (menu) {
        menu.scrollIntoView({ behavior: "smooth" });
    }
}



displayFood();
updateCartUI();
displayCheckout();
