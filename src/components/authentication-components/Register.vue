<template>
  <div class="register">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <form @submit.prevent="onSubmit">
          <section id="register-form">
            <p :class="{'control': true}">
              <span v-show="errors.has('username')" class="help is-danger error">Username must be between 3 and 30 characters long.</span>
              <input type="text" v-model="user.username" v-validate="'required|min:3|max:30'" id="username" class="form-control" name="username" placeholder="Username" autofocus/>
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('firstName')" class="help is-danger error">First name must be between 3 and 30 characters long.</span>
              <input type="text" v-model="user.first_name" v-validate="'required|min:3|max:30'" id="firstName" class="form-control" name="firstName" placeholder="First name" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('lastName')" class="help is-danger error"> Last name must be between 3 and 30 characters long. </span>
              <input type="text" v-model="user.last_name" v-validate="'required|min:3|max:30'" id="lastName" class="form-control" name="lastName" placeholder="Last name" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('email')" class="help is-danger error">{{ errors.first('email') }}</span>
              <input type="email" v-validate="'required|email'" v-model="user.email" id="email" class="form-control" name="email" placeholder="Email address" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('password')" class="help is-danger error">{{ errors.first('password') }}</span>
              <input type="password" v-model="user.password" v-validate="'required|min:6|max:16'" id="password" class="form-control" name="password" placeholder="Password" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('password-confirmation')" class="help is-danger error">{{ errors.first('password-confirmation') }}</span>
              <input type="password" id="password-confirmation" v-validate="'required|confirmed:password'" data-vv-as="password" class="form-control" name="password-confirmation" placeholder="Enter password again" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('studentClassNumber')" class="help is-danger error"> Please select your class number </span>
              <select class="form-control" v-model="clazz.number" name="studentClassNumber" id="studentClassNumber" v-validate="'required'">
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('studentClassLetter')" class="help is-danger error"> Please select your class letter </span>
              <select class="form-control" v-model="clazz.letter" v-validate="'required'" name="studentClassLetter" id="studentClassLetter">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="V">V</option>
                <option value="G">G</option>
              </select>
            </p>
            <vue-recaptcha sitekey="6Le-sjEUAAAAAIUSppd8sER_EUrBJJxwloYx8DTC" ref="invisibleRecaptcha" @verify="onVerify" @expired="onExpired">
              <button class="btn btn-lg btn-primary btn-block" id="registerButton">Register</button>
            </vue-recaptcha>
            <div>
              <span class="text-formatted">Already a member?</span>
              <br />
              <router-link href="/auth/login"> Log-in</router-link>
            </div>
          </section>
        </form>
      </div>
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import sha256 from 'crypto-js'
import VueRecaptcha from 'vue-recaptcha'

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
    onSubmit: function () {
      this.$refs.invisibleRecaptcha.execute()
    },
    onVerify: function (response) {
      console.log('Verify: ' + response)
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        let body = {
          user: {
            username: this.$data.user.username,
            first_name: this.$data.user.first_name,
            last_name: this.$data.user.last_name,
            email: this.$data.user.email,
            password: sha256.HmacSHA256(this.$data.user.password, process.env.secret).toString()
          },
          clazz: {
            number: this.$data.clazz.number,
            letter: this.$data.clazz.letter
          }
        }
        requester.post('/register', body)
          .then(res => {
            this.$toastr('success', res.data.message, 'Registered successfully.')
            this.$router.push('/auth/login')
          })
          .catch((err) => {
            console.log(err)
            this.$toastr('error', 'Could not register you with the provided data. Username and email must be uniqe.')
          })
      }
    },
    onExpired: function () {
      console.log('Expired')
    }
  },
  components: {
    VueRecaptcha
  }
}
</script>

<style scoped>
input,
select {
  margin-bottom: 10px;
}

span.error {
  color: #9F3A38;
}

a {
  color: #337ab7;
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
