const cartLogo = document.querySelector('.fa-shopping-cart');
const heroBtn = document.querySelector('.heroBtn');
const closeCart = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-content')
const cartItems = document.querySelector('.cart-item')
const ProductsDom = document.querySelector('.product-center')
const cartTotal = document.querySelector('.Incart-total')

let cart = []
let buttonDom = []

// classes
class Products {
    async getProducts(){
        try {
            const responce = await fetch('products.json')
            const data = await responce.json()
            let products = data.items
            const items = products.map(items =>{
                const {id} = items.pc
                const {title} = items.fields
                const {price} = items.fields
                const image = items.fields.image.fields.file.url
                return {id, title, price, image}
            })
            return items
            
        } catch (error) {
            console.log(error)
        }
    }
    
}

class Ui {
    displayProducts(item){
        let result = ''
        item.forEach(item =>{
            result += `
            <article class="Product">
                <div class="img-container">
                    <img src="${item.image}" alt="" class="itemimg">
                    <button class="additem" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${item.title}</h3>
                <h4>$${item.price}</h4>
            </article>
            `
        })
        ProductsDom.innerHTML=result
    }
    getButtonData(){
        const itemBtn = [...document.querySelectorAll('.additem')]
        buttonDom = itemBtn
        itemBtn.forEach(button =>{
            const id = button.dataset.id
            const inCart = cart.find(item => item.id === id)
            if(inCart){
                button.innerText = 'In Cart'
                button.disabled = true
            }
            button.addEventListener('click', ()=>{
                button.innerText= 'In Cart'
                button.disabled = true
                const item = Storage.getProductId(id)
                cart = [...cart, item]
                Storage.saveCart(cart)
                this.addToCart(item)
                this.setCartValue(cart)
            })
        })
    }
    addToCart(cart){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
        <img src='${cart.image}' alt="">
        <div class="cart-info">
        <h4>${cart.title}</h4>
        <h5>$${cart.price}</h5>
        <span class="remove" data-id=${cart.id}>remove</span>
        </div>
        `
        cartContent.appendChild(div)
    }
    setCartValue(cart){
        let tempTotal = 0
        cart.map(item => {
            tempTotal += item.price
        })
        cartTotal.innerText = tempTotal   
    }
    appStart(){
        cart = Storage.getCartItem()
        this.setCartValue(cart)
        this.fillCart(cart)
    }
    fillCart(cart){
        cart.forEach(item=>{
            this.addToCart(item)
        })
    }
    cartLogic(){
        clearCart.addEventListener('click', ()=>{
            this.clearCart()
        })
        cartContent.addEventListener('click', (e)=>{
            if(e.target.classList.contains('remove')){
                let remove = e.target
                let id = remove.dataset.id
                this.removeItem(id)
                cartContent.removeChild(remove.parentElement.parentElement)
            }
        })
    }
    clearCart(){
        let cartItem = cart.map(item => item.id)
        cartItem.forEach(id => this.removeItem(id))
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        }
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        this.setCartValue(cart)
        Storage.saveCart(cart)
        const button = this.singleBtn(id)
        button.disabled = false
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to cart`

    }
    singleBtn(id){
        return buttonDom.find(button => button.dataset.id === id)
    }
}

class Storage{
    static saveProducts(item){
        localStorage.setItem('item', JSON.stringify(item))
    }
    static getProductId(id){
        const product = JSON.parse(localStorage.getItem('item'))
        return product.find(item => item.id === id)
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    } 
    static getCartItem(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')): []
    }
    
}  

document.addEventListener('DOMContentLoaded', ()=>{
    const products = new Products();
    const ui = new Ui();
    ui.appStart()
    products.getProducts().then(item =>{
        ui.displayProducts(item)
        Storage.saveProducts(item)
    }).then(()=>{
        ui.getButtonData()
        ui.cartLogic()
    })
        
    
})







// Basic EventListener

cartLogo.addEventListener('click', () =>{cartDom.classList.add('show-cart')} );
closeCart.addEventListener('click', ()=>{cartDom.classList.remove('show-cart')});
heroBtn.addEventListener('click', (e)=>{
    const section = document.querySelector('.Products')
    const sLocation = section.getBoundingClientRect()
    window.scrollTo({left:sLocation.left, top:sLocation.top + pageYOffset, behavior: "smooth"})
});
