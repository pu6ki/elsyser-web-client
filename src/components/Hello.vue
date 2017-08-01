<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button v-on:click="getData()">Click</button>
    <button v-on:click="redirect()">Redirect</button>
  </div>
</template>

<script>
import requester from '../utils/requester'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getData: function () {
      requester.get('/subjects').then(res => console.log(res))
    },
    redirect: function () {
      this.$router.push('register')
    }
  }
}
</script>

<style scoped>

</style>
