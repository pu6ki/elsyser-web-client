<template>
  <div id="all-talks" class="row">
    <!-- <div class="col-md-10 col-md-offset-1 text-center search-container">
      <label for="search">Search: </label>
      <input type="text" id="search" class="form-control" v-model="search">
    </div> -->
    <div class="panel panel-default">
      <div class="panel-body">
        <h3 class="text-center" v-if="upcomingMeetups.length > 0">Upcoming meetups</h3>
        <h3 class="text-center" v-else>There are no available upcoming meetups so far.</h3>        
      </div>
    </div>
    <div id="upcoming-meetups" v-if="upcomingMeetups.length > 0">
      <div class="upcoming-meetup col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="meetup in upcomingMeetups" :key="meetup.id">
        <div class="panel panel-primary">
          <div class="panel-heading center-text">
            {{meetup.date}}
          </div>
          <div class="talks panel" v-for="talk in meetup.talks" :key="talk.id">
            <div class="panel-body text-center" v-on:click="$router.push(`/meetups/${meetup.id}/talks/${talk.id}`)">
              {{talk.topic}}
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
    requester.get(`/meetups`, {
      'only': 'upcoming'
    }).then(res => {
      this.$data.upcomingMeetups = res.data.results
      return requester.get(`/meetups`, {
        'only': 'past'
      })
    }).then(res => {
      this.$data.postMeetups = res.data.results
    })
  }
}
</script>

<style>
.talks{
  font-size: 16px;
  margin-top: 10px;
  background-color: lightgray;
  border-radius: 7px;  
}

.talks:hover .panel-body{
  border-radius: 7px;
  color: white;
  background-color: #8066B3;
  cursor: pointer;
}
</style>
