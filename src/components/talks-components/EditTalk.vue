<template>
  <div id="add-talk" class="row">
    <div id="wrapper" class="col-md-10 col-md-offset-1">
      <form class="form-group form-wrapper" @submit.prevent="onSubmit">
        <section class="is-12">
          <label for="topic">Topic: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
            <input v-model="talk.topic" v-validate="'required|max:500'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic">
          </p>
          <div id="sandbox-container">         
            <label for="description">Description: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('description')" class="help is-danger error">{{ errors.first('description') }}</span>              
              <markdown-editor name="content" id="content" v-model="talk.description" ref="markdownEditor" :configs="configs" v-validate="'required|min:5|max:10000'"></markdown-editor>
            </p>
          </div>
          <label for="video-url">Link to video: (optional)</label>
          <input type="url" class="form-control" name="video-url" id="video-url" v-model="talk.video_url">
          <button class="btn btn-lg btn-primary btn-block submit" id="edit-talk">Edit Talk</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import toMarkdown from 'to-markdown'

export default {
  name: 'add-talk',
  data: function () {
    return {
      talk: {
        meetups: [],
        selectedMeetupId: null,
        topic: '',
        description: '',
        video_url: ''
      },
      configs: {
        hideIcons: ['fullscreen', 'side-by-side']
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}`)
      .then(res => {
        this.talk = res.data
        this.$data.talk.description = toMarkdown(res.data.talk.description)
      })
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
        this.$data.talk.description = this.simplemde.markdown(this.$data.talk.description)

        requester.put(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}`, this.$data.talk)
          .then(() => {
            this.$toastr('success', 'Material added successfully.', 'Success.')
            this.$router.push(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}`)
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
@import '~simplemde/dist/simplemde.min.css';
@import '~github-markdown-css';
</style>
