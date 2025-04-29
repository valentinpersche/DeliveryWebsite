function getSectionTemplate(section) {
    return `
        <section class="${section.category}" id="${section.category}">
            <img class="sectionPicture" src="${section.image}" alt="Picture of ${section.category}">
            ${section.items.map(dish => `
                <div class="dishCard">
                    <div class="dishCardButtonContainer">
                        <button class="dishCardButton">+</button>
                    </div>
                    <h2 class="dishCardTitle">${dish.name}</h2>
                    <h3 class="dishCardDescription">${dish.description}</h3>
                    <h3 class="dishCardPrice">${dish.price.toFixed(2)}€</h3>
                </div>
            `).join('')}
        </section>
    `;
}
