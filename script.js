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
        try{
            const results = await fetch('products.json')
            const data = await results.json()
            const products = data.items
            const items = products.map(item =>{
                const {id} = item.pc;
                const {title, price} = item.fields;
                const image = item.fields.image.fields.file.url
                return {id, title, price, image}
            })
            return items
        }catch (err){
            console.log(err)
        }
    }
    
}

class Ui {
    displayProducts(items){
        let results = ''
        items.forEach(items =>{
            results +=`
            <article class="Product">
            <div class="img-container">
                <img src="${items.image}" alt="" class="itemimg">
                <button class="additem" data-id=${items.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>
            <h3>${items.title}</h3>
            <h4>$${items.price}</h4>
            </article>
            `
            return results
        })
        ProductsDom.innerHTML = results
    }
    getButtonData(item){
        const addCartBtn = [...document.querySelectorAll('.additem')];
        buttonDom = addCartBtn
        addCartBtn.forEach(button =>{
            const id = button.dataset.id
            const inCart = cart.find(item => item.id === id)
            if (inCart){
                button.innerText = 'In Cart'
                button.disable = true               
            }
            button.addEventListener('click', (e)=>{
                e.target.innerText= 'In Cart'
                e.target.disable = true
                const cartItem = Storage.getProducts(id)
                cart = [...cart, cartItem]
                Storage.saveCartItems(cart)
                this.setCartValues(cart)
                this.addCartItem(cartItem)
                
            })
        }) 
    }
    setCartValues(cart){
        let totalItem = 0
        cart.map(item =>{
            totalItem += item.price
        })
        cartTotal.innerText = parseFloat(totalItem.toFixed(2))
    }
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML= `
        <img src='${item.image}' alt="">
        <div class="cart-info">
            <h4>${item.title}</h4>
            <h5>${item.price}</h5>
            <span class="remove">remove</span>
        </div>
        <div class="cart-index">
            <i class="fas fa-chevron-up"></i>
            <p class="item-amount">1</p>
            <i class="fas fa-chevron-down"></i>
        </div>`
        cartContent.appendChild(div)
        
    }
    setupAPP(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
    }
    populateCart(cart){
        cart.forEach(item=> this.addCartItem(item))
    }
    cartLogic(){
        clearCart.addEventListener('click', ()=>{
            this.clearCart()
        })
    }
    clearCart(){
        let cartItem = cart.map(item =>item.id)
        cartItem.forEach(id=> this.removeItems(id))
    }
    removeItems(id){
        
    }
}

class Storage{
    static saveProducts(items){
        localStorage.setItem('items', JSON.stringify(items))
    }
    static getProducts(id){
        const products = JSON.parse(localStorage.getItem('items'))
        return products.find(product => product.id === id)
    }
    static saveCartItems(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')) : []
    }
    
}  

document.addEventListener('DOMContentLoaded', ()=>{
    const products = new Products();
    const ui = new Ui();
    ui.setupAPP();
    products.getProducts().then(items=> {
        ui.displayProducts(items) 
        Storage.saveProducts(items)
    }).then(()=>{
        ui.getButtonData()
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
