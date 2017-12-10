<template>
  <div id="addExam" class="row">
    <div id="wrapper" class="col-md-10 col-md-offset-1">
      <form class="form-group form-wrapper" @submit.prevent="onSubmit">
        <section class="is-12">
          <label for="topic">Topic: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
            <input v-model="topic" v-validate="'required|max:60'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic" :value="topic">
          </p>
          <div id="sandbox-container">
            <label for="date">Date: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('date')" class="help is-danger error">{{ errors.first('date') }}</span>
              <input v-model="date" v-validate="'required'" type="date" class="form-control" id="date" name="date" :value="date">
            </p>
          </div>
          <label for="details">Details: </label>
          <markdown-editor name="content" id="content" v-model="details" ref="markdownEditor" :configs="configs"></markdown-editor>
          <button class="btn btn-lg btn-primary btn-block submit" id="add-exam">Edit Exam</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import toMarkdown from 'to-markdown'
import requester from '../../utils/requester'

export default {
  name: 'edit-exam',
  data: function () {
    return {
      date: '',
      topic: '',
      details: '',
      id: null,
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
    requester.get(`/exams/${this.$route.params.id}`)
      .then(res => {
        this.$data.date = res.data.date
        this.$data.topic = res.data.topic
        this.$data.details = toMarkdown(res.data.details)
        this.$data.id = res.data.id
      })
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        this.$data.details = this.simplemde.markdown(this.$data.details)

        let body = {
          date: this.$data.date,
          topic: this.$data.topic,
          details: this.$data.details,
          id: this.$data.id
        }

        requester.put(`/exams/${this.id}`, body)
          .then((res) => {
            this.$toastr('success', 'Exam edited successfully.', 'Success.')
            this.$router.push('/exams/all')
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

<style scoped>
@import '~simplemde/dist/simplemde.min.css';
@import '~github-markdown-css';
</style>
