<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
      <div class="panel panel-primary">
        <div class="panel-heading text-center">
          <strong v-if="clazz.number">Student profile</strong>
          <strong v-else>Teacher profile</strong>
        </div>
        <div class="row" id="profile-block">
          <div class="col-md-6 col-md-offset-3 text-center">
            <img :src="profile_image_url" alt="Profile Image" id="profile-image">
          </div>
          <div class="col-md-6 col-md-offset-3 text-center" id="profile-info">
            <div>
              <i>Username: </i>
              <strong>
                <span>
                  {{user.username}}
                </span>
              </strong>
            </div>
            <div>
              <i>Name: </i>
              <strong>
                <span>
                  {{user.first_name}} {{user.last_name}}
                </span>
              </strong>
            </div>
            <div>
              <i>Email: </i>
              <strong>
                <span>
                  {{user.email}}
                </span>
              </strong>
            </div>
  
            <div v-if="clazz.number">
              <i>Class: </i>
              <strong>
                <span>
                  {{clazz.number}}{{clazz.letter}}
                </span>
              </strong>
            </div>
            <div v-else>
              <i>Subject: </i>
              <strong>
                <span>
                  {{subject.title}}
                </span>
              </strong>
            </div>
  
            <div v-if="info">
              <i>About: </i>
              <strong>
                <span>{{info}}</span>
              </strong>
            </div>
            <div v-else>
              <strong>
                <span>
                  <i>No details provided.</i>
                </span>
              </strong>
            </div>
            <div v-if="can_edit">
              <router-link :to="'/profile/' + this.user.id + '/edit'" id="edit-profile" class="btn btn-primary">Edit profile</router-link>
              <router-link :to="'/profile/' + this.user.id + '/password-change'" id="change-profile" class="btn btn-primary">Change password</router-link>              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'profile',
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
      profile_image_url: ''
    }
  },
  beforeMount: function () {
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
  }
}
</script>

<style scoped>
#profile-block {
  margin-top: 20px;
  margin-bottom: 20px;
}

#profile-image {
    border-radius: 10%;
    max-height: 300px;
    max-width: 300px;
    margin-bottom: 20px;
}
</style>
