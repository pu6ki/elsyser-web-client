<template>
  <div id="all-grades">
    <div class="all-grades-container" v-if="subjects.length > 0">
      <div class="col-lg-4 col-md-4 col-sm-12" id="grades-panel" v-for="subject in subjects" :key="subject.id">
        <div class="panel panel-primary info-panel">
          <div class="panel-heading">
            <strong>
              <div class="text-center">{{subject.title}}</div>
            </strong>
          </div>
          <div class="panel-body info-body">
            <div class="info-container" v-for="grade in subject.grades" :key="grade.id">
              <div class="text-center grade">{{attachEvaluationWords(grade.value.toFixed(2))}}</div>
            </div>
          </div>
          <div class="panel-footer" v-if="subject.average">
            <div class="text-center average-grade">Average: {{attachEvaluationWords(subject.average)}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">You have no grades yet.</h3>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'all-grades',
  data: function () {
    return {
      subjects: []
    }
  },
  beforeCreate: function () {
    requester.get('/subjects')
      .then((res) => {
        this.subjects = res.data.results
      })
      .then(() => {
        for (let i = 0; i < this.subjects.length; i++) {
          requester.get(`/grades/${this.subjects[i].id}/${this.localStorage.elsyserId}`)
            .then((grades) => {
              this.$set(this.subjects[i], 'grades', grades.data)
              let average = 0.0
              this.subjects[i].grades.forEach(function (grade) {
                average += grade.value
              }, this)
              average = (average / this.subjects[i].grades.length).toFixed(2)
              this.subjects[i].average = average
            })
        }
      })
  },
  methods: {
    attachEvaluationWords: function (mark) {
      return helper.attachEvaluationWords(mark)
    }
  }
}
</script>

<style>

</style>
