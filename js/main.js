let eventBus = new Vue()

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           <p>Recommended: {{review.recommendation}}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Details'">
            <product-details :details="['80% cotton', '20% polyester', 'Gender-neutral']"></product-details>
       </div>
       <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{shipping}}</p>
       </div>
     </div>
    `,
    props: {
        reviews: {
            type: Array,
            required: false,

        },
        shipping: '',
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },


    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Details', 'Shipping'],
            selectedTab: 'Reviews',
            shipping: '',
        }
    }
})



Vue.component('product-review', {
    template: `
       <form class="review-form" @submit.prevent="onSubmit">
       <p v-if="errors.length">
         <b>Please correct the following error(s):</b>
         <ul>
           <li v-for="error in errors">{{ error }}</li>
         </ul>
        </p>
             <p>
               <label for="name">Name:</label>
               <input id="name" v-model="name" placeholder="name" >
             </p>
            
             <p>
               <label for="review">Review:</label>
               <textarea id="review" v-model="review" ></textarea>
             </p>
            
             <p>
               <label for="rating">Rating:</label>
               <select id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
               </select>
             </p>
             
             <p>
                <p>Would you recommend this product?</p>
                <label><input type="radio" name="radio" value="yes" v-model="recommendation" checked> yes</label>
                <label><input type="radio" name="radio" value="no" v-model="recommendation"> no</label>
             </p>
             
             <p>
               <input type="submit" value="Submit"> 
             </p>
        </form>
      </div>  
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: [],
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommendation: this.recommendation,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommendation = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }

    }

})

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
    
                
    
                <select v-model="current_percent">
                    <option v-for="size in sizes" :value="size.percent">{{size.size}}</option>
                </select>
                
                <div>
                    <p>Price: {{price}}</p>
                </div>
    
                <button v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to cart</button>
                <button v-on:click="rmFromCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Remove from cart</button>
                        
            </div>
            
                <product-tabs :reviews="reviews" :shipping="shipping"></product-tabs>   
              </div>
            <div>
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
                    variantQuantity: 10,
                    price: 20,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    price: 30,
                }
            ],
            sizes: [{size: 'S', percent: 0},
                {size: 'M', percent: 2},
                {size: 'L', percent: 4},
                {size: 'XL', percent: 6},
                {size: 'XLL', percent: 8},],
            current_percent: 2,
            selectedVariant: 0,
            reviews: []
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

        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        updatePrice(price){
            return this.current_percent
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
        price(){
          return this.variants[this.selectedVariant].price + this.variants[this.selectedVariant].price*this.current_percent/100
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


