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
          <div class="text-center" id="votes-count">
            <span>Votes: {{votes_count}}</span>
          </div>
          <button class="btn btn-lg btn-primary center-block" id="vote" v-on:click="upvote()" v-if="!has_voted">Vote</button>
          <button class="btn btn-lg btn-primary center-block" id="vote" v-on:click="downvote()" v-else>Downvote</button>          
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
      votes_count: 0,
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
        this.$data.votes_count = res.data.votes_count
        this.$data.has_voted = res.data.has_voted
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
      requester.put(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}/upvote`)
        .then(res => {
          this.$data.has_voted = true
          this.$data.votes_count++
          this.$toastr('success', 'You voted for this talk successfully.', 'Success.')
        })
    },
    downvote: function () {
      requester.put(`/meetups/${this.$route.params.meetupId}/talks/${this.$route.params.talkId}/downvote`)
        .then(res => {
          this.$data.has_voted = false
          this.$data.votes_count--
          this.$toastr('success', 'You downvoted for this talk successfully.', 'Success.')
        })
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
#vote {
  margin-bottom: 10px;
  margin-top: 10px;
}
#votes-count {
  font-size: 16px;
}
</style>
