<template>
  <div id="wrapper" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit">
      <section class="is-12">
        <label for="topic">Topic: </label>
        <p :class="{'control': true}">
          <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
          <input v-model="topic" v-validate="'required|max:60'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic">
        </p>
        <label for="studentClassNumber">Student class number: </label>
        <p :class="{'control': true}">
          <span v-show="errors.has('studentClassNumber')" class="help is-danger error">Please select class number</span>
          <select v-model="clazz.number" v-validate="'required'" class="form-control" name="studentClassNumber" id="studentClassNumber">
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </p>
        <label for="studentClassLetter">Student class letter: </label>
        <p :class="{'control': true}">
          <span v-show="errors.has('studentClassLetter')" class="help is-danger error">Please select class letter</span>
          <select v-model="clazz.letter" v-validate="'required'" class="form-control" name="studentClassLetter" id="studentClassLetter">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="V">V</option>
            <option value="G">G</option>
          </select>
        </p>
        <div id="sandbox-container">
          <label for="deadline">Deadline: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('deadline')" class="help is-danger error">{{ errors.first('deadline') }}</span>
            <input v-model="deadline" v-validate="'required'" type="date" class="form-control" id="deadline" name="deadline">
          </p>
        </div>
        <label for="details">Details: </label>
        <markdown-editor name="content" id="content" v-model="details" ref="markdownEditor" :configs="configs"></markdown-editor>
        <button class="btn btn-lg btn-primary btn-block submit" id="add-exam">Add Homework</button>
      </section>
    </form>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import requester from '../../utils/requester'

export default {
  name: 'add-homework',
  data: function () {
    return {
      deadline: '',
      topic: '',
      clazz: {
        number: null,
        letter: ''
      },
      details: '',
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
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        this.$data.details = this.simplemde.markdown(this.$data.details)

        let body = {
          deadline: this.$data.deadline,
          topic: this.$data.topic,
          clazz: {
            number: this.$data.clazz.number,
            letter: this.$data.clazz.letter
          },
          details: this.$data.details
        }

        requester.post('/homeworks', body)
          .then(() => {
            this.$toastr('success', 'Exam added successfully.', 'Success.')
            this.$router.push('/homeworks/all')
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
