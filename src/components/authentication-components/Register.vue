<template>
  <div class="register">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <section id="register-form">
          <input type="text" v-model="user.username" id="username" class="form-control" name="username" placeholder="Username" required autofocus="" />
          <input type="text" v-model="user.first_name" id="firstName" class="form-control" name="firstName" placeholder="First name" required />
          <input type="text" v-model="user.last_name" id="lastName" class="form-control" name="lastName" placeholder="Last name" required />
          <input type="email" v-model="user.email" id="email" class="form-control" name="email" placeholder="Email address" required />
          <input type="password" v-model="user.password" id="password" class="form-control" name="password" placeholder="Password" required />
          <input type="password" id="verify-password" class="form-control" name="verify-password" placeholder="Enter password again" required />
          <select class="form-control" v-model="clazz.number" name="studentClassNumber" id="studentClassNumber">
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <select class="form-control" v-model="clazz.letter" name="studentClassLetter" id="studentClassLetter">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="V">V</option>
            <option value="G">G</option>
          </select>
          <button v-on:click="register" class="btn btn-lg btn-primary btn-block submit" id="registerButton">Register</button>
          <div>
            <span class="text-formatted">Already a member?</span>
            <br />
            <a href="/login"> Log-in</a>
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
  name: 'register',
  data: function () {
    return {
      user: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      clazz: {
        number: null,
        letter: ''
      }
    }
  },
  methods: {
    register: function () {
      requester.post('/register/', this.$data)
        .then(res => {
          this.$router.push('/login')
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

.text-formatted {
  color: black
}

#register-form {
  opacity: 0.9;
  border-radius: 5px;
  margin-top: 2em;
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
