<template>
  <div id="reset-password">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <form @submit.prevent="onSubmit">
          <section id="reset-password-form" class="is-12">
            <span class="text">Please enter your email:</span>
            <p :class="{'control': true}">
              <span v-show="errors.has('old-password')" class="help is-danger error">{{ errors.first('old-password') }}</span>
              <input type="password" v-model="oldPassword" v-validate="'required'" class="form-control" id="old-password" name="old-password" placeholder="Old Password" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('new-password')" class="help is-danger error">{{ errors.first('new-password') }}</span>
              <input type="password" v-model="newPassword" v-validate="'required|min:6|max:16'" class="form-control" id="new-password" name="new-password" placeholder="New Password" />
            </p>
            <p :class="{'control': true}">
              <span v-show="errors.has('password-confirmation')" class="help is-danger error">{{ errors.first('password-confirmation') }}</span>
              <input type="password" v-validate="'required|confirmed:new-password'" class="form-control" id="password-confirmation" name="password-confirmation" placeholder="Confirm Password" />
            </p>
            <button class="btn btn-lg btn-primary btn-block" id="reset-password-button">Reset</button>
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

export default {
  name: 'new-password',
  data: function () {
    return {
      oldPassword: '',
      newPassword: ''
    }
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        let body = {
          old_password: sha256.HmacSHA256(this.$data.oldPassword, process.env.secret).toString(),
          new_password: sha256.HmacSHA256(this.$data.newPassword, process.env.secret).toString(),
          uid: this.$route.params.uid,
          token: this.$route.params.token
        }
        requester.post('/password/reset/confirm', body)
          .then((res) => {
            this.$toastr('success', 'Password changed. Now you can login with your new password.', 'Success.')
            this.$router.push('/auth/login')
          })
          .catch((err) => {
            this.$toastr('error', 'There was error trying to reset your password. Please try again later', 'Error.')
            console.log(err)
          })
      }
    }
  }
}
</script>

<style>
input,
select {
  margin-bottom: 10px;
}

a {
  color: #337ab7;
}

.text {
  color: black;
  font-size: 20px;
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


#reset-password-form {
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
