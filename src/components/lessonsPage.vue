<template>
  <div class="lessons-page">
    <div v-for="subject in subjects" :key="subject.id" class="lesson">
      <figure>
        <img :src="subject.image" :alt="subject.subject">
        <figcaption>{{ subject.subject }}</figcaption>
      </figure>
      <p>Location: {{ subject.location }}</p>
      <p>Price: £{{ subject.price }}</p>
      <p>Available: {{ subject.available }}</p>
      <button @click="addToCart(subject)">Add To Cart</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonsPage',
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

  methods: {
    addToCart(subject) {
      this.$emit('add-to-cart', subject);
    },
  },
};    
</script>

<style>
.lessons-page {
  width: 100%;
  height: auto;
  display: flex;
}

.lesson {
  width: 25%;
  height: 370px;
  border: 5px solid #6699CC;
  border-radius: 10%;
  text-align: center;
  font-size: 20px;
  margin: 10px 2% 10px 2%;
  background-color: #CCFFFF;
  float: left;
}

.lesson figure,
.lesson img {
  width: 100px;
  height: auto;
}

.lesson img {
  display: block;
}
</style>