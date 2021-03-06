<template>
  <div id="wrapper" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit">
      <label for="title">Title: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('title')" class="help is-danger error">{{ errors.first('title') }}</span>
        <input type="text" class="form-control" name="title" id="title" v-model="material.title" v-validate="'required'">
      </p>
      <label for="section">Section: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('section')" class="help is-danger error">{{errors.first('section')}}</span>
        <input type="text" class="form-control" name="section" id="section" v-model="material.section" v-validate="'required'">
      </p>
      <label for="content">Content: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('content')" class="help is-danger error">{{errors.first('content')}}</span>
        <markdown-editor name="content" id="content" v-model="material.content" ref="markdownEditor" :configs="configs" v-validate="'required|min:5'"></markdown-editor>        
      </p>
      <label for="class-number">Class: </label>
      <p :class="{'control': true}">
        <span v-show="errors.has('class-number')" class="help is-danger error">Please select class number</span>
        <select class="form-control" name="class-number" id="class-number" v-model="material.class_number" v-validate="'required'">
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </p>
      <label for="video-url">Link to video lesson: </label>
      <input type="url" class="form-control" name="video-url" id="video-url" v-model="material.video_url">
      <button class="btn btn-lg btn-primary btn-block submit" id="edit-material">Edit Material</button>
    </form>
  </div>
</template>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor'
import toMarkdown from 'to-markdown'
import requester from '../../utils/requester'

export default {
  name: 'edit-material',
  data: function () {
    return {
      material: {
        title: '',
        section: '',
        content: '',
        class_number: null,
        video_url: ''
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
    requester.get(`/materials/${this.$route.params.subjectId}/${this.$route.params.id}`)
      .then((res) => {
        this.$data.material = res.data
        this.material.content = toMarkdown(this.material.content)
      })
      .catch(console.log)
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        this.$data.material.content = this.simplemde.markdown(this.$data.material.content)

        requester.put(`/materials/${window.localStorage.getItem('elsyserTeacherSubjectId')}/${this.$route.params.id}`, this.$data.material)
          .then(() => {
            this.$toastr('success', 'Material added successfully.', 'Success.')
            this.$router.push(`/materials/${this.localStorage.elsyserTeacherSubjectId}/${this.$route.params.id}`)
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

#edit-material {
  margin-top: 15px;
}
</style>
