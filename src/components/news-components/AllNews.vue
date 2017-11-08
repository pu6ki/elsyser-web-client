<template>
  <div id="wrapper">
    <div id="news" v-if="news.length > 0">
      <div class="row">
        <div class="col-md-10 col-md-offset-1 text-center search-container">
          <label for="search">Search: </label>
          <input type="text" id="search" class="form-control" v-model="search">
        </div>
        <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="item in filteredNews" :key="item.id">
          <div class="panel panel-primary">
            <div class="panel-heading text-center">
              <strong>
                <span>{{item.title}}</span>
              </strong>
            </div>
            <div class="panel-body">
              <div class="text-center">
                <span>
                  <strong>
                    <i>{{item.content}}</i>
                  </strong>
                </span>
              </div>
              <hr />
              <div class="text-center">
                Posted by
                <router-link :to="'/profile/' + item.author.id">
                  <span>
                    <strong>
                      <i>{{item.author.username}}</i>
                    </strong>
                  </span>
                </router-link>
                <span v-if="hasTeacherRights()">for
                  <b>{{item.class_number}}
                    <span v-show="item.class_letter">{{item.class_letter}}</span> class</b>
                </span>
                <span> {{relativeDate(item.posted_on)}}</span>

                <span v-show="item.edited">(last edited {{relativeDate(item.last_edited_on)}})</span>
              </div>
              <div class="text-center">
                <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
                <strong v-if="item.comments.length > 0">
                  <i v-if="item.comments.length > 1">{{item.comments.length}} comments</i>
                  <i v-else>One comment</i>
                </strong>
                <strong v-else>
                  <i>No comments</i>
                </strong>
              </div>
              <button id="info-button" class="btn btn-primary center-block" v-on:click="$router.push(getNewsUrl(item))">
                <router-link class="heading-anchor" :to="getNewsUrl(item)">Info</router-link>
              </button>
            </div>
          </div>
        </div>
        <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no available news so far.</h3>
      </div>
    </div>
    <button class="btn btn-circle btn-lg btn-bottom" id="add-news" v-on:click="$router.push('/news/add')">
      <i class="glyphicon glyphicon-pencil"></i>
    </button>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'all-news',
  data: function () {
    return {
      news: [],
      search: '',
      nextPage: null,
      defaultClassLetter: 'A'
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path)
      .then((res) => {
        this.news = res.data.results

        if (res.data.next) {
          let index = res.data.next.indexOf('=') + 1
          this.nextPage = res.data.next.substr(index)
        }
      })
  },
  computed: {
    filteredNews: function () {
      let self = this
      let filtered = this.news.filter((el) => {
        el.content = helper.extractContent(el.content)
        return el.content.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          el.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      })
      if (filtered.length === 0) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
      return filtered
    }
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    relativeDate: function (date) {
      return moment(date).fromNow()
    },
    getNewsUrl: function (item) {
      let url = '/news'
      if (this.hasTeacherRights()) {
        url += item.class_letter === '' ? `/teachers/${item.class_number}/${this.defaultClassLetter}/${item.id}` : `/teachers/${item.class_number}/${item.class_letter}/${item.id}`
      } else {
        url += `/students/${item.id}`
      }
      return url
    },
    onInfinite: function () {
      if (this.nextPage) {
        requester.get(this.$route.path, {
          page: this.nextPage
        }).then((res) => {
          this.$set(this.$data, 'news', this.news.concat(res.data.results))
          this.filteredNews.concat(res.data.results)
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

<style>

</style>
