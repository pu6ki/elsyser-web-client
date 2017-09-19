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
              <router-link :to="'/exams/' + exam.id + '/edit'" class="edit">
                <span class="glyphicon glyphicon-edit"></span>
              </router-link>
              <span class="delete" v-on:click="showDeleteConfirm()">
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
                <span v-html="exam.details"></span>
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
import helper from '../../utils/helper'

export default {
  name: 'exam',
  data: function () {
    return {
      exam: {
        subject: {
          title: ''
        },
        id: null,
        date: null,
        topic: '',
        details: '',
        author: {
          user: {
            username: '',
            id: null
          }
        }
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/exams/${this.$route.params.id}`)
      .then(res => {
        this.$data.exam = res.data
        this.$data.exam.details = helper.insertLineBreaks(res.data.details)
      })
  },
  methods: {
    isEditable: function () {
      return this.localStorage.elsyserUsername === this.exam.author.user.username
    },
    relitveDate: function (date) {
      return moment(date).fromNow(true)
    },
    showDeleteConfirm: function () {
      let examId = this.exam.id
      let router = this.$router
      window.swal({
        title: 'Are you sure?',
        text: 'This exam will be deleted forever.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      },
        function () {
          requester.delete(`/exams/${examId}`)
            .then(() => {
              window.swal({
                title: 'Deleted!',
                text: 'The exam has been deleted.',
                type: 'success'
              }, function () {
                router.push('/exams/all')
              })
            })
        })
    }
  }
}
</script>

<style>

</style>
