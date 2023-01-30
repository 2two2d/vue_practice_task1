Vue.component('product', {
    template: `
       <div class="product">
    
            <div class="product-image">
                <img v-bind:alt="altText" v-bind:src="image"/>
            </div>
            <div class="product-info">
                <h1>{{ sale }}</h1>
                <a :href="link">More products like this</a>
                <p v-if="inStock">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0 && inStock">Almost sold out!</p>
                <p v-else :class="{textLineThrough : inStock}">Out of stock</p>
                <span v-if="onSale" style="color: red">Sale</span>
           
                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @click="updateProduct(index)"
                >
                </div>
    
                <product-details :details="['80% cotton', '20% polyester', 'Gender-neutral']"></product-details>
    
                <ul>
                    <li v-for="size in sizes">{{size}}</li>
                </ul>
    
                <button v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to cart</button>
                <button v-on:click="rmFromCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Remove from cart</button>
                <p>Shipping: {{shipping}}</p>        
            </div>
            
        </div>
     `,
    props: {
        premium: {
            type: Boolean,
            required: true
        },
    },
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: 'A pair of warm, fuzzy socks',
            altText: "A pair of socks",
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            inventory: 100,
            onSale: false,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],


            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],

            selectedVariant: 0,
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        rmFromCart(){
            this.$emit('rm-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;

        }


    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            return this.brand + ' ' + this.product + ' ' +  (this.onSale ? 'Распродажа' : '')
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})

Vue.component('ProductDetails', {
    template: `
        <div class="ProductDetails">
            <p>Детали:</p>
            <ul>
                 <li v-for="detail in details">{{detail}}</li>
            </ul>
        </div>
    `,
    name: 'ProductDetails',
    props: {
        details: '',
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        addToCart(id) {
            this.cart.push(id)
            console.log(this.cart)
        },
        rmFromCart(id){
            if(this.cart.indexOf(id) !== -1){
                this.cart.splice(this.cart.indexOf(id))
            }
            console.log(this.cart)
        }
    }
})


