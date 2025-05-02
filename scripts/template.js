function getSectionTemplate(section) {
    return `
        <section class="${section.category}" id="${section.category}">
            <img class="section-picture" src="${section.image}" alt="Picture of ${section.category}">
            ${section.items
                .map(
                    (dish, index) => `
                <div class="dish-card">
                    <div class="dish-card-button-container">
                        <button class="dish-card-button" onclick="addToBasket('${section.category}', ${index})">+</button>
                    </div>
                    <h2 class="dish-card-title">${dish.name}</h2>
                    <h3 class="dish-card-description">${dish.description}</h3>
                    <h3 class="dish-card-price">${dish.price.toFixed(2)}€</h3>
                </div>
            `
                )
                .join("")}
        </section>
    `;
}

function generateBasketHTML(basket, isDelivery, deliveryCost) {
    if (basket.length === 0) {
        return generateEmptyBasketHTML();
    }

    const items = basket.map(item => `
        <div class="basket-item">
            <div class="basket-item-info">
                <span class="basket-item-name">${item.name}</span>
                <span class="basket-item-price">${item.price.toFixed(2)} €</span>
            </div>
            <div class="basket-item-controls">
                <button class="delete-button" onclick="removeItemFromBasket('${item.category}', ${item.itemIndex})">🗑️</button>
                <button onclick="removeFromBasket('${item.category}', ${item.itemIndex})">-</button>
                <span>${item.quantity}</span>
                <button onclick="addToBasket('${item.category}', ${item.itemIndex})">+</button>
            </div>
        </div>
    `).join('');

    const { subtotal, delivery, total } = calculateTotals(basket, isDelivery, deliveryCost);

    return `
        ${items}
        <div class="basket-totals">
            <div class="basket-subtotal">
                <span>Zwischensumme:</span>
                <span>${subtotal.toFixed(2)} €</span>
            </div>
            ${isDelivery ? `
                <div class="basket-delivery">
                    <span>Lieferung:</span>
                    <span>${delivery.toFixed(2)} €</span>
                </div>
            ` : ''}
            <div class="basket-total">
                <span>Gesamt:</span>
                <span>${total.toFixed(2)} €</span>
            </div>
        </div>
        <div id="orderMessage" class="order-message"></div>
        ${isDelivery ? `
            <div class="address-input">
                <input type="text" id="deliveryAddress" placeholder="Lieferadresse eingeben" class="address-field">
                <button onclick="saveDeliveryAddress()" class="save-address-button">Adresse speichern</button>
            </div>
        ` : ''}
        <button class="order-button" onclick="placeOrder()">Jetzt bestellen</button>
    `;
}

function generateEmptyBasketHTML() {
    return `
        <div class="empty-basket">
            <div class="empty-basket-icon">🛒</div>
            <h3>Der Warenkorb ist leer</h3>
            <p>Füllen Sie den Warenkorb</p>
        </div>
        <div id="orderMessage" class="order-message"></div>
    `;
}
