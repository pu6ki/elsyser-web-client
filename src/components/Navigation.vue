<template>
  <div class="navigation">
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="/home">
            ELSYSER
          </a>
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
                <a href="/exams" data-toggle="collapse" data-target=".navbar-collapse.in">Exams
                  <span class="glyphicon glyphicon-pencil"></span>
                </a>
              </li>
              <li id="news-button" v-if="isTeacher">
                <a href="/news/teachers" data-toggle="collapse" data-target=".navbar-collapse.in">News
                  <span class="glyphicon glyphicon-envelope"></span>
                </a>
              </li>
              <li id="news-button" v-else>
                <a href="/news/students" data-toggle="collapse" data-target=".navbar-collapse.in">News
                  <span class="glyphicon glyphicon-envelope"></span>
                </a>
              </li>
              <li id="homeworks-button">
                <a href="/homeworks" data-toggle="collapse" data-target=".navbar-collapse.in">Homeworks
                  <span class="glyphicon glyphicon-book"></span>
                </a>
              </li>
              <li id="materials-button">
                <a href="/materials" data-toggle="collapse" data-target=".navbar-collapse.in">Materials
                  <span class="glyphicon glyphicon-file"></span>
                </a>
              </li>
              <li id="grades-button">
                <a href="/grades" data-toggle="collapse" data-target=".navbar-collapse.in">Grades
                  <span class="glyphicon glyphicon-list-alt"></span>
                </a>
              </li>
            </ul>
  
            <ul class="nav navbar-nav navbar-right">
              <li id="profile-button">
                <a :href="'/profile/' + localStorage.elsyserId" data-toggle="collapse" data-target=".navbar-collapse.in">
                  <img :src="profileImageUrl" :alt="localStorage.elsyserUsername" id="profile-picture" class="img-circle">
                  <span> {{localStorage.elsyserUsername}} </span>
                </a>
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
              <li role="presentation" id="log-in"><a href="/login" data-toggle="collapse" data-target=".navbar-collapse.in">Log-in <span class="glyphicon glyphicon-log-in"></span></a></li>
              <li role="presentation" id="register"><a href="/register" data-toggle="collapse" data-target=".navbar-collapse.in">Register <span class="glyphicon glyphicon-education"></span></a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import requester from '../utils/requester'
import isTeacher from '../utils/helper'

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
      requester.get(`/profile/${id}/`)
        .then((res) => {
          this.profileImageUrl = res.data.profile_image_url
        })
        .catch()
    }
  },
  methods: {
    isTeacher: function () {
      return isTeacher(this.localStorage.elsyserToken)
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
