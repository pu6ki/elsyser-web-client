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
            <!--TODO: Make date relative -->
            <!-- <div>
                                    Coming <strong><span>{{formatRelative date}}</span></strong>
                                </div> -->
            <div>
              <i>Topic: </i>
              <strong>
                <span>{{exam.topic}}</span>
              </strong>
            </div>
            <div>
              <i v-if="exam.details">Details:
                <strong>
                  <span>{{exam.details}}</span>
                </strong>
              </i>
              <i v-else>No details provided.</i>
            </div>
            <hr /> Posted by
            <router-link :to="'#/profile/' + exam.author.user.id">
              <span>
                <strong>
                  <i>{{exam.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
  
            <!-- <button id="info-button" class="btn btn-primary" onclick="window.location.href = '#/exams/{{id}}'">
                    <a class="heading-anchor" href="#/exams/{{id}}">Info</a>
                  </button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no added upcoming exams so far.</h3>
      </div>
    </div>
  
    <div v-if="isTeacher">
      <button type="button" class="btn btn-primary btn-circle btn-lg" id="add-exam">
        <i class="glyphicon glyphicon-pencil"></i>
      </button>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'allExams',
  data: function () {
    return {
      exams: []
    }
  },
  beforeMount: function () {
    requester.get('/exams')
      .then(res => {
        for (let exam of res.data) {
          this.exams.push(exam)
        }
      })
  },
  methods: {
    isTeacher: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    }
  }
}
</script>

<style>

</style>
 