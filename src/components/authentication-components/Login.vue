<template>
  <div class="login">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <form @submit.prevent="onSubmit">
          <section id="login-form" class="is-12">
            <p :class="{'control': true}">
              <span v-show="errors.has('email-or-username')" class="help is-danger error">{{ errors.first('email-or-username') }}</span>
              <input type="text" v-model="email_or_username" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('email-or-username') }" class="form-control" id="email-or-username" name="email-or-username" placeholder="Email or username" autofocus/>
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('password')" class="help is-danger error">{{ errors.first('password') }}</span>
              <input type="password" v-model="password" v-validate="'required'" class="form-control" id="password" name="password" placeholder="Password" />
            </p>
            <button class="btn btn-lg btn-primary btn-block" id="login-button">Login</button>
            <div>
              <span class="text-formatted">Not a member yet?</span>
              <br />
              <a href="/auth/register">Create account</a>
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
import helper from '../../utils/helper'

export default {
  name: 'login',
  data: function () {
    return {
      email_or_username: '',
      password: ''
    }
  },
  methods: {
    onSubmit () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.post('/login/', this.$data)
          .then(res => {
            res.data.token += res.data.is_teacher ? '1' : '0'
            window.localStorage.setItem('elsyserToken', res.data.token)
            window.localStorage.setItem('elsyserUsername', res.data.username)
            window.localStorage.setItem('elsyserId', res.data.id)
            if (helper.isTeacher(res.data.token)) {
              helper.setTeacherSubjectToLocalStorage()
            }
            this.$toastr('success', 'Logged-in successfully.', 'Welcome.')
            this.$router.push('/home', function () {
              window.location.reload(true)
            })
          })
          .catch((err) => {
            console.log(err)
            this.$toastr('error', err.response.data.non_field_errors[0], 'Access denied.')
          })
      }
    }
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
