<template>
  <div id="wrapper" v-if="submission.posted_on">
    <h4 class="text-center">Latest submission:</h4>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <strong>
              <span>{{submission.student.user.first_name}} {{submission.student.user.last_name}} - {{submission.student.clazz.number}}{{submission.student.clazz.letter}}</span>
            </strong>
            <div v-if="isEditable">
              <div class="pull-right" v-if="submission.checked">
                Checked
              </div>
              <div class="pull-right edit" v-else>
                <span v-on:click="$router.push(`/homeworks/${$route.params.id}/submissions/${submission.id}/edit`)" id="submission-edit" class="edit">
                  <span class="glyphicon glyphicon-edit"></span>
                </span>
              </div>
            </div>
            <div class="pull-right check" v-else>
              <span id="mark-checked" class="checked">
                <span class="glyphicon glyphicon-ok"></span>
              </span>
            </div>
          </div>
          <div class="panel-body">
            <div>
              Content:
              <br />
              <strong>
                <i>
                  <span id="submission-content" v-html="submission.content"></span>
                </i>
              </strong>
              <br />
              <div v-show="submission.solution_url">Solution URL:
                <a :href="submission.solution_url" target="_blank">
                  <strong>
                    <i>
                      <span id="solution-url">Link</span>
                    </i>
                  </strong>
                </a>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
  <button v-on:click="$router.push(`/homeworks/${$route.params.id}/send`)" type="button" class="btn btn-primary center-block" id="send-homework-button" v-else>Send homework</button>
</template>

<script>
import requester from '../../utils/requester'
import moment from 'moment'

export default {
  name: 'sent-homeworks',
  data: function () {
    return {
      submission: {
        student: {
          user: {
            first_name: '',
            last_name: '',
            id: null
          },
          clazz: {
            number: null,
            letter: ''
          }
        },
        id: null,
        content: '',
        solution_url: '',
        edited: null,
        last_editted_on: null,
        posted_on: null
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/homeworks/${this.$route.params.id}/submissions`)
      .then((res) => {
        this.$data.submission = res.data[0]
      })
      .catch(console.log)
  },
  methods: {
    isEditable: function () {
      return this.localStorage.elsyserUsername === this.homework.author.user.username
    },
    relativeDate: function (date) {
      return moment(date).fromNow()
    }
  }
}
</script>

<style>
#submission-edit span {
  top: -20px;
}
</style>
