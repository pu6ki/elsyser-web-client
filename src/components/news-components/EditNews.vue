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
        <textarea class="form-control" name="content" id="content" rows="4" v-model="news.content" v-validate="'required'"></textarea>
      </p>
      <button class="btn btn-lg btn-primary btn-block submit" id="add-news">Edit News</button>
    </form>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'add-news',
  data: function () {
    return {
      news: {
        title: '',
        content: ''
      }
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path.replace('/edit', ''))
      .then((res) => {
        this.news = res.data
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
  }
}
</script>

<style>

</style>
