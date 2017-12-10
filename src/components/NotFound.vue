<template>
  <div id="error-block">
    <div class="col-sm-2 col-md-2 col-lg-2"></div>
    <div class="col-sm-8 col-md-8 col-lg-8 error-image-container">
        <span>Something went wrong.</span>
        <br />
        <span>Error 404</span>
        <br />
        <button type="button" class="btn btn-primary" id="go-home-button" @click="$router.push('/home')"><router-link :to="'/home'">Go home</router-link></button>
    </div>
    <div class="col-sm-2 col-md-2 col-lg-2"></div>
</div>
</template>

<script>
export default {
  name: 'not-found'
}
</script>

<style>
.error-image-container {
  color: white;
  font-family: Impact, Charcoal, sans-serif;
  font-size: 68px;
  font-weight: bold;
  text-shadow: 2px 2px 1px #000;
}

#error-block {
  position: fixed;
  left: 0;
  right: 0;
  display: inline-block;

  margin: 0px;
  height: 100vh;
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;

  background: url(/static/404.gif) no-repeat center center fixed;
  background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;

  text-align: center;
  overflow: hidden;
}
</style>
