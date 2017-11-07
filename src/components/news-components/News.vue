<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary">
          <div class="panel-heading text-center">
            <strong>
              <span id="news-title">{{news.title}}</span>
            </strong>
            <div v-show="isEditable(news)" class="pull-right edit">
              <span class="edit" v-on:click="$router.push(`${$route.path}/edit`)">
                <span class="glyphicon glyphicon-edit"></span>
              </span>
              <span class="delete" v-on:click="showNewsDeleteConfirm()">
                <span class="glyphicon glyphicon-trash"></span>
              </span>
            </div>
          </div>
          <div class="panel-body">
            <div>
              <span>
                <strong>
                  <i v-html="news.content"></i>
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
                  <span v-show="news.class_letter">{{news.class_letter}}</span> class</b>
              </span>
              <span> {{relativeDate(news.posted_on)}}</span>

              <span v-show="news.edited">(last edited {{relativeDate(news.last_edited_on)}})</span>
            </div>
          </div>
        </div>

        <div id="comments" v-if="computedComments">
          <div class="row comment" v-for="comment in computedComments" :key="comment.id">
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
                    <span class="edit" v-on:click="toggleShowCommentEditForm(comment)">
                      <span class="glyphicon glyphicon-edit"></span>
                    </span>
                    <span class="delete" v-on:click="showCommentDeleteConfirm(comment.id)">
                      <span class="glyphicon glyphicon-trash"></span>
                    </span>
                  </div>
                </div>
                <div class="panel-body" v-show="!comment.showCommentEditForm">
                  {{comment.content}}
                </div>
                <form class="panel-body form-wrapper" @submit.prevent="editComment(comment)" v-show="comment.showCommentEditForm">
                  <input v-model="comment.content" class="form-control" id="new-comment-content" type="text" :value="comment.content">
                  <button id="save-button" class="btn btn-primary submit">Save</button>
                </form>
              </div>
            </div>
          </div>
          <button class="center-block btn btn-primary" @click="loadMore" id="loadMore">Load More</button>
        </div>
      </div>
    </div>

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
        comments: [],
        posted_on: '',
        edited: false,
        last_edited_on: '',
        class_number: null,
        class_letter: '',
        totalComments: null
      },
      comment: {
        content: '',
        showCommentEditForm: false
      },
      interval: null,
      nextPage: null
    }
  },
  computed: {
    computedComments: function () {
      return this.news.comments
    }
  },
  beforeCreate: function () {
    requester.get(this.$route.path)
      .then((res) => {
        this.news = res.data
        this.news.content = helper.insertLineBreaks(res.data.content)
        return requester.get(this.$route.path + '/comments')
      })
      .then((res) => {
        if (res.data.next) {
          let index = res.data.next.indexOf('=') + 1
          this.nextPage = res.data.next.substr(index)
        }
        this.news.totalComments = res.data.count
        this.news.comments = res.data.results
      })
      .catch(console.log)
  },
  mounted: function () {
    let vm = this
    let url = `${this.$route.path}/comments`
    this.interval = setInterval(function () {
      requester.get(url)
        .then((res) => {
          if (vm.$data.news.totalComments !== res.data.count) {
            vm.$set(vm.$data.news, 'comments', res.data.results)
            vm.$data.news.totalComments = res.data.count
            if (res.data.next) {
              let index = res.data.next.indexOf('=') + 1
              this.nextPage = res.data.next.substr(index)
            }
          }
        })
    }, 1000)
  },
  beforeDestroy: function () {
    clearInterval(this.interval)
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
            this.comment.content = ''
            return requester.get(`${this.$route.path}/comments`)
          })
          .then((res) => {
            this.$set(this.news, 'comments', res.data.results)
            if (res.data.next) {
              let index = res.data.next.indexOf('=') + 1
              this.nextPage = res.data.next.substr(index)
            }
          })
          .catch((err) => {
            console.log(err)
            this.$toastr('error', 'Invalid data.')
          })
      }
    },
    toggleShowCommentEditForm: function (comment) {
      let temp = comment.showCommentEditForm
      this.$set(comment, 'showCommentEditForm', !comment.showCommentEditForm)
      return temp
    },
    editComment: function (comment) {
      comment.edited = true
      requester.put(`${this.$route.path}/comments/${comment.id}`, comment)
        .then((res) => {
          this.$toastr('success', 'Comment editted successfully.', 'Success.')
          this.toggleShowCommentEditForm(comment)
        })
    },
    showNewsDeleteConfirm: function () {
      let url = this.$route.path
      let router = this.$router
      let isTeacher = this.hasTeacherRights()
      window.swal({
        title: 'Are you sure?',
        text: 'This news will be deleted forever.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      },
        function () {
          requester.delete(url)
            .then(() => {
              window.swal({
                title: 'Deleted!',
                text: 'The news has been deleted.',
                type: 'success'
              }, function () {
                let redirectUrl = isTeacher ? '/news/teachers' : '/news/students'
                router.push(redirectUrl)
              })
            })
        })
    },
    showCommentDeleteConfirm: function (id) {
      let url = `${this.$route.path}/comments/${id}`
      let vm = this
      window.swal({
        title: 'Are you sure?',
        text: 'This comment will be deleted forever.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      }, function () {
        requester.delete(url)
          .then(() => {
            window.swal({
              title: 'Deleted!',
              text: 'The comment has been deleted.',
              type: 'success'
            })
            for (let i = 0; i < vm.news.comments.length; i += 1) {
              if (vm.news.comments[i].id === id) {
                vm.news.comments.splice(i, 1)
              }
            }
          })
      })
    },
    loadMore: function () {
      if (this.nextPage) {
        requester.get(this.$route.path + `/comments`, {
          page: this.nextPage
        }).then((res) => {
          this.$set(this.news, 'comments', this.news.comments.concat(res.data.results))
          if (res.data.next) {
            let index = res.data.next.indexOf('=') + 1
            this.nextPage = res.data.next.substr(index)
          } else {
            this.nextPage = null
          }
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

.comment-panel>.panel-heading {
  background-color: #4a148c !important
}

.panel-heading {
  color: white;
}

.panel-heading a {
  color: white;
  font-weight: bolder;
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

#news-title {
  margin-left: 35px;
}
</style>
