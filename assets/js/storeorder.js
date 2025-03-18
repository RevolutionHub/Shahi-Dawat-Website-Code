// Initialize the cart array and total cart value
let cart = [];
let cartTotal = 0;
// Function to handle adding items to the cart
function addToCart(productName, productPrice, quantity, productImage) {

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // If product exists in the cart, update its quantity
        existingProduct.quantity += quantity;
    } else {
        // Add new product to the cart
        cart.push({ name: productName, price: productPrice, quantity: quantity, image: productImage });
    }

    // Update the total cart value
    cartTotal += productPrice * quantity;

    showTemporaryMessage('Added to cart!');
    // Update the cart total display in the header
    document.getElementById('cart-count').innerText = `$${cartTotal.toFixed(2)}`;
}

function showTemporaryMessage(message) {
    const alertBox = document.getElementById('alert-box');
    alertBox.innerText = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000); // Message disappears after 3 seconds
}

// Event listeners for the Add to Cart buttons
document.querySelectorAll('.quantity-control-container').forEach(container => {
    const addToCartBtn = container.querySelector('.add-to-cart');
    const productName = container.getAttribute('data-product-name');
    const productPrice = parseFloat(container.getAttribute('data-product-price'));
    const productImage = container.querySelector('img') ? container.querySelector('img').src : '';

    // Add event listener for Add to Cart button
    addToCartBtn.addEventListener('click', () => {
        const quantity = 1; // Default quantity is 1
        addToCart(productName, productPrice, quantity, productImage);
    });
});

// Modal handling logic
const modal = document.getElementById("cartModal");
const checkoutcontainer = document.getElementById("checkoutcontainer");
const successpickup = document.getElementById("successpickup");
const closeModalSuccesspickup = document.getElementById("closeModalSuccesspickup");
const closeModal = document.getElementById("closeModal");
const closeModalcheckout = document.getElementById("closeModalcheckout");
const modalItems = document.getElementById("modal-items");
const modalTotal = document.getElementById("modal-total");
const warningMessage = document.getElementById("warning-message");
// Function to display the cart in the modal
function displayCart() {
    const urlParams = new URLSearchParams(window.location.search);

    modalItems.innerHTML = ''; // Clear previous cart items

    cart.forEach((item, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <div class="cart-item-details">
                <span style="color: black;" class="cart-item-name">${item.name}</span>
                <div class="quantity-control">
                    <button  style="color: black;" class="decrease-btn" id="decreasebtn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="color: black;" class="quantity">${item.quantity}</span>
                    <button style="color: black;" class="increase-btn" id="increasebtn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <span style="color: black;" class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button style="color: black;" class="remove-btn" id="removeitem" onclick="removeItem(${index})">&times;</button>
            </div>
        `;
        modalItems.appendChild(productElement);
    });

    // Update the total in the modal
    document.getElementById('modal-total').textContent = `$${cartTotal.toFixed(2)}`;
    document.getElementById('cart-count').innerText = `$${cartTotal.toFixed(2)}`;

    // Show the modal
    modal.style.display = 'block';
}

// Function to change the quantity of items in the cart
function changeQuantity(index, amount) {
    const item = cart[index];
    const newQuantity = item.quantity + amount;

    if (newQuantity <= 0) {
        removeItem(index); // Remove the item if the quantity goes below 1
    } else {
        cart[index].quantity = newQuantity;
        cartTotal += item.price * amount; // Adjust total based on quantity change
    }
    displayCart(); // Re-render the cart
    checkButtonStatus();
}

// Function to remove items from the cart
function removeItem(index) {
    const item = cart[index];
    cartTotal -= item.price * item.quantity; // Adjust total by removing the item's price
    cart.splice(index, 1); // Remove the item from the cart

    displayCart(); // Re-render the cart
    checkButtonStatus();
}

// Show the cart modal when the cart icon is clicked
document.getElementById('cart-link').onclick = function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    displayCart(); // Display the cart in the modal
    checkButtonStatus();
};

// Close the modal when the user clicks the close button
closeModal.onclick = function () {
    modal.style.display = 'none';
};

closeModalcheckout.onclick = function () {
    checkoutcontainer.style.display = 'none';
};


closeModalSuccesspickup.onclick = function () {
    successpickup.style.display = 'none';
};

// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function (event) {
    if (event.target == checkoutcontainer) {
        checkoutcontainer.style.display = 'none';
    }
};


// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function (event) {
    if (event.target == closeModalSuccesspickup) {
        successpickup.style.display = 'none';
    }
};




document.getElementById("checkoutButton").addEventListener("click", function () {
    displaychekoutcart();
    // Show the modal
    modal.style.display = 'none';
    checkoutcontainer.style.display = 'block';
});

function displaychekoutcart() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDelivery = urlParams.get('isDelivery');
    const modalItems = document.getElementById("checkout-items");
    modalItems.innerHTML = ''; // Clear previous cart items

    cart.forEach((item, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <div class="cart-item-details">
                <span style="color: black;" class="cart-item-name">${item.name}</span>
                <div class="quantity-control">
                    <button style="color: black;" class="decrease-btn" id="decreasebtn" onclick="changeQuantitycheckout(${index}, -1)">-</button>
                    <span style="color: black;" class="quantity">${item.quantity}</span>
                    <button style="color: black;" class="increase-btn" id="increasebtn" onclick="changeQuantitycheckout(${index}, 1)">+</button>
                </div>
                <span style="color: black;" class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" id="removeitem" onclick="removeItemchekcout(${index})">&times;</button>
            </div>
        `;
        modalItems.appendChild(productElement);
    });

    // Update the total in the modal
    document.getElementById('checkout-total').textContent = `$${cartTotal.toFixed(2)}`;
    document.getElementById('cart-count').innerText = `$${cartTotal.toFixed(2)}`;
}

