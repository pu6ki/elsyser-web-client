<template>
  <div id="allExams">
    <div class="row" v-if="exams.length > 0">
      <div class="col-md-10 col-md-offset-1 text-center search-container">
        <label for="search">Search: </label>
        <input type="text" id="search" class="form-control" v-model="search">
      </div>
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="exam in filteredExams" :key="exam.id">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              {{exam.subject.title}}
            </strong>
          </div>
          <div class="panel-body">
            <div>
              Coming in
              <strong>
                <span>{{relativeDate(exam.date)}}</span>
              </strong>
            </div>
            <div>
              <i>Topic: </i>
              <strong>
                <span>{{exam.topic}}</span>
              </strong>
            </div>
            <div>
              <i v-if="exam.details">
                Details:
                <strong>
                  <div id="details" v-html="exam.details"></div>
                </strong>
              </i>
              <i v-else>No details provided.</i>
            </div>
            <hr /> Posted by
            <router-link :to="'/profile/' + exam.author.user.id">
              <span>
                <strong>
                  <i>{{exam.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
          </div>
          <button id="info-button" class="btn btn-primary" v-on:click="$router.push('/exams/' + exam.id)">
            <router-link :to="'/exams/' + exam.id" class="heading-anchor">Info</router-link>
          </button>
        </div>
      </div>
      <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
        <span slot="no-more"></span>
        <span slot="no-results"></span>
      </infinite-loading>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no added upcoming exams so far.</h3>
      </div>
    </div>
  
    <div v-if="isTeacher()">
      <button class="btn btn-circle btn-lg btn-bottom" id="add-exam" v-on:click="$router.push('/exams/add')">
        <i class="glyphicon glyphicon-pencil"></i>
      </button>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'all-exams',
  data: function () {
    return {
      exams: [],
      search: '',
      nextPage: null
    }
  },
  computed: {
    filteredExams: function () {
      let self = this
      let filtered = this.exams.filter((exam) => {
        exam.details = helper.extractContent(exam.details)
        return exam.details.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          exam.subject.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          exam.topic.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      })
      if (filtered.length === 0) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
      return filtered
    }
  },
  beforeMount: function () {
    requester.get('/exams')
      .then(res => {
        this.exams = res.data.results
        if (res.data.next) {
          let index = res.data.next.indexOf('=') + 1
          this.nextPage = res.data.next.substr(index)
        }
      })
  },
  methods: {
    isTeacher: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    relativeDate: function (date) {
      return moment(date).fromNow(true)
    },
    onInfinite: function () {
      if (this.nextPage) {
        requester.get(this.$route.path, {
          page: this.nextPage
        }).then((res) => {
          this.$set(this.$data, 'exams', this.news.concat(res.data.results))
          this.filteredExams.concat(res.data.results)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          if (res.data.nextPage) {
            let index = res.data.next.indexOf('=') + 1
            this.nextPage = res.data.next.substr(index)
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      } else {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
      }
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<style scoped>
#details {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
 