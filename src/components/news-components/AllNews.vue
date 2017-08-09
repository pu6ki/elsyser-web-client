<template>
  <div id="wrapper">
    <div id="news" v-if="news.length > 0">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-for="item in news" :key="item.id">
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
                <strong v-if="item.comments_count > 0">
                  <i>{{item.comments_count}}</i>
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
      </div>
    </div>
    <div class="panel panel-default" v-else>
      <div class="panel-body">
        <h3 class="text-center">There are no available news so far.</h3>
      </div>
    </div>
    <button class="btn btn-circle btn-lg btn-bottom" id="add-news">
      <i class="glyphicon glyphicon-pencil"></i>
    </button>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'

export default {
  name: 'all-news',
  data: function () {
    return {
      news: []
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path)
      .then((res) => {
        this.news = res.data
      })
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
        url += `/teachers/${item.class_number}`
        if (!item.class_letter) {
          item.class_letter = 'A'
        }
        url += `/${item.class_letter}/${item.id}`
      } else {
        url += `/students/${item.id}`
      }
      return url
    }
  }
}
</script>

<style>

</style>
