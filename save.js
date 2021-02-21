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
                button.disabled = true               
            }
            button.addEventListener('click', (e)=>{
                e.target.innerText= 'In Cart'
                e.target.disabled = true
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
            <span class="remove" data-id=${item.id}>remove</span>
        </div>
        
        `
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
        cartDom.addEventListener('click', (e)=>{
            if(e.target.classList.contains('remove')){
               let remove = e.target
               let id = remove.dataset.id
               this.removeItems(id)
               cartContent.removeChild(remove.parentElement.parentElement) 

            } 
        })
    }
    clearCart(){
        let cartItem = cart.map(item =>item.id)
        cartItem.forEach(id=> this.removeItems(id))
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
    }
    removeItems(id){
        cart = cart.filter(item => item.id !== id)
        Storage.saveCartItems(cart)
        this.setCartValues(cart)
        let button = this.getSingleButton(id)
        button.disabled = false
        button.innerHTML= `<i class="fas fa-shopping-cart"></i>
        add to cart`
        
    }
    getSingleButton(id){
        return buttonDom.find(item => item.dataset.id === id)
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
        ui.cartLogic()
    })
    
})