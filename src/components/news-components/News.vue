<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary text-center">
          <div class="panel-heading">
            <strong>
              <span>{{news.title}}</span>
            </strong>
            <div v-show="isEditable(news)" class="pull-right edit">
              <span class="edit">
                <span class="glyphicon glyphicon-edit"></span>
              </span>
              <span class="delete">
                <span class="glyphicon glyphicon-trash"></span>
              </span>
            </div>
          </div>
          <div class="panel-body">
            <div>
              <span>
                <strong>
                  <i>{{news.content}}</i>
                </strong>
              </span>
            </div>
            <div>
              <hr /> Posted by
              <router-link :to="'/profile/' + news.author.id">
                <span>
                  <strong>
                    <i>{{news.author.username}}</i>
                  </strong>
                </span>
              </router-link>
              <span v-show="hasTeacherRights()">for
                <b>{{news.class_number}}
                  <span v-show="news.class_letter">{{news.class_letter}} class</span>
                </b>
              </span>
              <span> {{relativeDate(news.posted_on)}}</span>
  
              <span v-show="news.edited">(last edited {{relativeDate(news.last_edited_on)}})</span>
            </div>
          </div>
        </div>
  
        <div id="comments" v-if="news.comment_set">
          <div class="row comment" v-for="comment in news.comment_set" :key="comment.id">
            <div class="col-xs-3 col-sm-1 col-md-1 col-lg-1 img-container">
              <img class="user-photo" :src="comment.author_image">
            </div>
  
            <div class="col-xs-9 col-sm-11 col-sm-11 col-md-11 col-lg-11">
              <div class="comment-panel panel panel-default">
                <div class="panel-heading">
                  <router-link :to="'/profile/' + comment.author.id">
                    <strong>{{comment.author.username}}</strong>
                  </router-link>
                  commented {{relativeDate(comment.posted_on)}}
                  <span v-show="comment.edited">(last edited {{relativeDate(comment.last_edited_on)}})</span>
                  <div v-show="isEditable(comment)" class="pull-right edit-comments">
                    <span class="edit">
                      <span class="glyphicon glyphicon-edit"></span>
                    </span>
                    <span class="delete">
                      <span class="glyphicon glyphicon-trash"></span>
                    </span>
                  </div>
                </div>
                <div class="panel-body">
                  {{comment.content}}
                </div>
              </div>
            </div>
          </div>
          <button class="center-block" id="loadMore">Load More</button>
        </div>
      </div>
    </div>
    <button class="toTop btn btn-primary btn-circle btn-lg">
      <span class="glyphicon glyphicon-chevron-up"></span>
    </button>
  
    <form class="row form-wrapper" @submit.prevent="onSubmit()">
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1">
        <input type="text" v-model="comment.content" id="comment-content" class="form-control" placeholder="Add Comment">
        <button id="add-comment-button" class="btn btn-primary submit">Send
          <span class="glyphicon glyphicon-send"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import moment from 'moment'

export default {
  name: 'news',
  data: function () {
    return {
      news: {
        id: null,
        title: '',
        content: '',
        author: {
          id: null,
          username: '',
          first_name: '',
          last_name: '',
          email: ''
        },
        comment_set: [],
        posted_on: '',
        edited: false,
        last_edited_on: '',
        class_number: null,
        class_letter: ''
      },
      comment: {
        content: ''
      }
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path)
      .then((res) => {
        this.news = res.data
      })
      .catch(console.log)
  },
  mounted: function () {
    let vm = this
    let url = `${this.$route.path}/comments`
    setInterval(function () {
      requester.get(url)
        .then((res) => {
          if (vm.$data.news.comment_set.length !== res.data.count) {
            vm.$data.news.comment_set = res.data.results
          }
        })
    }, 1000)
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    relativeDate: function (date) {
      return moment(date).fromNow()
    },
    isEditable: function (item) {
      return this.localStorage.elsyserUsername === item.author.username
    },
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.post(`${this.$route.path}/comments`, this.$data.comment)
          .then(() => {
            this.$toastr('success', 'Comment added successfully.', 'Success.')
            this.comment = ''
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

<style scoped>
.comment-panel>.panel-heading:after,
.comment-panel>.panel-heading:before {
  content: " ";
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  border-color: transparent;
  border-style: solid solid outset;
  height: 0;
  width: 0;
  pointer-events: none;
}

.comment-panel>.panel-heading:after,
.comment-panel>.panel-heading:before {
  content: " ";
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  border-color: transparent;
  border-style: solid solid outset;
  height: 0;
  width: 0;
  pointer-events: none;
}

.panel-heading {
  color: white;
}

.panel-heading a:hover {
  color: gold
}

#comment-content {
  margin: 5px;
  max-width: 90%;
  display: inline;
}

#add-comment-button {
  display: inline;
}
</style>
