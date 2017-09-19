<template>
  <div id="home">
    <div v-if="localStorage.elsyserToken">
      <div class="col-lg-6 col-md-6 col-sm-12" id="news-panel">
        <div class="panel panel-primary info-panel">
          <div class="panel-heading text-center">
            <strong v-if="hasTeacherRights()">
              <a href="#/news/teachers">Latest news</a>
            </strong>
            <strong v-else>
              <a href="#/news/students">Latest news</a>
            </strong>
          </div>
          <div class="panel-body info-body">
            <div class="info-container text-center" v-for="item in news" :key="item.id">
              <div v-if="hasTeacherRights()">
                <router-link :to="'/news/teachers/' + item.class_number + '/' + (item.class_letter ? item.class_letter : 'A') + '/' + item.id">{{item.title}}</router-link>
              </div>
              <div v-else>
                <router-link :to="'/news/students/' + item.id">{{item.title}}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-12" id="homeworks-panel">
        <div class="panel panel-primary info-panel">
          <div class="panel-heading text-center">
            <strong>
              <a href="/homeworks/all">Homeworks</a>
            </strong>
          </div>
          <div class="panel-body info-body">
            <div class="info-container text-center" v-for="homework in homeworks" :key="homework.id">
              <router-link :to="'/homeworks/' + homework.id">
                <b>{{homework.subject.title}}</b> - ({{homework.deadline}})
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12" id="homeworks-panel">
        <div class="panel panel-primary info-panel">
          <div class="panel-heading text-center">
            <strong>
              <router-link to="/exams/all">Upcoming exams</router-link>
            </strong>
          </div>
          <div class="panel-body info-body">
            <div class="info-container text-center" v-for="exam in exams" :key="exam.id">
              <router-link :to="'/exams/' + exam.id">
                <b>{{exam.subject.title}}</b> ({{exam.date}})
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-12" id="materials-panel">
        <div class="panel panel-primary info-panel">
          <div class="panel-heading text-center">
            <strong>
              <router-link to="/materials/all">Latest materials</router-link>
            </strong>
          </div>
          <div class="panel-body info-body">
            <div class="info-container text-center" v-for="material in materials" :key="material.id">
              <router-link :to="'/materials/' + material.subject.id + '/' + material.id">
                <b>{{material.subject.title}}</b> - {{material.title}}
              </router-link>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="intro-header">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="intro-message">
                <img src="/static/logos/logo-white.png" alt="Logo" align="center" id="home-logo" />
                <h3>Your school in the cloud</h3>
                <hr class="intro-divider">
                <router-link to="/auth/login" id="login-btn" class="btn btn-default btn-lg signup-button">
                  <span class="network-name">Login</span>
                </router-link>
                <router-link to="/auth/register" id="register-btn" class="btn btn-default btn-lg signup-button">
                  <span class="network-name">Register</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container content">
        <div class="row">
          <div class="col-lg-5 col-sm-6">
            <div class="clearfix"></div>
            <h2 class="section-heading">What is ELSYSER ?</h2>
            <p class="lead" id="info">
              This is your school but mobile! You can see your current homeworks, prepare for upcoming exams and be informed about the events in your school.
            </p>
            <router-link to="/auth/register" class="btn btn-primary btn-lg content-button signup-button">
              <span class="network-name">Join now !</span>
            </router-link>
          </div>
          <div class="col-lg-5 col-lg-offset-2 col-sm-6">
            <img class="img-responsive" src="/static/school-cloud.png" alt="ELSYSER Logo">
          </div>
        </div>
      </div>

      <div class="footer lead navbar navbar-bottom center-text">
        <span class="glyphicon glyphicon-chevron-left"></span>
        <span class="glyphicon glyphicon-chevron-right"></span> with
        <span class="glyphicon glyphicon-heart-empty"></span> by
        <a href="http://www.github.com/pu6ki" target="_blank">pu6ki.</a> All rights reserved.
      </div>
    </div>
  </div>
</template>

<script>
import helper from '../utils/helper'
import requester from '../utils/requester'

export default {
  name: 'home',
  data: function () {
    return {
      news: [],
      exams: [],
      homeworks: [],
      materials: []
    }
  },
  beforeMount: function () {
    if (this.localStorage.elsyserToken) {
      let isTeacher = helper.isTeacher(this.localStorage.elsyserToken)
      let getNews = isTeacher ? requester.get('/news/teachers') : requester.get('/news/students')
      let getExams = requester.get('/exams')
      let getHomeworks = requester.get('/homeworks')
      let getMaterials = requester.get('/materials')

      Promise.all([getNews, getExams, getHomeworks, getMaterials])
        .then(res => {
          const maxLen = 5

          res[0].data.results.every((el, index) => {
            if (index > maxLen) return false
            this.news.push(el)
            return true
          })
          res[1].data.results.every((el, index) => {
            if (index > maxLen) return false
            this.exams.push(el)
            return true
          })
          res[2].data.results.every((el, index) => {
            if (index > maxLen) return false
            this.homeworks.push(el)
            return true
          })
          res[3].data.results.every((el, index) => {
            if (index > maxLen) return false
            this.materials.push(el)
            return true
          })
        })
    }
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    }
  }
}
</script>

<style scoped>
.intro-header {
  z-index: -2;

  display: inline-block;

  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-bottom: 50px;

  background: url(/static/bg-image.jpg) no-repeat center center fixed;
  background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;

  text-align: center;
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

.intro-message {
  position: relative;
  padding-bottom: 10%;
  padding-top: 10%;
}

.intro-message>h1 {
  margin: 0;
  font-size: 5em;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
  color: white;
}

.intro-message>h3 {
  color: white;
}

.intro-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-top: 1px solid #f8f8f8;
  width: 400px;
}


#home-logo {
  max-height: 17vh;
  max-width: 100%;
}

.info-container {
  border-bottom: 1px solid rebeccapurple;
  padding-bottom: 3px;
  padding-top: 2px;
}

.info-panel .panel-heading a {
  color: white;
  font-size: 16px;
  text-decoration: none;
}

.info-panel .panel-heading a:hover {
  color: gold;
  text-decoration: none;
}

.info-panel {
  margin: 20px;
}

.footer {
  margin: 0px;
  border-radius: 0px
}

#info-button {
  position: absolute;
  right: 6px;
  bottom: 3px;
}
</style>
