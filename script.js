function renderMenuSections() {
  const menuSection = document.getElementById("menuSection");
  menuSection.innerHTML = myDishes
    .map((section) => getSectionTemplate(section))
    .join("");
}
