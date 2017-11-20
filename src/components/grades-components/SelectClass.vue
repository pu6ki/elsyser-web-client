<template>
  <div id="select-class" class="row">
    <div class="col-md-10 col-md-offset-1">
      <div v-for="(concreteClasses, wholeClass) in classes" :key="concreteClasses.id">
        <h3 class="text-center class-heading">{{concreteClasses[0].number}}th classes</h3>
        <div v-for="concreteClass in concreteClasses" :key="concreteClass.id">
          <div class="col-lg-2 col-lg-offset-1 col-md-2 col-md-offset-1 col-sm-12 concrete-class" :id="concreteClass.number + concreteClass.letter" v-on:click="$router.push(`/grades/${concreteClass.number}/${concreteClass.letter}`)">
            <div class="panel panel-default info-panel select-class text-center">
              <router-link :to="`/grades/${concreteClass.number}/${concreteClass.letter}`">
                {{concreteClass.number}}{{concreteClass.letter}}
              </router-link>
            </div>
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
  name: 'select-class',
  data: function () {
    return {
      classes: []
    }
  },
  beforeCreate: function () {
    if (helper.isTeacher(window.localStorage.getItem('elsyserToken'))) {
      requester.get('/classes')
        .then((res) => {
          this.classes = res.data
        })
    } else {
      this.$router.push('/grades/all')
    }
  }
}
</script>

<style scoped>
.concrete-class {
  padding: 0;
}

.panel {
  margin: 0;
}

.select-class a {
  font-size: 25px;
  color: white;
  line-height: 90px;
}

.select-class:hover a {
  color: gold;
}

.select-class {
  height: 100px;
  background-color: rebeccapurple;
  color: white;
  font-size: 25px;
  line-height: 90px;
}

.select-class:hover {
  cursor: pointer;
}

.class-heading {
  margin: 30px;
}
</style>
