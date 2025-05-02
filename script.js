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
    loadDeliveryAddress();
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

function loadDeliveryAddress() {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
        const addressInputs = document.querySelectorAll('#deliveryAddress');
        addressInputs.forEach(input => {
            input.value = savedAddress;
        });
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

function updateDeliveryOptionState(option, isActive) {
    if (option) {
        if (isActive) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    }
}

function updateDeliveryOptions() {
    const desktopDeliveryOption = document.querySelector('#desktopDeliveryOptions .option.delivery');
    const desktopCollectionOption = document.querySelector('#desktopDeliveryOptions .option.collection');
    const dialogDeliveryOption = document.querySelector('#mobileDeliveryOptions .option.delivery');
    const dialogCollectionOption = document.querySelector('#mobileDeliveryOptions .option.collection');
    
    [desktopDeliveryOption, dialogDeliveryOption].forEach(option => {
        updateDeliveryOptionState(option, isDelivery);
    });

    [desktopCollectionOption, dialogCollectionOption].forEach(option => {
        updateDeliveryOptionState(option, !isDelivery);
    });
}

function selectDeliveryOption(option) {
    isDelivery = option === 'delivery';
    updateDeliveryOptions();
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
    const basketHTML = generateBasketHTML(basket, isDelivery, DELIVERY_COST);
    
    if (basketContent) basketContent.innerHTML = basketHTML;
    if (mobileBasketContent) mobileBasketContent.innerHTML = basketHTML;
    
    updateMobileBasketButton();
}

function calculateTotals() {
    const subtotal = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = isDelivery?  DELIVERY_COST : 0;
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

function removeItemFromBasket(category, itemIndex) {
    const itemToRemove = basket.findIndex(item => 
        item.category === category && item.itemIndex === itemIndex
    );
    
    if (itemToRemove !== -1) {
        basket.splice(itemToRemove, 1);
        updateBasket();
        saveToLocalStorage();
    }
}

function placeOrder() {
    const message = isDelivery 
        ? 'Wir haben Ihre Bestellung erhalten, die Lieferung ist in Kürze auf dem Weg'
        : 'Wir haben Ihre Bestellung erhalten, Sie können sie in 20 Minuten vor Ort abholen';

    basket = [];
    saveToLocalStorage();
    
    updateBasket();
    
    const desktopMessage = document.querySelector('#basketContent #orderMessage');
    const mobileMessage = document.querySelector('#mobileBasketContent #orderMessage');
    
    if (desktopMessage) {
        desktopMessage.textContent = message;
        desktopMessage.style.display = 'block';
    }
    
    if (mobileMessage) {
        mobileMessage.textContent = message;
        mobileMessage.style.display = 'block';
    }
}

function saveDeliveryAddress() {
    const addressInputs = document.querySelectorAll('#deliveryAddress');
    let addressSaved = false;

    addressInputs.forEach(input => {
        if (input && input.value.trim() !== '') {
            localStorage.setItem('deliveryAddress', input.value.trim());
            addressSaved = true;
        }
    });

    if (addressSaved) {
        const messageElements = document.querySelectorAll('#orderMessage');
        messageElements.forEach(element => {
            element.textContent = 'Adresse wurde gespeichert';
            element.style.display = 'block';
        });
    }
}
