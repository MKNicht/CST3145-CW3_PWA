<template>
  <div id="app">
    <header>
      <h1>{{ siteName }} - {{ pageName }}</h1>
      <button class="toggleView" @click="toggleView">{{ cartCount }} {{ currentView === 'LessonsPage' ? 'Checkout' : 'Go Back' }}</button>
    </header>
    <LessonsPage v-if="currentView === 'LessonsPage'" :subjects="subjects" :cart="cart"
      @add-to-cart="handleAddToCart" />
    <CheckoutPage v-if="currentView === 'CheckoutPage'" :cart="cart" @update-cart="handleCartUpdate" />

    <main>

    </main>
  </div>
</template>

<script>
import LessonsPage from './components/lessonsPage.vue'
import CheckoutPage from './components/checkoutPage.vue'

export default {
  name: 'App',
  data() {
    return {
      siteName: 'After School Class',
      currentView: 'LessonsPage',
      cart: [],
      subjects: [],
    }
  },

  components: {
    LessonsPage,
    CheckoutPage,
  },

  computed: {
    pageName() {
      return this.currentView === 'LessonsPage' ? 'Lessons' : 'Checkout';
    },
    cartCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
  },

  mounted() {
    this.fetchSubjects();
  },

  methods: {
    toggleView() {
      this.currentView = this.currentView === 'LessonsPage' ? 'CheckoutPage' : 'LessonsPage';
    },
    handleAddToCart(subjectToAdd) {
      // 查找该课程在subjects数组中的索引
      const subjectIndex = this.subjects.findIndex(subject => subject.id === subjectToAdd.id);
      if (subjectIndex !== -1 && this.subjects[subjectIndex].available > 0) {
        // 减少对应课程的可用数量
        this.subjects[subjectIndex].available -= 1;

        // 查找该课程是否已经在购物车中
        const cartItemIndex = this.cart.findIndex(item => item.id === subjectToAdd.id);
        if (cartItemIndex !== -1) {
          // 如果已在购物车中，则增加该课程的数量
          this.cart[cartItemIndex].quantity += 1;
        } else {
          // 如果不在购物车中，创建一个新的购物车项目，并设置数量为1
          const newCartItem = {
            ...subjectToAdd,
            quantity: 1
          };
          // 将新的购物车项目加入到购物车数组中
          this.cart.push(newCartItem);
        }
      }
    },
    handleCartUpdate(payload) {
      const { type, index } = payload;
      const cartItem = this.cart[index];
      const subjectIndex = this.subjects.findIndex(subject => subject.id === cartItem.id);

      if (type === 'decrease') {
        if (cartItem.quantity > 1) {
          this.cart[index].quantity--;
          // 增加课程的available数量
          if (subjectIndex !== -1) this.subjects[subjectIndex].available++;
        } else {
          // 如果数量为1，则从购物车移除，并增加available数量
          this.cart.splice(index, 1);
          if (subjectIndex !== -1) this.subjects[subjectIndex].available++;
        }
      } else if (type === 'remove') {
        // 移除物品时，将其数量返还到available
        if (subjectIndex !== -1) this.subjects[subjectIndex].available += cartItem.quantity;
        this.cart.splice(index, 1);
      }
    },
    fetchSubjects() {
      fetch('http://localhost:3000/lessons')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.subjects = data;
        })
        .catch(error => console.error('There has been a problem with your fetch operation:', error));
    },

  },
}
</script>


<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}

body {
  background-color: #99ccff;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 3%;
  color: rgb(29, 72, 227);
}

.toggleView {
    padding: 10px 20px;
    background-color: #368ddf;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    margin-right: 50px;
    transform: scale(1.5);
}

</style>