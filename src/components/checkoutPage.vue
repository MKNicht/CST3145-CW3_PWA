<template>
    <div class="checkout-page">
        <form @submit.prevent="submitForm">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="user.name" pattern="[A-Za-z\s]*">
            </div>
            <div>
                <label for="phone">Phone Number:</label>
                <input type="tel" id="phone" v-model="user.phone" pattern="\d*">
            </div>
            <button type="submit" :disabled="isSubmitDisabled">Submit</button>
            <!-- <p>Submit Disabled: {{ isSubmitDisabled }}</p> -->
            <div>
                <p>Total Quantity: {{ totalQuantity }}</p>
                <p>Total Price: £{{ totalPrice }}</p>
            </div>
        </form>

        <h2>Cart</h2>
        <ul>
            <li v-for="(item, index) in cart" :key="item.id">
                {{ item.subject }} - ${{ item.price }} - 數量: {{ item.quantity }}
                <button @click="decreaseQuantity(index)">-1</button>
                <button @click="removeItem(index)">Remove</button>
            </li>
        </ul>

    </div>
</template>

<script>
export default {
    name: 'CheckoutPage',
    props: {
        cart: {
            type: Array,
            default: () => []
        },
        subjects: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            user: {
                name: '',
                phone: ''
            },
        }
    },

    created() {
        console.log(this.cart);
    },


    methods: {
        decreaseQuantity(index) {
            // console.log(`Decreasing quantity at index: ${index}`);
            // 发送减少商品数量的请求给父组件
            this.$emit('update-cart', { type: 'decrease', index: index });
        },

        removeItem(index) {
            // console.log(`Removing item at index: ${index}`);
            // 发送移除商品的请求给父组件
            this.$emit('update-cart', { type: 'remove', index: index });
        },
        async submitForm() {
            const orderData = {
                name: this.user.name,
                phoneNumber: this.user.phone,
                lessonIDs: this.cart.map(item => item.id),
                totalOfPrice: this.totalPrice
            };

            try {
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    throw new Error('Failed to submit order');
                }

                const responseData = await response.json();
                console.log('Order submitted successfully:', responseData);
                alert(`Your order has been submitted`);
                // 这里可以添加更多成功提交后的操作，比如清空购物车等
            } catch (error) {
                console.error('Error submitting order:', error);
                // 这里处理错误情况
            }
        },

    },

    computed: {
        isSubmitDisabled() {
            const nameIsValid = /^[A-Za-z\s]*$/.test(this.user.name) && this.user.name.trim() !== '';
            const phoneIsValid = /^\d*$/.test(this.user.phone) && this.user.phone.trim() !== '';
            return !(nameIsValid && phoneIsValid);
        },
        totalQuantity() {
            if (!this.cart || this.cart.length === 0) {
                return 0;
            }
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        totalPrice() {
            if (!this.cart || this.cart.length === 0) {
                return 0;
            }
            return this.cart.reduce((total, item) => total + (item.quantity * item.price), 0);
        },
    }
}
</script>



<style></style>