//Splits the products array (or any array) in a certain length
const divideArray = (arr, size, category) => {
    let chunk = [];
    let arrayFiltered = []

    if (category === "all") {
        for (let i = 0; i < arr.length; i+= size ) {
            chunk.push(arr.slice(i, i + size))
        }
    } else {
        arrayFiltered = arr.filter( (e) => {
            return e.category.toUpperCase() === category.toUpperCase()
        })

        for (let i = 0; i < arrayFiltered.length; i+= size ) {
            chunk.push(arrayFiltered.slice(i, i + size))
        }
    }

    return chunk
}

//Establishes the quantity of pages I'll have
const paginateArray = (arr) => {

    let qPages = arr.length

    pagButtonList.forEach ( (pag) => {
        if (pag.dataset.page > qPages) {
            pag.classList.add("hidden")
        } else {
            pag.classList.remove("hidden")
        }

        if (pag.dataset.page === "1") {
            pag.classList.add("pageActiveButton")
        } else {
            pag.classList.remove("pageActiveButton")
        }
    });

    productsContainer.innerHTML = arr[0].map(renderProduct).join("")
}

const determineCategory = (e) => {

    if (!e) {
        return selectedCategory = "all"
    } 

    if (!e.target.classList.contains('categoryCard')) {
        return;
      }
    
    selectedCategory = e.target.dataset.category

    filterCategory(selectedCategory)
    setActive(e.target.dataset.category);

    return selectedCategory
}

const determinePage = (e) => {

    if (!e.target.dataset.page) {
        return;
    }

    let counter = 0
    selectedPage = e.target.dataset.page

    seletedCategory = categoryList.forEach( (e) => {
        
        if (e.classList.contains("catActive")) {
            return categoryList[counter].dataset.category
        } else {
            counter = counter + 1
        }
    });

    arr = divideArray(products, 5, selectedCategory)
       
    pagButtonList.forEach( (pag) => {
        if (pag.dataset.page === selectedPage) {
            pag.classList.add("pageActiveButton")
        } else {
            pag.classList.remove("pageActiveButton")
    }});

    productsContainer.innerHTML = arr[selectedPage-1].map(renderProduct).join("")

    return selectedPage
}

//Estila la card para que se muestre como el filtro activo
const setActive = (activeCategory) => {
    const categories = [...categoryList];

    categories.forEach((cat) => {
        if (cat.dataset.category !== activeCategory) {
            cat.classList.remove("catActive");
            return;
        }
        cat.classList.add("catActive")
    })

}

const closeOverlay = () => {
    visibleCart.classList.add('hidden');
    overlay.classList.add('hidden');
};

const calculateTotal = () => {
    let total = 0

    cart.map( (i) => {
        total = total + i.price * i.quantity
    })

    return cartTotal.innerHTML = "$ " + total
}

const calculateSubTotal = (product) => {
    let total = 0
    total = product.price * product.quantity

    return total
}



