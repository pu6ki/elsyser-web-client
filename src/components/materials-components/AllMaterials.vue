<template>
  <div id="wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1" v-if="materials">
        <div class="panel panel-primary" v-for="material in materials" :key="material.id">
          <div class="panel-heading material-panel-heading text-center">
            <strong>
              {{material.subject.title}}
            </strong>
          </div>
          <div class="panel-body text-center">
            <h4 class="material-title">{{material.title}}</h4>
            <h5 class="material-section">{{material.section}}</h5>
            <div id="content">{{material.content}}</div>
            <hr /> Posted by
            <router-link :to="'/profile/' + material.author.user.id">
              <span>
                <strong>
                  <i>{{material.author.user.username}}</i>
                </strong>
              </span>
            </router-link>
            <div>
              <button id="info-button" class="btn btn-primary" v-on:click="$router.push('/materials/' + material.subject.id + '/' + material.id)">
                <router-link :to="'/materials/' + material.subject.id + '/' + material.id" class="heading-anchor">Info</router-link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="panel panel-default" v-else>
        <div class="panel-body">
          <h3 class="text-center">There are no available materials so far.</h3>
        </div>
      </div>
      <button v-if="hasTeacherRights()" type="button" class="btn btn-primary btn-circle btn-lg" id="add-material" v-on:click="$router.push('/materials/add')">
        <i class="glyphicon glyphicon-pencil"></i>
      </button>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'

export default {
  name: 'all-materials',
  data: function () {
    return {
      materials: null
    }
  },
  beforeMount: function () {
    requester.get('/materials')
      .then((res) => {
        this.materials = res.data
      })
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    }
  }
}
</script>

<style scoped>
#content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
