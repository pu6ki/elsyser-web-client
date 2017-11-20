<template>
  <div id="add-talk" class="row">
    <div id="wrapper" class="col-md-10 col-md-offset-1">
      <form class="form-group form-wrapper" @submit.prevent="onSubmit">
        <section class="is-12">
          <label for="topic">Topic: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
            <input v-model="topic" v-validate="'required|max:500'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic">
          </p>
          <div id="sandbox-container">
            <label for="meetup">Meetup: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('meetup')" class="help is-danger error">{{ errors.first('meetup') }}</span>
              <select name="meetup" v-model="selectedMeetupId" v-validate="'required'" class="form-control">
                <option v-for="meetup in meetups" :key="meetup.id" :value="meetup.id">{{meetup.date}}</option>
              </select>
            </p>
          </div>
          <div id="sandbox-container">         
            <label for="description">Description: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('description')" class="help is-danger error">{{ errors.first('description') }}</span>              
              <markdown-editor name="content" id="content" v-model="description" ref="markdownEditor" :configs="configs" v-validate="'required|min:5|max:10000'"></markdown-editor>
            </p>
          </div>
          <label for="video-url">Link to video: (optional)</label>
          <input type="url" class="form-control" name="video-url" id="video-url" v-model="video_url">
          <button class="btn btn-lg btn-primary btn-block submit" id="add-talk">Add Talk</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'add-talk',
  data: function () {
    return {
      meetups: [],
      selectedMeetupId: null,
      topic: '',
      description: '',
      video_url: '',
      configs: {
        hideIcons: ['fullscreen', 'side-by-side']
      }
    }
  },
  beforeCreate: function () {
    requester.get('/meetups', {
      'only': 'upcoming'
    }).then(res => {
      this.$data.meetups = res.data.results
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
        let body = {
          topic: this.$data.topic,
          description: this.simplemde.markdown(this.$data.description),
          video_url: this.$data.video_url
        }

        requester.post(`/meetups/${this.selectedMeetupId}/talks`, body)
          .then(() => {
            this.$toastr('success', 'Talk added successfully.', 'Success.')
            this.$router.push('/talks/all')
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
