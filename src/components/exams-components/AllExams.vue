<template>
  <div id="allExams">
    <div class="row" v-if="exams.length > 0">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="exam in exams" :key="exam.id">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              {{exam.subject.title}}
            </strong>
          </div>
          <div class="panel-body">
            <div>
              Coming in
              <strong>
                <span>{{relativeDate(exam.date)}}</span>
              </strong>
            </div>
            <div>
              <i>Topic: </i>
              <strong>
                <span>{{exam.topic}}</span>
              </strong>
            </div>
            <div>
              <i v-if="exam.details">
                Details:
                <strong>
                  <div id="details">{{exam.details}}</div>
                </strong>
              </i>
              <i v-else>No details provided.</i>
            </div>
            <hr /> Posted by
            <router-link :to="'/profile/' + exam.author.user.id">
              <span>
                <strong>
                  <i>{{exam.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
          </div>
          <button id="info-button" class="btn btn-primary" v-on:click="$router.push('/exams/' + exam.id)">
            <router-link :to="'/exams/' + exam.id" class="heading-anchor">Info</router-link>
          </button>
        </div>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no added upcoming exams so far.</h3>
      </div>
    </div>
  
    <div v-if="isTeacher()">
      <button type="button" v-on:click="$router.push('/exams/add')" class="btn btn-primary btn-circle btn-lg" id="add-exam">
        <router-link to="/exams/add">
          <i class="glyphicon glyphicon-pencil"></i>
        </router-link>
      </button>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'

export default {
  name: 'all-exams',
  data: function () {
    return {
      exams: []
    }
  },
  beforeMount: function () {
    requester.get('/exams')
      .then(res => {
        this.exams = res.data.results
      })
  },
  methods: {
    isTeacher: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    relativeDate: function (date) {
      return moment(date).fromNow(true)
    }
  }
}
</script>

<style scoped>
#details {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
 