// Initialize the cart array and total cart value
let cart = [];
let cartTotal = 0;
let isDelivery = false;
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
const successdelivery = document.getElementById("successdelivery");
const successpickup = document.getElementById("successpickup");
const closeModalSuccesspickup = document.getElementById("closeModalSuccesspickup");
const closeModalSuccessdelivery = document.getElementById("closeModalSuccessdelivery");
const closeModal = document.getElementById("closeModal");
const closeModalcheckout = document.getElementById("closeModalcheckout");
const modalItems = document.getElementById("modal-items");
const modalTotal = document.getElementById("modal-total");
const warningMessage = document.getElementById("warning-message");
const deliveryaddresscheckout = document.getElementById("deliveryaddresscheckout");
// Function to display the cart in the modal
function displayCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDelivery = urlParams.get('isDelivery');

    modalItems.innerHTML = ''; // Clear previous cart items

    cart.forEach((item, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <div class="quantity-control">
                    <button class="decrease-btn" id="decreasebtn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-btn" id="increasebtn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" id="removeitem" onclick="removeItem(${index})">&times;</button>
            </div>
        `;
        modalItems.appendChild(productElement);
    });

    // Update the total in the modal
    document.getElementById('modal-total').textContent = `$${cartTotal.toFixed(2)}`;
    document.getElementById('cart-count').innerText = `$${cartTotal.toFixed(2)}`;

    // Show the modal
    modal.style.display = 'block';
    document.body.style.position = "fixed";
    const isWithinRange = checkButtonStatus();
    if (isWithinRange) {
        if (isDelivery === "true") {
            document.querySelector('#deliveryaddress').style.display = 'flex';
            document.querySelector('#deliveryaddresscheckout').style.display = 'flex';
            document.querySelector('#minimun').style.display = 'block';
            document.querySelector('#maximum').style.display = 'block';
            const validDeliveryAddress = document.querySelector('#delivery-charge');
            if (warningMessage.style.display != 'block') {
                document.querySelector('#checkoutButtonDelivery').disabled = false;
                if(cartTotal < 50){
                    cartTotal = cartTotal + 10;
                    validDeliveryAddress.style.display = 'block';
                }
                else{
                    validDeliveryAddress.style.display = 'none';
                }
            }
            else {
                document.querySelector('#checkoutButtonDelivery').disabled = true;
            }
        } else {
            document.querySelector('#pickupaddress').style.display = 'flex';
            document.querySelector('#pickupaddresscheckout').style.display = 'flex';
            document.querySelector('#checkoutButtonDelivery').disabled = false;
        }
    } else {
        document.querySelector('#checkoutButtonDelivery').disabled = true;
    }
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
}

// Function to remove items from the cart
function removeItem(index) {
    const item = cart[index];
    cartTotal -= item.price * item.quantity; // Adjust total by removing the item's price
    cart.splice(index, 1); // Remove the item from the cart

    displayCart(); // Re-render the cart
}

// Show the cart modal when the cart icon is clicked
document.getElementById('cart-link').onclick = function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    displayCart(); // Display the cart in the modal
};

// Close the modal when the user clicks the close button
closeModal.onclick = function () {
    modal.style.display = 'none';
    document.body.style.position = ""; // Restore scrolling
};

closeModalcheckout.onclick = function () {
    checkoutcontainer.style.display = 'none';
};

closeModalSuccessdelivery.onclick = function () {
    successdelivery.style.display = 'none';
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
    if (event.target == closeModalSuccessdelivery) {
        successdelivery.style.display = 'none';
    }
};
// Close the modal if the user clicks anywhere outside of the modal content
window.onclick = function (event) {
    if (event.target == closeModalSuccesspickup) {
        successpickup.style.display = 'none';
    }
};

document.getElementById("delivery").addEventListener("click", function () {
    isDelivery = true;  // Set the flag to true
    window.location.href = "delivery.html?isDelivery=true";
});

document.getElementById("pickup").addEventListener("click", function () {
    window.location.href = "delivery.html?isDelivery=false";
});


let selectedAddress = ""; // Variable to store the selected address

document.getElementById("address").addEventListener("input", function () {
    let query = this.value;

    // Make an API call only if there are more than 3 characters in the input
    if (query.length > 3) {
        // Bounding box for Auckland areas (approximate values)
        let viewbox = "174.5993,-37.0284,175.4093,-36.5427"; // [left, top, right, bottom]

        // Parse query components to handle street, city, and postal code
        const components = query.split(",").map(part => part.trim());
        const street = components[0] || ''; // First part as street
        const city = components[1] || 'Auckland'; // Second part as city (default to Auckland)
        const postalcode = components[2] || ''; // Third part as postal code

        // Construct the fetch URL with structured query parameters, URL-encoding each component
        const apiUrl = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&postalcode=${encodeURIComponent(postalcode)}&format=json&addressdetails=1&limit=5&countrycodes=nz&viewbox=${viewbox}&bounded=1`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                let suggestionsContainer = document.getElementById("suggestions");
                suggestionsContainer.innerHTML = ""; // Clear previous suggestions
                suggestionsContainer.style.display = "block"; // Show suggestions

                // Check if there is data in the response
                if (data.length === 0) {
                    suggestionsContainer.innerHTML = "<div>No results found</div>";
                    return;
                }

                // Generate suggestions from response
                data.forEach((item) => {
                    let suggestionItem = document.createElement("div");
                    suggestionItem.classList.add("suggestion-item");

                    // Safely access each address component with fallback for undefined values
                    const road = item.address.road || '';
                    const suburb = item.address.suburb || item.address.city || '';
                    const postcode = item.address.postcode || '';

                    // If the user typed a specific house number (like "571"), include it manually
                    const typedHouseNumber = street.match(/^\d+/) ? street.split(" ")[0] : '';
                    const customDisplayName = `${typedHouseNumber} ${road}, ${suburb}, Auckland, ${postcode}`.trim();

                    suggestionItem.innerText = customDisplayName;

                    // Event listener for each suggestion item (to select the address)
                    suggestionItem.addEventListener("click", () => {
                        document.getElementById("address").value = customDisplayName;
                        suggestionsContainer.innerHTML = ""; // Clear suggestions after selection
                        suggestionsContainer.style.display = "none"; // Hide suggestions

                        // Store the selected address
                        selectedAddress = customDisplayName;

                        // Extract latitude and longitude from the selected place
                        const latitude = parseFloat(item.lat);
                        const longitude = parseFloat(item.lon);

                        const iswithinViewport = isWithinViewport(latitude, longitude);
                        // Check if the selected address is within the viewport
                        if (!iswithinViewport) {
                            showWarningMessage();
                        } else {
                            hideWarningMessage();
                        }
                    });

                    // Append the new suggestion item to the container
                    suggestionsContainer.appendChild(suggestionItem);
                });
            })
            .catch(error => {
                console.error("Error fetching address data: ", error);
                document.getElementById("suggestions").innerHTML = "<div>Error fetching data. Please try again.</div>";
            });
    } else {
        document.getElementById("suggestions").style.display = "none"; // Hide if input is cleared
    }
});



