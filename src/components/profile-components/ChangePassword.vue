<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
      <div class="panel panel-primary">
        <div class="panel-heading text-center">
          <strong>Change password</strong>
        </div>
        <div class="col-md-8 col-md-offset-2 text-center">
          <form @submit.prevent="onSubmit">
              <label for="currentPassword">Current password:</label>
              <p :class="{'control': true}">
                <span v-show="errors.has('current-password')" class="help is-danger error">{{ errors.first('current-password') }}</span>
                <input type="password" v-model="currentPassword" v-validate="'required'" class="form-control" id="current-password" name="current-password" placehcurrenter="Current Password" />
              </p>
              <label for="newPassword">New password:</label>
              <p :class="{'control': true}">
                <span v-show="errors.has('new-password')" class="help is-danger error">{{ errors.first('new-password') }}</span>
                <input type="password" v-model="newPassword" v-validate="'required|min:6|max:32'" class="form-control" id="new-password" name="new-password" placehcurrenter="New Password" />
              </p>
              <label for="password-confirmation">Confirm password:</label>
              <p :class="{'control': true}">
                <span v-show="errors.has('password-confirmation')" class="help is-danger error">{{ errors.first('password-confirmation') }}</span>
                <input type="password" v-validate="'required|confirmed:new-password'" class="form-control" id="password-confirmation" name="password-confirmation" placehcurrenter="Confirm Password" />
              </p>
              <button class="btn btn-lg btn-primary btn-block" id="change-password-button">Change</button>
          </form>
        </div>
      </div>
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
      user: {
        username: '',
        id: null,
        first_name: '',
        last_name: '',
        email: ''
      },
      can_edit: false,
      info: '',
      subject: {
        title: ''
      },
      clazz: {
        number: null,
        letter: ''
      },
      profile_image_url: '',
      currentPassword: '',
      newPassword: ''
    }
  },
  beforeCreate: function () {
    requester.get(`/profile/${this.$route.params.id}`)
      .then((res) => {
        this.user = res.data.user
        this.can_edit = res.data.can_edit
        this.info = res.data.info
        this.profile_image_url = res.data.profile_image_url
        if (res.data.subject) {
          this.subject = res.data.subject
        } else if (res.data.clazz) {
          this.clazz = res.data.clazz
        }
      })
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()
      if (!this.errors.any()) {
        let body = {
          current_password: sha256.HmacSHA256(this.$data.currentPassword, process.env.SECRET).toString(),
          new_password: sha256.HmacSHA256(this.$data.newPassword, process.env.SECRET).toString(),
          uid: this.$route.params.uid,
          token: this.$route.params.token
        }
        requester.post('/password/change', body)
          .then((res) => {
            this.$toastr('success', 'Password changed.', 'Success.')
            this.$router.push(`/profile/${this.$route.params.id}`)
          })
          .catch((err) => {
            this.$toastr('error', 'There was error trying to change your password. Have you entered it correctly?', 'Error.')
            console.log(err)
          })
      }
    }
  }
}
</script>

<style scoped>
form {
  margin-top: 10px;
}
label {
  font-size: 16px;
}
#profile-image {
  margin: 10px;
  border-radius: 10%;
  max-height: 300px;
  max-width: 300px;
}

#profile-info {
  margin: 10px;
}

#change-password-button {
  margin-bottom: 10px;
}
</style>
