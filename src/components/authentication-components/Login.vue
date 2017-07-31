<template>
  <div class="login">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <section id="login-form">
          <input type="text" v-model="email_or_username" class="form-control" id="email-or-username" name="email-or-username" placeholder="Email or username" required="" autofocus="" />
          <input type="password" v-model="password" class="form-control" id="password" name="password" placeholder="Password" required="" />
          <button v-on:click="login" class="btn btn-lg btn-primary btn-block submit" id="login-button">Login</button>
          <div>
            <a href="/register">Create account</a>
          </div>
        </section>
      </div>
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'login',
  data: function () {
    return {
      email_or_username: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      requester.post('/login/', this.$data)
        .then(res => {
          window.localStorage.setItem('elsyser-token', res.data.token)
          window.localStorage.setItem('elsyser-username', res.data.username)
          window.localStorage.setItem('elsyser-id', res.data.id)
          this.$router.push('/')
        })
        .catch(console.log)
    }
  }
}
</script>

<style scoped>
input,
select {
  margin-bottom: 10px;
}

.auth-intro-header {
  display: inline-block;
  opacity: 0.9;

  margin: 0px !important;
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;

  background: url(/static/logos/tues_building.jpg) no-repeat center center fixed;
  background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;

  text-align: center;
}

.auth-intro-header.overlay:after {
  top: 0;
  left: 0;
  position: fixed;
  overflow: hidden;
}

.overlay {
  position: relative;
}

.overlay:after {
  content: "";
  z-index: -2;
  top: 0;
  left: 0;
  opacity: 0.7;
  width: 100%;
  height: 100vh;
  background-color: indigo;
}

#login-form {
  opacity: 0.9;
  border-radius: 5px;
  margin-top: 7em;
  padding: 5%;
  background-color: white;
  text-align: center;
}

#pwd-container .form-wrapper,
#go-home-button a {
  color: white;
}

#pwd-container {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
