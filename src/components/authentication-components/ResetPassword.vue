<template>
  <div id="reset-password">
    <div class="row auth-intro-header overlay" id="pwd-container">
      <div class="col-sm-1 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-10 col-md-4 col-lg-4 form-wrapper">
        <form @submit.prevent="onSubmit">
          <section id="reset-password-form" class="is-12">
            <span class="text">Please enter your email:</span>
            <p :class="{'control': true}">
              <span v-show="errors.has('email')" class="help is-danger error">{{ errors.first('email') }}</span>
              <input type="text" v-model="email" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('email') }" class="form-control" id="email" name="email" placeholder="Email" autofocus/>
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

export default {
  data: () => {
    return {
      email: ''
    }
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      let body = {
        'email': this.$data.email
      }

      if (!this.errors.any()) {
        requester.post('/password/reset', body)
          .then((res) => {
            this.$toastr('success', `Email sent to ${this.$data.email}. Please check your inbox and follow the instructions.`, 'Success.')
            this.$data.email = ''
          })
          .catch((err) => {
            this.$toastr('error', 'There was error trying to reset your password. Please try again later', 'Error.')
            console.log(err)
          })
      } else {
        this.$toastr('error', 'Please enter correct data.', 'Error.')
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
