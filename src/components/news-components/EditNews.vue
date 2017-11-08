<template>
  <div id="wrapper" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit()">
      <label class="label-center" for="title">Title</label>
      <p :class="{'control': true}">
        <span v-show="errors.has('title')" class="help is-danger error">{{ errors.first('title') }}</span>
        <input type="text" class="form-control" name="title" id="title" v-model="news.title" v-validate="'required'">
      </p>
      <label class="label-center" for="news-content">Content</label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{errors.first('content')}}</span>
        <markdown-editor name="content" id="content" v-model="news.content" ref="markdownEditor" :configs="configs" v-validate="'required|min:5'"></markdown-editor>        
      </p>
      <button class="btn btn-lg btn-primary btn-block submit" id="add-news">Edit News</button>
    </form>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import toMarkdown from 'to-markdown'
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'add-news',
  data: function () {
    return {
      news: {
        title: '',
        content: ''
      },
      configs: {
        hideIcons: ['fullscreen', 'side-by-side']
      }
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path.replace('/edit', ''))
      .then((res) => {
        this.news = res.data
        this.news.content = toMarkdown(this.news.content)
      })
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
        this.$data.news.content = this.simplemde.markdown(this.$data.news.content)

        requester.put(this.$route.path.replace('/edit', ''), this.news)
          .then(() => {
            this.$toastr('success', 'News updated successfully.', 'Success.')
            this.$router.push(this.$route.path.replace('/edit', ''))
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
