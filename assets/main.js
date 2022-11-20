//Cart and product containers
const productsContainer = document.querySelector(".productsContainer")
const cartContainer = document.querySelector(".cartContainer")
// Categories handlers
const categories = document.querySelector('.categoryContainer');
const categoryList = document.querySelectorAll('.categoryCard');
// Pagination handlers
const pagButton = document.querySelector(".pageScrollContainer");
const pagButtonList = document.querySelectorAll(".pagButton")
//Cart handlers
const cartButton = document.querySelector(".cartButton")
const closeCartButton = document.querySelector(".closeCartBtn")
const visibleCart = document.querySelector(".cart")
const overlay = document.querySelector(".overlay")
const buyBtn = document.querySelector(".buy-btn")
const deleteBtn = document.querySelector(".delete-btn")
const confirmBtn = document.querySelector(".accountBtnContainer")
const cartTotal = document.querySelector(".cartTotalAmount")
//Menu Handlers
const menuButton = document.querySelector(".barsMenuButton")
const visibleMenu = document.querySelector(".barsMenu")
const closeMenuButton = document.querySelector(".closeMenuBtn")
const contactLink = document.querySelector(".contactLink")
//Modal Handlers
const modalMsg = document.querySelector(".modal")

const body = document.getElementsByTagName("body")


let selectedCategory = ""


let cart = JSON.parse(localStorage.getItem("Cart")) || []

const saveToLS = (fullCart) => {
    localStorage.setItem('Cart', JSON.stringify(fullCart));
  };

const pushToArray = (item, itemsArray) => {
    itemsArray.push(item);
};

const filterCategory = (selectedCategory) => {
  
    products.filter((product) => {
      return product.category === selectedCategory;
    });
  
    renderProducts(selectedCategory);

};

//Render products when filtered by category
const renderProduct = (product) => {
    const { id, name, category, image, description, price } = product;
  
    return `
    <div class="productCard">
        <img
        src="${image}"
        alt="${name} photo"
        />
        <div class="menuDataContainer">
            <div class="datosProd">
                <h4 class="nameFood">${name}</h4>
                <h4 class="priceFood">$ ${price}</h4>
            </div>
            <p>
                ${description}
            </p>
            <button class="button add-btn" data-id="${id}" data-name="${name}" data-image="${image}" data-price="${price}">Add to Cart</button>
        </div>
    </div>
  `;
};

const renderProducts = (category) => {
    let chunkArray = divideArray(products, 5, category);
    paginateArray(chunkArray);
}

const openCart = () => {

    if (visibleCart.classList.contains("hidden")) {
        visibleCart.classList.remove("hidden")
        overlay.classList.remove("hidden")
    } else {
        visibleCart.classList.add("hidden")
        overlay.classList.add("hidden")
    }

}

const renderCartProduct = (product) => {
    const { id, name, image, price, quantity } = product;

    return `
    <div class="cartProduct">
        <img
        src="${image}"
        alt="${name} photo" />

        <div class="cartProductContainer">
            <p>${name}</p>
            <p>Price: $ ${price}</p>
        </div>

        <div class="cartQuantity" data-id="${id}">
            <button class="qButtons minusOne">-</button>
            <p>${quantity}</p>
            <button class="qButtons plusOne">+</button>
        </div>
    </div>
    `
} 

const renderCartProducts = () => {
    return cartContainer.innerHTML = cart.map(renderCartProduct).join("")
}

const productAdded = (product) => {
    return cart.find((item) => item.id === product.id)
}

const addNewProduct = (product) => {
    cart = [...cart, {...product, quantity: 1}]
}

const handleQuantity = (e) => {

    let idSelected = e.target.parentNode.dataset.id
    
    let productHandled = cart.find( (item) => {
        return item.id === idSelected
    })

    if (e.target.classList.contains("plusOne")) {
        addUnit(productHandled)
    } else if (e.target.classList.contains("minusOne")) {
        deleteUnit(productHandled)
    }
}

const addUnit = (product) => {
    cart = cart.map((cartProduct) => {
        return cartProduct.id === product.id
          ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
          : cartProduct;
    });
    refreshData()

}

const deleteUnit = (product) => {

    if (product.quantity === 1) {

        if (confirmWindow(`"Are you sure you want to delete ${product.name} from the cart?`)) {
            cart = cart.filter((cartProduct) => cartProduct.id !== product.id)
            refreshData()
        }

    } else {
        cart = cart.map((cartProduct) => {
            return cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
            : cartProduct;
        });
        refreshData()
    }

    refreshData()
}

const confirmWindow = (msg) => {
    return window.confirm(msg)
}

const addProduct = (e) => {

    if (!e.target.classList.contains('add-btn')) return;
    const { id, name, price, image} = e.target.dataset;
  
    const product = {id, name, price, image};

    if (productAdded(product)) {
        addUnit(product);
        showModal(product);
    } else {
        addNewProduct(product);
        showModal(product);
    }

    refreshData()
};

const showModal = (product) => {

    modalMsg.classList.remove("hidden");
    modalMsg.innerHTML = `
        A unit of "${product.name}" has been succesfully added to the Cart.
    `

    setTimeout( () => {
        modalMsg.classList.add("hidden")
    }, 2000)
}

const buyCart = () => {

    if (cart.length === 0) {
        return window.alert("Can't complete the purchase if you haven't selected anything")
    }
    if (confirmWindow("Do you want to confirm your purchase?")) {
        cart = []
        saveToLS(cart)
        refreshData()
    }
}

const emptyCart = () => {
    if (confirmWindow("Are you sure you want to empty the cart?")) {
        cart = []
        saveToLS(cart)
        refreshData()
    }
}

const closeCart = () => {
    visibleCart.classList.add("hidden")
    overlay.classList.add("hidden")
}

const refreshData = () => {
    saveToLS(cart)
    renderCartProducts()
    calculateTotal()
}

const openMenu = () => {
    if (visibleMenu.classList.contains("hidden")) {
        visibleMenu.classList.remove("hidden")
        overlay.classList.remove("hidden")
    } else {
        visibleMenu.classList.add("hidden")
        overlay.classList.add("hidden")
    }
}

const closeMenu = () => {
    visibleMenu.classList.add("hidden")
    overlay.classList.add("hidden")
}

const closeMenuResize = () => {
    if (window.innerWidth > 700) {
        visibleMenu.classList.add("hidden")
        overlay.classList.add("hidden")
    } 
}

const init = () => {

    if (body[0].classList.contains("bodyShop")) {
        renderProducts("all")
        determineCategory()
        categories.addEventListener("click", determineCategory)
        pagButton.addEventListener("click", determinePage)
        productsContainer.addEventListener("click", addProduct)
        confirmBtn.addEventListener("click", openCart)
    }
    
    buyBtn.addEventListener("click", buyCart)
    deleteBtn.addEventListener("click", emptyCart)
    overlay.addEventListener("click", closeOverlay)
    cartButton.addEventListener("click", openCart)
    closeCartButton.addEventListener("click", closeCart)
    cartContainer.addEventListener("click", handleQuantity)
    menuButton.addEventListener("click", openMenu)
    closeMenuButton.addEventListener("click", closeMenu)
    contactLink.addEventListener("click", closeMenu)
    window.addEventListener("resize", closeMenuResize)

    refreshData()
}

init()