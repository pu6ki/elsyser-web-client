<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              {{homework.subject.title}}
            </strong>
            <div class="pull-right edit" v-if="isEditable()">
              <router-link :to="'/homeworks/' + homework.id + '/edit'" class="edit">
                <span class="glyphicon glyphicon-edit"></span>
              </router-link>
              <span class="delete" v-on:click="showDeleteConfirm()">
                <span class="glyphicon glyphicon-trash"></span>
              </span>
            </div>
          </div>
          <div class="panel-body">
            <div id="deadline">
              <i>Deadline ends in</i>
              <strong>
                <span>{{relativeDate(homework.deadline)}}</span>
              </strong>
            </div>
            <div v-if="homework.details">
              <i>Details: </i>
                <div>{{homework.details}}</div>
            </div>
            <div v-else>
              <i>No details provided.</i>
            </div>
            <hr /> Posted by
            <router-link :to="'/profile/' + homework.author.user.id">
              <span>
                <strong>
                  <i>{{homework.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
            <div>
            </div>
          </div>
          <button v-if="isEditable()" type="button" class="btn btn-primary center-block" id="submissions-button" v-on:click="$router.push('/homeworks/' + homework.id + '/submissions')">
            <router-link :to="'/homeworks/' + homework.id + '/submissions'">View new submissions</router-link>
          </button>
          <submission v-else></submission> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import moment from 'moment'
import Submission from './Submission'

export default {
  name: 'homework',
  components: { Submission },
  data: function () {
    return {
      homework: {
        subject: {
          title: '',
          id: null
        },
        id: null,
        deadline: '',
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
    requester.get(`/homeworks/${this.$route.params.homeworkId}`)
      .then((res) => {
        this.$data.homework = res.data
      })
      .catch(console.log)
  },
  methods: {
    isEditable: function () {
      return this.localStorage.elsyserUsername === this.homework.author.user.username
    },
    relativeDate: function (date) {
      return moment(date).fromNow(true)
    },
    showDeleteConfirm: function () {
      let homeworkId = this.homework.id
      let router = this.$router
      window.swal({
        title: 'Are you sure?',
        text: 'This homework will be deleted forever.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      },
        function () {
          requester.delete(`/homeworks/${homeworkId}`)
            .then(() => {
              window.swal({
                title: 'Deleted!',
                text: 'The homework has been deleted.',
                type: 'success'
              }, function () {
                router.push('/homeworks/all')
              })
            })
        })
    }
  }
}
</script>

<style scoped>
  #submissions-button {
    margin-bottom: 10px;
  }
</style>
