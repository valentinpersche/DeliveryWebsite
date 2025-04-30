let isDelivery = true;
const DELIVERY_COST = 4.99;

function init() {
    const menuSection = document.getElementById("menuSection");
    menuSection.innerHTML = myDishes
        .map((section) => getSectionTemplate(section))
        .join("");
    loadFromLocalStorage();
    updateMobileBasketButton();
}

function saveToLocalStorage() {
    localStorage.setItem('basket', JSON.stringify(basket));
    localStorage.setItem('isDelivery', JSON.stringify(isDelivery));
}

function loadFromLocalStorage() {
    loadBasketFromStorage();
    loadDeliveryOptionFromStorage();
    updateBasket();
}

function loadBasketFromStorage() {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
        basket = JSON.parse(savedBasket);
    }
}

function loadDeliveryOptionFromStorage() {
    const savedDelivery = localStorage.getItem('isDelivery');
    if (savedDelivery !== null) {
        isDelivery = JSON.parse(savedDelivery);
        updateDeliveryOptionUI();
    }
}

function updateDeliveryOptionUI() {
    const deliveryOption = document.querySelector('.option.delivery');
    const collectionOption = document.querySelector('.option.collection');
    
    if (isDelivery) {
        deliveryOption.classList.add('active');
        collectionOption.classList.remove('active');
    } else {
        deliveryOption.classList.remove('active');
        collectionOption.classList.add('active');
    }
}

function selectDeliveryOption(option) {
    isDelivery = option === 'delivery';
    
    // Update Desktop Warenkorb
    const desktopDeliveryOption = document.querySelector('#desktopDeliveryOptions .option.delivery');
    const desktopCollectionOption = document.querySelector('#desktopDeliveryOptions .option.collection');
    
    // Update Dialog Warenkorb
    const dialogDeliveryOption = document.querySelector('#mobileDeliveryOptions .option.delivery');
    const dialogCollectionOption = document.querySelector('#mobileDeliveryOptions .option.collection');
    
    // Update both desktop and mobile options
    [desktopDeliveryOption, dialogDeliveryOption].forEach(option => {
        if (option) {
            if (isDelivery) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        }
    });

    [desktopCollectionOption, dialogCollectionOption].forEach(option => {
        if (option) {
            if (isDelivery) {
                option.classList.remove('active');
            } else {
                option.classList.add('active');
            }
        }
    });
    
    updateBasket();
    saveToLocalStorage();
}

function addToBasket(category, itemIndex) {
    const section = myDishes.find(section => section.category === category);
    const item = section.items[itemIndex];
    updateBasketItem(category, itemIndex, item);
    updateBasket();
    saveToLocalStorage();
}

function updateBasketItem(category, itemIndex, item) {
    const existingItem = basket.find(basketItem => 
        basketItem.category === category && basketItem.itemIndex === itemIndex
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        basket.push({ category, itemIndex, name: item.name, price: item.price, quantity: 1 });
    }
}

function removeFromBasket(category, itemIndex) {
    const itemToRemove = basket.findIndex(item => 
        item.category === category && item.itemIndex === itemIndex
    );
    
    if (itemToRemove !== -1) {
        updateItemQuantity(itemToRemove);
    }
    
    updateBasket();
    saveToLocalStorage();
}

function updateItemQuantity(index) {
    if (basket[index].quantity > 1) {
        basket[index].quantity--;
    } else {
        basket.splice(index, 1);
    }
}

function updateBasket() {
    const basketContent = document.getElementById('basketContent');
    const mobileBasketContent = document.getElementById('mobileBasketContent');
    const basketHTML = generateBasketHTML();
    
    if (basketContent) basketContent.innerHTML = basketHTML;
    if (mobileBasketContent) mobileBasketContent.innerHTML = basketHTML;
    
    updateMobileBasketButton();
}

function generateBasketHTML() {
    if (basket.length === 0) {
        return generateEmptyBasketHTML();
    }

    const { subtotal, delivery, total } = calculateTotals();
    
    return `
        <div class="basket-items">
            ${basket.map(item => generateBasketItemHTML(item)).join('')}
        </div>
        <div class="basket-summary">
            <div class="summary-row">
                <span>Zwischensumme:</span>
                <span>${subtotal.toFixed(2)} €</span>
            </div>
            ${generateDeliveryCostHTML(delivery)}
            <div class="summary-row total">
                <span>Gesamt:</span>
                <span>${total.toFixed(2)} €</span>
            </div>
        </div>
    `;
}

function generateEmptyBasketHTML() {
    return `
        <div class="empty-basket">
            <div class="empty-basket-icon">🛒</div>
            <h3>Der Warenkorb ist leer</h3>
            <p>Füllen Sie den Warenkorb</p>
        </div>
    `;
}

function generateBasketItemHTML(item) {
    return `
        <div class="basket-item">
            <div class="basket-item-info">
                <span class="basket-item-name">${item.name}</span>
                <span class="basket-item-price">${(item.price * item.quantity).toFixed(2)} €</span>
            </div>
            <div class="basket-item-controls">
                <button onclick="removeFromBasket('${item.category}', ${item.itemIndex})">-</button>
                <span>${item.quantity}</span>
                <button onclick="addToBasket('${item.category}', ${item.itemIndex})">+</button>
            </div>
        </div>
    `;
}

function generateDeliveryCostHTML(delivery) {
    return isDelivery ? `
        <div class="summary-row">
            <span>Lieferkosten:</span>
            <span>${DELIVERY_COST.toFixed(2)} €</span>
        </div>
    ` : '';
}

function calculateTotals() {
    const subtotal = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = isDelivery ? DELIVERY_COST : 0;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
}

function updateMobileBasketButton() {
    const button = document.querySelector('.mobile-basket-button');
    const { total } = calculateTotals();
    if (basket.length > 0) {
        button.querySelector('.total-amount').textContent = `${total.toFixed(2)} €`;
    } else {
        button.querySelector('.total-amount').textContent = '';
    }
}

function openMobileBasket() {
    document.querySelector('.mobile-basket-dialog').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateBasket();
}

function closeMobileBasket() {
    document.querySelector('.mobile-basket-dialog').classList.remove('active');
    document.body.style.overflow = '';
}
