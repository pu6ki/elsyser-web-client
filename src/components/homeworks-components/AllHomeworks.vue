<template>
  <div id="wrapper">
    <div class="row" v-if="homeworks.length > 0">
      <div class="col-md-10 col-md-offset-1 text-center search-container">
        <label for="search">Search: </label>
        <input type="text" id="search" class="form-control" v-model="search">
      </div>
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="homework in filteredHomeworks" :key="homework.id">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              {{homework.subject.title}}
            </strong>
          </div>
          <div class="panel-body">
            <div id="deadline">
              <i>Deadline ends in</i>
              <strong>
                <span>{{relativeDate(homework.deadline)}}</span>
              </strong>
            </div>
            <div id="details">
              <i v-if="homework.details">Details:
                <div>{{homework.details}}</div>
              </i>
              <i v-else>No details provided.</i>
            </div>
            <hr /> Posted by
            <router-link :to="'/profile/' + homework.author.user.id">
              <span>
                <strong>
                  <i>{{homework.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
            <div>
              <button id="info-button" class="btn btn-primary" v-on:click="$router.push(`/homeworks/${homework.id}`)">
                <router-link class="heading-anchor" :to="'/homeworks/' + homework.id">Info</router-link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no assigned homeworks so far.</h3>
      </div>
    </div>
    <button v-if="hasTeacherRights()" v-on:click="$router.push('/homeworks/add')" type="button" class="btn btn-primary btn-circle btn-lg" id="add-homework">
      <i class="glyphicon glyphicon-pencil"></i>
    </button>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'

export default {
  name: 'all-homeworks',
  data: function () {
    return {
      homeworks: [],
      search: ''
    }
  },
  computed: {
    filteredHomeworks: function () {
      let self = this
      return this.homeworks.filter((homework) => {
        return homework.details.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          homework.subject.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      })
    }
  },
  beforeCreate: function () {
    requester.get('/homeworks')
      .then((res) => {
        this.$data.homeworks = res.data.results
      })
      .catch(console.log)
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    relativeDate: function (date) {
      return moment(date).fromNow(true)
    }
  }
}
</script>

<style>
#details i div {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
