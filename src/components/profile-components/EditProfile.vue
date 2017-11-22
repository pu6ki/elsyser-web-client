<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
      <div class="panel panel-primary">
        <div class="panel-heading text-center">
          <strong v-if="clazz">Student profile</strong>
          <strong v-else>Teacher profile</strong>
        </div>
        <div class="row">
          <div class="col-md-6 col-md-offset-3 text-center">
            <img :src="profile_image_url" alt="Profile Image" id="profile-image">
          </div>
          <form class="col-md-6 col-md-offset-3 text-center form-wrapper" id="profile-info" @submit.prevent="onSubmit">
            <div>
              <strong>
                <i>Username:</i>
              </strong>
              <input class="form-control text-center" id="new-username" type="text" v-model="user.username">
            </div>
            <div>
              <strong>
                <i>First name:</i>
              </strong>
              <input class="form-control text-center" id="new-first-name" type="text" v-model="user.first_name">
            </div>
            <div>
              <strong>
                <i>Last name:</i>
              </strong>
              <input class="form-control text-center" id="new-last-name" type="text" v-model="user.last_name">
            </div>
            <div>
              <strong>
                <i>About:</i>
              </strong>
              <input class="form-control text-center" id="new-info" type="text" v-model="info">
            </div>
            <div>
              <strong>
                <i>Profile image url:</i>
              </strong>
              <input class="form-control text-center" id="new-profile-image-url" type="text" v-model="profile_image_url">
            </div>
            <button id="save-button" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'EditProfile',
  data: function () {
    return {
      user: {
        username: '',
        first_name: '',
        last_name: ''
      },
      can_edit: false,
      info: '',
      profile_image_url: '',
      clazz: null
    }
  },
  beforeCreate: function () {
    requester.get(`/profile/${this.$route.params.id}`)
      .then((res) => {
        this.user = res.data.user
        this.can_edit = res.data.can_edit
        this.info = res.data.info
        this.profile_image_url = res.data.profile_image_url
        if (res.data.clazz) {
          this.clazz = res.data.clazz
        }
      })
  },
  methods: {
    onSubmit: function () {
      let body = {
        user: this.$data.user,
        info: this.$data.info,
        profile_image_url: this.$data.profile_image_url,
        clazz: this.$data.clazz
      }

      requester.put(`/profile/${this.$route.params.id}`, body)
        .then((res) => {
          this.$toastr('success', 'Profile edited successfully.', 'Success.')
          this.localStorage.elsyserUsername = res.data.user.username
          this.$router.push(`/profile/${this.$route.params.id}`)
        })
        .catch((err) => {
          console.log(err)
          this.$toastr('error', 'Could not update your profile with the provided data.', 'Error.')
        })
    }
  }
}
</script>

<style scoped>
#profile-image {
    margin: 10px;
    border-radius: 10%;
    max-height: 300px;
    max-width: 300px;
}

#save-button {
  margin: 10px;
}

</style>
