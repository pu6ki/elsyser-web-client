<template>
  <div id="wrapper" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit()">
      <label class="label-center" for="title">Title</label>
      <p :class="{'control': true}">
        <span v-show="errors.has('title')" class="help is-danger error">{{ errors.first('title') }}</span>
        <input type="text" class="form-control" name="title" id="title" v-model="title" v-validate="'required'">
      </p>
      <label class="label-center" for="news-content">Content</label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{errors.first('content')}}</span>
        <markdown-editor name="content" id="content" v-model="content" ref="markdownEditor" :configs="configs" v-validate="'required|min:5'"></markdown-editor>
      </p>
      <div v-if="hasTeacherRights()">
        <label for="class-number">Class: </label>
        <p :class="{'control': true}">
          <span v-show="errors.has('class-number')" class="help is-danger error">Please select class number</span>
          <select v-model="classNumber" class="form-control" name="class-number" id="class-number" v-validate="'required'">
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </p>
        <label for="class-letter">Student class letter: </label>
        <select v-model="classLetter" class="form-control" name="class-letter" id="class-letter">
          <option value="All">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="V">V</option>
          <option value="G">G</option>
        </select>
      </div>
      <button class="btn btn-lg btn-primary btn-block submit" id="add-news">Add News</button>
    </form>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'add-news',
  data: function () {
    return {
      title: '',
      content: '',
      classNumber: null,
      classLetter: '',
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
        let url = '/news'
        if (helper.isTeacher(this.localStorage.elsyserToken)) {
          url += `/teachers/${this.classNumber}`
        } else {
          url += '/students'
        }

        this.$data.content = this.simplemde.markdown(this.$data.content)

        let body = {
          title: this.$data.title,
          content: this.$data.content,
          classNumber: this.$data.classNumber,
          classLetter: this.$data.classLetter
        }

        requester.post(url, body)
          .then(() => {
            this.$toastr('success', 'News added successfully.', 'Success.')
            this.$router.push(url)
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
