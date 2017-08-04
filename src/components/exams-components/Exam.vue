<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              {{exam.subject.title}}
            </strong>
              <div class="pull-right edit" v-if="isEditable()">
                <span :id="'exam-' + exam.id + '-edit'" class="edit">
                  <span class="glyphicon glyphicon-edit"></span>
                </span>
                <span :id="'exam-' + exam.id + '-delete'" class="delete">
                  <span class="glyphicon glyphicon-trash"></span>
                </span>
              </div>
          </div>
           <div class="panel-body">
              <div>
                Coming in
                <strong>
                  <span>{{relitveDate(exam.date)}}</span>
                </strong>
              </div>
              <div>
                <i>Topic: </i>
                <strong>
                  <span>{{exam.topic}}</span>
                </strong>
              </div>
              <div v-if="exam.details">
                <i>Details: </i>
                <strong>
                  <span>{{exam.details}}</span>
                </strong>
              </div>
              <div v-else>
                <i>No details provided.</i>
              </div>
    
              <hr /> Posted by
              <router-link :to="'#/profile/' + exam.author.user.id">
                <span>
                  <strong>
                    <i>{{exam.author.user.username}}</i>
                  </strong>
                </span>
              </router-link>
            </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import moment from 'moment'

export default {
  name: 'exam',
  data: function () {
    return {
      exam: null
    }
  },
  beforeMount: function () {
    requester.get(`/exams/${this.$route.params.id}`)
      .then(res => {
        console.log(res.data)
        this.$data.exam = res.data
      })
  },
  methods: {
    isEditable: function () {
      return this.localStorage.elsyserUsername === this.exam.author.user.username
    },
    relitveDate: function (date) {
      return moment(date).fromNow(true)
    }
  }
}
</script>

<style>

</style>