// Function to show the warning message
function showWarningMessage() {
    warningMessage.style.display = "block";
}

// Function to hide the warning message
function hideWarningMessage() {
    warningMessage.style.display = "none";
    const validDeliveryAddress = document.querySelector('#delivery-charge');
    if (cartTotal < 50) {
        cartTotal = cartTotal + 10;
        validDeliveryAddress.style.display = 'block';
    } else {
        validDeliveryAddress.style.disabled = 'none';
    }
}


// Function to check if a point is within the viewport boundaries
function isWithinViewport(latitude, longitude) {
    // Bounding box boundaries (define left, right, top, and bottom boundaries)
    const minLon = 174.6753; // Left (West)
    const maxLon = 174.7753; // Right (East)
    const minLat = -36.9573; // Top (North)
    const maxLat = -36.8573; // Bottom (South)

    // Check if the latitude and longitude are within the bounds
    return (
        longitude >= minLon && longitude <= maxLon &&
        latitude >= minLat && latitude <= maxLat
    );
}

// Hide suggestions if user clicks outside of the input or suggestion div
document.addEventListener("click", function (event) {
    let suggestionsContainer = document.getElementById("suggestions");
    if (!document.getElementById("address").contains(event.target) && !suggestionsContainer.contains(event.target)) {
        suggestionsContainer.style.display = "none";
    }
});

