<template>
  <div class="hello">
    <h1>{{ localStorage.elsyserUsername }}</h1>
    <button v-on:click="getData()">Click</button>
    <button v-on:click="redirect()">Redirect</button>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getData: function () {
      console.log(this.localStorage.elsyserUsername)
    },
    redirect: function () {
      this.$router.push('register')
    }
  }
}
</script>

<style scoped>

</style>
