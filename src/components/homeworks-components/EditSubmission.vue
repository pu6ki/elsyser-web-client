<template>
  <div id="wrapper" v-if="!hasTeacherRights()" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit()">
      <label for="content">Content: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{ errors.first('content') }}</span>
        <markdown-editor name="content" id="content" v-model="submission.content" ref="markdownEditor" :configs="configs"></markdown-editor>
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
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import toMarkdown from 'to-markdown'
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'edit-submission',
  data: function () {
    return {
      submission: {
        content: '',
        solution_url: ''
      },
      configs: {
        hideIcons: ['fullscreen', 'side-by-side']
      }
    }
  },
  computed: {
    simplemde () {
      return this.$refs.markdownEditor.simplemde
    }
  },
  beforeCreate: function () {
    requester.get(`/homeworks/${this.$route.params.homeworkId}/submissions`)
      .then((res) => {
        this.submission = res.data[0]
        this.submission.content = toMarkdown(this.submission.content)
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
        this.$data.submission.content = this.simplemde.markdown(this.$data.submission.content)

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
  },
  components: {
    markdownEditor
  }
}
</script>

<style>
@import '~simplemde/dist/simplemde.min.css';
@import '~github-markdown-css';
</style>
