<template>
  <div id="wrapper" v-if="!hasTeacherRights()" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit()">
      <label for="content">Content: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{ errors.first('content') }}</span>
        <textarea class="form-control" id="content" name="content" rows="10" v-model="submission.content" v-validate="'required|min:5|max:10000'"></textarea>
      </p>
      <label for="solution-url">Solution URL (optional): </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('url')" class="help is-danger error">{{ errors.first('url') }}</span>
        <input type="text" name="url" class="form-control" id="url" v-model="submission.solution_url" v-validate="'url'">
      </p>
      <button class="btn btn-lg btn-primary btn-block submit" id="send-button">Send Homework</button>
    </form>
  </div>
  <div v-else>
    <div class="panel-body">
      <h3 class="text-center">You do NOT have permissions to send homeworks.</h3>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'send-homework',
  data: function () {
    return {
      submission: {
        content: '',
        solution_url: ''
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/homeworks/${this.$route.params.homeworkId}/submissions`)
      .then((res) => {
        this.submission = res.data[0]
      })
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.put(`/homeworks/${this.$route.params.homeworkId}/submissions/${this.$route.params.submissionId}`, this.$data.submission)
          .then(() => {
            this.$toastr('success', 'Submission has been updated.', 'Success')
            this.$router.push(`/homeworks/${this.$route.params.homeworkId}`)
          })
          .catch((err) => {
            console.log(err)
            this.$toastr('error', 'Invalid data.')
          })
      }
    }
  }
}
</script>

<style>

</style>
