<template>
  <div class="navigation">
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link to="/home" class="navbar-brand">
            ELSYSER
          </router-link>
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbar">
          <div id="header" v-if="localStorage.elsyserToken">
            <ul class="nav navbar-nav">
              <li id="exams-button">
                <router-link to="/exams/all" data-toggle="collapse" data-target=".navbar-collapse.in">Exams
                  <span class="glyphicon glyphicon-pencil"></span>
                </router-link>
              </li>
              <li id="news-button" v-if="isTeacher">
                <router-link to="/news/teachers" data-toggle="collapse" data-target=".navbar-collapse.in">News
                  <span class="glyphicon glyphicon-envelope"></span>
                </router-link>
              </li>
              <li id="news-button" v-else>
                <router-link to="/news/students" data-toggle="collapse" data-target=".navbar-collapse.in">News
                  <span class="glyphicon glyphicon-envelope"></span>
                </router-link>
              </li>
              <li id="homeworks-button">
                <router-link to="/homeworks/all" data-toggle="collapse" data-target=".navbar-collapse.in">Homeworks
                  <span class="glyphicon glyphicon-book"></span>
                </router-link>
              </li>
              <li id="materials-button">
                <router-link to="/materials/all" data-toggle="collapse" data-target=".navbar-collapse.in">Materials
                  <span class="glyphicon glyphicon-file"></span>
                </router-link>
              </li>
              <li id="grades-button">
                <router-link to="/grades" data-toggle="collapse" data-target=".navbar-collapse.in">Grades
                  <span class="glyphicon glyphicon-list-alt"></span>
                </router-link>
              </li>
            </ul>
  
            <ul class="nav navbar-nav navbar-right">
              <li id="profile-button">
                <router-link :to="'/profile/' + localStorage.elsyserId" data-toggle="collapse" data-target=".navbar-collapse.in">
                  <img :src="profileImageUrl" :alt="localStorage.elsyserUsername" id="profile-picture" class="img-circle">
                  <span> {{localStorage.elsyserUsername}} </span>
                </router-link>
              </li>
              <li v-on:click="logOut" id="log-out">
                <a data-toggle="collapse" data-target=".navbar-collapse.in">Logout
                  <span class="glyphicon glyphicon-log-out"></span>
                </a>
              </li>
            </ul>
          </div>
          <div v-else>
            <ul class="nav navbar-nav navbar-right" id="sign-in-buttons">
              <li role="presentation" id="log-in"><router-link to="/auth/login" data-toggle="collapse" data-target=".navbar-collapse.in">Log-in <span class="glyphicon glyphicon-log-in"></span></router-link></li>
              <li role="presentation" id="register"><router-link to="/auth/register" data-toggle="collapse" data-target=".navbar-collapse.in">Register <span class="glyphicon glyphicon-education"></span></router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import requester from '../utils/requester'
import helper from '../utils/helper'

export default {
  name: 'navigation',
  data () {
    return {
      profileImageUrl: ''
    }
  },
  created () {
    if (this.localStorage.elsyserToken) {
      let id = this.localStorage.elsyserId
      requester.get(`/profile/${id}`)
        .then((res) => {
          this.profileImageUrl = res.data.profile_image_url
        })
        .catch()
    }
  },
  methods: {
    isTeacher: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    logOut: function () {
      this.localStorage.elsyserToken = null
      this.localStorage.elsyserUsername = null
      this.localStorage.elsyserId = null
      this.localStorage.elsyserTeacherSubjectId = null

      this.$router.push('/')
      this.$toastr('success', 'Logged-out successfully.', 'Bye.')
    }
  }
}
</script>

<style scoped>
.navbar-default .navbar-nav > li > a {
    color: white;
}

.navbar-default .navbar-nav > li > a:hover {
    color: gold;
}

.navbar-default .navbar-nav > li > a:focus {
    color: gold;
}

.navbar-default .navbar-brand {
    color: white;
}

.navbar-default .navbar-brand:hover {
    color: gold;
}

.navbar-default .navbar-brand:focus {
    color: gold;
}

.navbar-fixed-top {
    background-color: rebeccapurple;
    border-bottom-color: rebeccapurple;
}

.navbar-default .navbar-toggle .icon-bar {
    background-color: white;
}

#profile-picture {
    margin-right: 5px;
    height: 26px;
    width: 26px;
}

#log-out {
    cursor: pointer;
    color: white;
}
</style>
