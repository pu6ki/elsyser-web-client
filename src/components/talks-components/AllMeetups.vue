<template>
  <div id="all-talks" class="row">
    <!-- <div class="col-md-10 col-md-offset-1 text-center search-container">
      <label for="search">Search: </label>
      <input type="text" id="search" class="form-control" v-model="search">
    </div> -->
    <div class="panel panel-default">
      <div class="panel">
        <div class="panel-body">
          <h3 class="text-center" v-if="upcomingMeetups.length > 0">Upcoming meetups</h3>
          <h3 class="text-center" v-else>There are no available upcoming meetups so far.</h3>        
        </div>
      </div>
      <div id="upcoming-meetups" class="panel-body" v-if="upcomingMeetups.length > 0">
        <div class="upcoming-meetup col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="meetup in upcomingMeetups" :key="meetup.id">
          <div class="panel panel-primary">
            <div class="panel-heading center-text">
              {{formatDate(meetup.date)}}
            </div>
            <div class="panel-group" id="accordion">
              <div class="panel talks panel-default text-center" v-for="talk in meetup.talks" :key="talk.id">
                <div class="panel-heading">
                  <h4 class="panel-title text-center">
                    <a data-toggle="collapse" data-parent="#accordion" :href="'#talk' + talk.id">{{talk.topic}}</a>
                  </h4>
                </div>
                <div :id="'talk' + talk.id" class="panel-collapse collapse out">
                  <div class="panel-body">
                    <router-link id="read-more" :to="`/meetups/${meetup.id}/talks/${talk.id}`">
                      Read more
                    </router-link>
                    <div id="user-info" class="text-center">
                      Posted by
                      <router-link :to="'/profile/' + talk.author.id">
                        <span>
                          <strong>
                            <i>{{talk.author.username}}</i>
                          </strong>
                        </span>
                      </router-link>
                    </div>
                    <div class="text-center" id="votes-count">
                      <span>Votes: {{talk.votes_count}}</span>
                    </div>
                    <button class="btn btn-lg btn-success center-block" id="vote" v-on:click="upvote(meetup.id, talk.id)" v-if="!talk.has_voted">Vote</button>
                    <button class="btn btn-lg btn-danger center-block" id="vote" v-on:click="downvote(meetup.id, talk.id)" v-else>Downvote</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

    <br>

    <div class="panel panel-default">
      <div class="panel">
        <div class="panel-body">
          <h3 class="text-center" v-if="pastMeetups.length > 0">Past meetups</h3>
          <h3 class="text-center" v-else>There are no available past meetups so far.</h3>        
        </div>
      </div>
      <div id="past-meetups" class="panel-body" v-if="pastMeetups.length > 0">
        <div class="past-meetup col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="meetup in pastMeetups" :key="meetup.id">
          <div class="panel panel-primary">
            <div class="panel-heading center-text">
              {{formatDate(meetup.date)}}
            </div>
            <div class="panel-group" id="accordion">
              <div class="panel talks panel-default text-center" v-for="talk in meetup.talks" :key="talk.id">
                <div class="panel-heading">
                  <h4 class="panel-title text-center">
                    <a data-toggle="collapse" data-parent="#accordion" :href="'#talk' + talk.id">{{talk.topic}}</a>
                  </h4>
                </div>
                <div :id="'talk' + talk.id" class="panel-collapse collapse out">
                  <div class="panel-body">
                    <div id="user-info" class="text-center">
                      Posted by
                      <router-link :to="'/profile/' + talk.author.id">
                        <span>
                          <strong>
                            <i>{{talk.author.username}}</i>
                          </strong>
                        </span>
                      </router-link>
                    </div>
                    <div class="text-center" id="votes-count">
                      <span>Votes: {{talk.votes_count}}</span>
                    </div>
                    <button class="btn btn-lg btn-info center-block" v-on:click="$router.push(`/meetups/${meetup.id}/talks/${talk.id}`)">Read more</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    <button class="btn btn-circle btn-lg btn-bottom" id="add-talk" v-on:click="$router.push('/meetups/addTalk')">
      <i class="glyphicon glyphicon-pencil"></i>
    </button>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import moment from 'moment'

export default {
  name: 'all-talks',
  data: function () {
    return {
      upcomingMeetups: [],
      pastMeetups: []
      // search: '',
      // nextPage: null
    }
  },
  beforeCreate: function () {
    requester
      .get(`/meetups`, {
        only: 'upcoming'
      })
      .then(res => {
        this.$data.upcomingMeetups = res.data.results
        return requester.get(`/meetups`, {
          only: 'past'
        })
      })
      .then(res => {
        this.$data.pastMeetups = res.data.results
      })
  },
  methods: {
    upvote: function (meetupId, talkId) {
      let upcomingMeetupsArrayId = this.$data.upcomingMeetups.findIndex(x => x.id === meetupId)
      let talksArrayId = this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks.findIndex(x => x.id === talkId)

      requester.put(`/meetups/${meetupId}/talks/${talkId}/upvote`).then(res => {
        this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks[talksArrayId].has_voted = true
        this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks[talksArrayId].votes_count = res.data.votes_count
        this.$toastr(
          'success',
          'You voted for this talk successfully.',
          'Success.'
        )
      })
    },
    downvote: function (meetupId, talkId) {
      let upcomingMeetupsArrayId = this.$data.upcomingMeetups.findIndex(x => x.id === meetupId)
      let talksArrayId = this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks.findIndex(x => x.id === talkId)

      requester
        .put(`/meetups/${meetupId}/talks/${talkId}/downvote`)
        .then(res => {
          this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks[talksArrayId].has_voted = false
          this.$data.upcomingMeetups[upcomingMeetupsArrayId].talks[talksArrayId].votes_count = res.data.votes_count
          this.$toastr(
            'success',
            'You downvoted for this talk successfully.',
            'Success.'
          )
        })
    },
    formatDate: function (dateString) {
      return moment(dateString).format('Do MMM YYYY')
    }
  }
}
</script>

<style>
.talks {
  font-size: 16px;
  margin-top: 10px;
  border-radius: 7px;
}

#read-more {
  color: #0000ee;
}

#read-more:hover {
  text-decoration: underline;
}

.talks .panel-heading {
  background-color: lightgray !important;
}
</style>

