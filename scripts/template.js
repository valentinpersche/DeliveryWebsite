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

function getItemTemplate(item, category, index) {
    return `
        <div class="menu-item">
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <span class="item-price">${item.price.toFixed(2)} €</span>
            </div>
            <button class="add-to-basket" onclick="addToBasket('${category}', ${index})">+</button>
        </div>
    `;
}