// Function to change the quantity of items in the cart
function changeQuantitycheckout(index, amount) {
    const item = cart[index];
    const newQuantity = item.quantity + amount;

    if (newQuantity <= 0) {
        removeItem(index); // Remove the item if the quantity goes below 1
    } else {
        cart[index].quantity = newQuantity;
        cartTotal += item.price * amount; // Adjust total based on quantity change
    }
    displaychekoutcart(); // Re-render the cart
}


// Function to remove items from the cart
function removeItemchekcout(index) {
    const item = cart[index];
    cartTotal -= item.price * item.quantity; // Adjust total by removing the item's price
    cart.splice(index, 1); // Remove the item from the cart
    displaychekoutcart(); // Re-render the cart
}


//on place order

document.getElementById('checkoutForm').addEventListener('submit', function (event) {

    event.preventDefault();
    var formData = new FormData(this);


    // Get the checkout items container
    const checkoutitems = document.getElementById('checkout-items');

    // Get all item details
    const cartItemNames = checkoutitems.querySelectorAll('.cart-item-name');
    const cartItemQuantity = checkoutitems.querySelectorAll('.quantity');
    const cartItemPrice = checkoutitems.querySelectorAll('.cart-item-price');

    // Initialize an array to hold combined cart item details
    let combinedCartDetails = [];

    // Iterate over all items and combine details into one array
    for (let i = 0; i < cartItemNames.length; i++) {
        let itemName = cartItemNames[i].innerText.trim(); // Get item name text
        let itemQuantity = cartItemQuantity[i].innerText.trim(); // Get quantity text
        let itemPrice = cartItemPrice[i].innerText.trim(); // Get price text

        // Combine into a formatted string or object (here we're using a string)
        let combinedItemDetail = `Item: ${itemName} - Quantity: ${itemQuantity} - Price: ${itemPrice}`;

        // Add to combinedCartDetails array
        combinedCartDetails.push(combinedItemDetail);
    }

    // Add combined cart details array to FormData
    // Convert array to JSON string for easier handling in Google Apps Script
    formData.append('cartDetails', JSON.stringify(combinedCartDetails));


    const checkouttotal = document.getElementById('checkout-total').innerHTML;
    formData.append('checkouttotal', checkouttotal);


    // Check if the 'time' field is empty
    if (formData.get(checkouttotal) === "") {
        alert('Please select order items.');
        return; // Stop form submission if the time field is empty
    }

    fetch('https://script.google.com/macros/s/AKfycbyJ87WEHDS7q4OE_2vqj02CuQRVZKUTp15zykz3-ttPZl5vdcR8cvqANczrkmmIMmpX/exec', {
        method: 'POST',
        mode: 'no-cors',  // This disables CORS checks
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('successpickup').style.display = 'block';
            document.getElementById('cart-count').innerText = `$0.00`;
            document.getElementById('checkoutcontainer').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });

});


// Function to check time and enable/disable the button
function checkButtonStatus() {

    // Get current time in New Zealand
    const nzTime = new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" });
    const currentHour = new Date(nzTime).getHours();
    const currentMinute = new Date(nzTime).getMinutes();

    // Define time range
    const startHour = 17;
    const startMinute = 0;
    const endHour = 24;
    const endMinute = 0;

    // Calculate if within range
    const isWithinRange =
        (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute));


    const timelimit = document.getElementById("timelimit");

    // Get the button element
    const button = document.getElementById("checkoutButton");

    // Enable or disable button based on time range
    if (!isWithinRange) {
        document.getElementById('timelimit').style.display = 'block';
        button.disabled = true;
    } else {
        document.getElementById('timelimit').style.display = 'none';
        button.disabled = false;
    }

}



// Optionally, set an interval to check every minute
setInterval(checkButtonStatus, 60000);