// Function to adjust the suggestions' position if it goes outside the viewport
function adjustSuggestionsPosition() {
    const inputElement = document.getElementById("address");
    const suggestionsContainer = document.getElementById("suggestions");
    const rect = inputElement.getBoundingClientRect();

    // Check the space available below the input field
    const spaceBelow = window.innerHeight - rect.bottom;
    const suggestionsHeight = suggestionsContainer.offsetHeight;

    // Adjust position if there is not enough space below the input field
    if (spaceBelow < suggestionsHeight) {
        suggestionsContainer.style.top = 'auto';
        suggestionsContainer.style.bottom = '100%'; // Position above the input field
    } else {
        suggestionsContainer.style.top = '100%'; // Position below the input field
        suggestionsContainer.style.bottom = 'auto';
    }
}


// Checkout button click event
document.getElementById("checkoutButtonDelivery").addEventListener("click", function () {
    displaychekoutcart();
    let suggestionsContainer = document.getElementById("suggestionscheckout");
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions

    // Only append the selected address if one is selected
    if (selectedAddress) {
        let selectedAddressItem = document.createElement("div");
        selectedAddressItem.classList.add("selected-address-item");
        selectedAddressItem.innerText = selectedAddress;

        suggestionsContainer.appendChild(selectedAddressItem);
    }

    // Show the modal and checkout container
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
                <span class="cart-item-name">${item.name}</span>
                <div class="quantity-control">
                    <button class="decrease-btn" id="decreasebtn" onclick="changeQuantitycheckout(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-btn" id="increasebtn" onclick="changeQuantitycheckout(${index}, 1)">+</button>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" id="removeitem" onclick="removeItemchekcout(${index})">&times;</button>
            </div>
        `;
        modalItems.appendChild(productElement);
    });
    document.getElementById('checkout-Delivery').textContent = '$10.00';
    // Update the total in the modal
    document.getElementById('checkout-total').textContent = `$${cartTotal.toFixed(2)}`;
    
    document.getElementById('cart-count').innerText = `$${cartTotal.toFixed(2)}`;
   
    if (isDelivery === "true") {
        if (cartTotal < 50) {
            document.getElementById('freedeliverymessage').style.display = 'block';
        }
        else {
            document.getElementById('freedeliverymessage').style.display = 'none';
        }
    }
    else {
        document.querySelector('#placeOrderButton').disabled = false;
    }

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

    const deliveryaddress = document.getElementById('suggestionscheckout').innerText;
    formData.append('deliveryaddress', deliveryaddress);

    const pickupaddress = document.getElementById('savepickupaddress').innerHTML;
    formData.append('pickupaddress', pickupaddress);

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

    if (deliveryaddress != "") {
        isDelivery = true;
    }
    formData.append('isDelivery', isDelivery);

    // Check if the 'time' field is empty
    if (formData.get(checkouttotal) === "") {
        alert('Please select order items.');
        return; // Stop form submission if the time field is empty
    }

    fetch('https://script.google.com/macros/s/AKfycbzK-lza1EAU0ow3XJ8Lkg8b4OPsSyyBQJoEAFLFLxV4NJyvTAfso02W5WZx2fXJiIxpfw/exec', {
        method: 'POST',
        mode: 'no-cors',  // This disables CORS checks
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            if (isDelivery === true) {
                document.getElementById('successdelivery').style.display = 'block';
            } else {
                document.getElementById('successpickup').style.display = 'block';
            }
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
    const button = document.getElementById("checkoutButtonDelivery");

    //Enable or disable button based on time range
    if (!isWithinRange) {
        document.getElementById('timelimit').style.display = 'block';
        button.disabled = true;
    } else {
        document.getElementById('timelimit').style.display = 'none';
        button.disabled = false;
    }
    return isWithinRange;
}



// Optionally, set an interval to check every minute
setInterval(checkButtonStatus, 60000);
