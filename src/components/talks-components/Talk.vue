<template>
  <div id="talk">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary">
          <div class="panel-heading center-text">
            <strong>
              {{topic}}
            </strong>
            <div class="pull-right edit" v-if="isEditable()">
              <span class="edit" v-on:click="$router.push('/meetups/' + $route.params.meetupId + '/talks/' + $route.params.talkId + '/edit')">
                <span class="glyphicon glyphicon-edit"></span>
              </span>
            </div>
          </div>
          <div class="panel-body" id="description" v-html="description"></div>
          <br />
          <div class="embed-responsive embed-responsive-16by9" v-if="video_url">
            <iframe class="embed-responsive-item" :src="makeYouTubeVideoEmbeddable(video_url)" allowfullscreen></iframe>
          </div>
          <br />
          <div id="user-info" class="text-center">
            Posted by
            <router-link :to="'/profile/' + author.id">
              <span>
                <strong>
                  <i>{{author.username}}</i>
                </strong>
              </span>
            </router-link>
          </div>
          <button class="btn btn-lg btn-primary center-block" id="vote" :click="upvote()">Vote</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'talk',
  data: function () {
    return {
      topic: '',
      description: '',
      video_url: '',
      author: {},
      has_voted: false
    }
  },
  beforeCreate: function () {
    requester.get(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}`)
      .then(res => {
        this.$data.topic = res.data.topic
        this.$data.description = res.data.description
        this.$data.video_url = res.data.video_url
        this.$data.author = res.data.author
      })
  },
  methods: {
    isEditable: function () {
      return this.$data.author.username === this.localStorage.elsyserUsername
    },
    makeYouTubeVideoEmbeddable: function (videoUrl) {
      return helper.makeYouTubeVideoEmbeddable(videoUrl)
    },
    upvote: function () {
      return true
    }
  }
}
</script>

<style>
#description {
  font-size: 16px;
}
#vote:hover {
  color: gold;
}
</style>
