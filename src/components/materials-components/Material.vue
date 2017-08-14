<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-if="material">
        <div class="panel panel-primary">
          <div class="panel-heading center-text">
            <strong>
              {{material.section}}
            </strong>
            <div class="pull-right edit" v-if="isEditable()">
              <span class="edit" v-on:click="$router.push('/materials/' + material.subject.id + '/' + material.id + '/edit')">
                <span class="glyphicon glyphicon-edit"></span>
              </span>
              <span class="delete" v-on:click="showDeleteConfirm()">
                <span class="glyphicon glyphicon-trash"></span>
              </span>
            </div>
          </div>
          <div class="panel-body center-text">
            <h4>{{material.title}}</h4>
            <article v-html="material.content">
            </article>
            <br />
            <div class="embed-responsive embed-responsive-16by9" v-if="material.video_url">
              <iframe class="embed-responsive-item" :src="makeYouTubeVideoEmbeddable(material.video_url)" allowfullscreen></iframe>
            </div>
            <br /> Posted by
            <router-link :to="'/profile/' + material.author.user.id">
              <span>
                <strong>
                  <i>{{material.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'material',
  data: function () {
    return {
      material: {
        id: null,
        section: '',
        title: '',
        subject: {
          id: null,
          title: ''
        },
        content: '',
        video_url: '',
        author: {
          user: {
            username: '',
            id: null
          }
        }
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/materials/${this.$route.params.subjectId}/${this.$route.params.id}`)
      .then((res) => {
        this.$data.material = res.data
        this.$data.material.content = helper.insertLineBreaks(res.data.content)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    isEditable: function () {
      return this.$data.material.author.user.username === this.localStorage.elsyserUsername
    },
    makeYouTubeVideoEmbeddable: function (videoUrl) {
      return helper.makeYouTubeVideoEmbeddable(videoUrl)
    },
    showDeleteConfirm: function () {
      let subjectId = this.$route.params.subjectId
      let materialId = this.$route.params.id
      let router = this.$router
      window.swal({
        title: 'Are you sure?',
        text: 'This material will be deleted forever.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      },
        function () {
          requester.delete(`/materials/${subjectId}/${materialId}`)
            .then(() => {
              window.swal({
                title: 'Deleted!',
                text: 'The exam has been deleted.',
                type: 'success'
              }, function () {
                router.push('/materials/all')
              })
            })
        })
    }
  }
}
</script>

<style>

</style>
