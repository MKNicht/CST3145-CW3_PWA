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
.lesson {
  margin-bottom: 20px;
}
.lesson figure, .lesson img {
  width: 150px; 
  height: auto;
}
.lesson img {
  display: block;
}
</style>