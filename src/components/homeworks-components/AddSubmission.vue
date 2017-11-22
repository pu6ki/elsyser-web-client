<template>
  <div id="wrapper" v-if="!hasTeacherRights()" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit()">
      <label for="content">Content: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{ errors.first('content') }}</span>
        <markdown-editor name="content" id="content" v-model="content" ref="markdownEditor" :configs="configs" v-validate="'required|min:5|max:10000'"></markdown-editor>
      </p>
      <label for="solution-url">Solution URL (optional): </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('url')" class="help is-danger error">{{ errors.first('url') }}</span>
        <input type="text" name="url" class="form-control" id="url" v-model="solution_url" v-validate="'url'">
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
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'add-submission',
  data: function () {
    return {
      content: '',
      solution_url: '',
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
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        this.$data.content = this.simplemde.markdown(this.$data.content)

        let body = {
          content: this.$data.content,
          solution_url: this.$data.solution_url
        }

        requester.post(`/homeworks/${this.$route.params.id}/submissions`, body)
          .then(() => {
            this.$toastr('success', 'Homework has been sent.', 'Success')
            this.$router.push(`/homeworks/${this.$route.params.id}`)
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
