<template>
  <div class="row" v-if="submissions.length > 0">
    <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="submission in submissions" :key="submission.id">
      <div class="panel panel-primary">
        <div class="panel-heading text-center">
          <strong>
            <span>{{submission.student.user.first_name}} {{submission.student.user.last_name}} - {{submission.student.clazz.number}}{{submission.student.clazz.letter}}</span>
          </strong>
        </div>
        <div class="panel-body text-center">
          <div class="submission-content">
            <span>
              <strong>
                <i>{{submission.content}}</i>
              </strong>
            </span>
          </div>
          <hr />
          <div>
            Posted by
            <router-link :to="'/profile/' + submission.student.user.id">
              <span>
                <strong>
                  <i>{{submission.student.user.username}}</i>
                </strong>
              </span>
            </router-link>
            <span> {{relativeDate(submission.posted_on)}}</span>
  
            <span v-if="submission.edited">(last edited {{relativeDate(submission.last_edited_on)}})</span>
          </div>
          <button id="info-button" class="btn btn-primary" v-on:click="$router.push('/homeworks/' + $route.params.homeworkId + '/submissions/' + submission.id)">
            <router-link :to="'/homeworks/' + $route.params.homeworkId + '/submissions/' + submission.id" class="heading-anchor">Info</router-link>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="panel panel-default" v-else>
    <div class="panel-body">
      <h3 class="text-center">No new submissions for this homework.</h3>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import moment from 'moment'

export default {
  name: 'submissions',
  data: function () {
    return {
      submissions: []
    }
  },
  beforeCreate: function () {
    requester.get(`/homeworks/${this.$route.params.homeworkId}/submissions`)
      .then((res) => {
        this.submissions = res.data
      })
  },
  methods: {
    relativeDate: (date) => {
      return moment(date).fromNow()
    }
  }
}
</script>

<style>
.submission-content {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
