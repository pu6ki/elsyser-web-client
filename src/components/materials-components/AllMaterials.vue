<template>
  <div id="wrapper">
    <div class="row" v-if="materials.length > 0">
      <div class="col-md-10 col-md-offset-1 text-center search-container">
        <label for="search">Search: </label>
        <input type="text" id="search" class="form-control" v-model="search">
      </div>
      <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1">
        <div class="panel panel-primary" v-for="material in filteredMaterials" :key="material.id">
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
        <infinite-loading @infinite="onInfinite" ref="infiniteLoading">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
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
</template>

<script>
import requester from '../../utils/requester'
import helper from '../../utils/helper'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'all-materials',
  data: function () {
    return {
      materials: [],
      search: '',
      nextPage: null
    }
  },
  computed: {
    filteredMaterials: function () {
      let self = this
      let filtered = this.materials.filter((material) => {
        material.content = helper.extractContent(material.content)
        return material.content.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          material.subject.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          material.title.toLowerCase().indexOf(self.search.toLowerCase()) >= 0 ||
          material.section.toLowerCase().indexOf(self.search.toLowerCase()) >= 0
      })
      if (filtered.length === 0 && this.$refs.infiniteLoading) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
      return filtered
    }
  },
  beforeMount: function () {
    requester.get('/materials')
      .then((res) => {
        this.materials = res.data.results

        if (res.data.next) {
          let index = res.data.next.indexOf('=') + 1
          this.nextPage = res.data.next.substr(index)
        }
      })
  },
  methods: {
    hasTeacherRights: function () {
      return helper.isTeacher(this.localStorage.elsyserToken)
    },
    onInfinite: function () {
      if (this.nextPage) {
        requester.get(this.$route.path + `?page=${this.nextPage}`)
          .then((res) => {
            this.$set(this.$data, 'materials', this.news.concat(res.data.results))
            this.filteredMaterials.concat(res.data.results)
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
#content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
