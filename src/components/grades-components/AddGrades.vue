<template>
  <div id="add-grades">
    <div class="panel panel-default">
      <div class="heading text-center panel-body">
        <h3>Add grades for {{$route.params.classNumber}}{{$route.params.classLetter}} class</h3>
      </div>
    </div>
    <form @submit.prevent="onSubmit" id="table-wrapper">
      <table class="table table-responsive table-hover table-striped table-bordered">
        <thead>
          <tr>
            <th class="text-center">Name
              <!-- <button type="button" class="btn btn-success" id="add-another-grade-button">+</button> -->
            </th>
            <th class="text-center">Grade</th>
          </tr>
        </thead>
        <tbody id="grades">
          <tr class="grade-field">
            <td class="text-center">
              <v-select label="fullName" :value.sync="selectedStudent" :options="students"></v-select>
            </td>
            <td class="text-center">
              <input class="form-control text-center grade" type="number" min="2" max="6" v-model="value">
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="onSubmit" type="button" class="btn btn-large center-block btn-primary submit" id="add-grades-button">Add grades</button>
    </form>
  </div>
</template>

<script>
import requester from '../../utils/requester'
import vSelect from 'vue-select'

export default {
  name: 'add-grades',
  data: function () {
    return {
      value: '',
      students: [],
      selectedStudent: null
    }
  },
  beforeCreate: function () {
    requester.get(`/students?class_number=${this.$route.params.classNumber}&class_letter=${this.$route.params.classLetter}`)
    .then((res) => {
      res.data.results.forEach(function (element) {
        let student = {
          fullName: '',
          id: null
        }
        student.fullName = element.user.first_name + ' ' + element.user.last_name
        student.id = element.user.id
        this.students.push(student)
      }, this)

      this.students.sort((a, b) => {
        if (a.fullName.toUpperCase() < b.fullName.toUpperCase()) return -1
        else if (a.fullName.toUpperCase() > b.fullName.toUpperCase()) return 1
        else return 0
      })
    })
  },
  methods: {
    onSubmit: function () {
      requester.post(`/grades/${this.localStorage.elsyserTeacherSubjectId}/${this.$children[0].mutableValue.id}`, this.$data)
        .then((res) => {
          this.$toastr('success', 'Grade added successfully.', 'Success.')
          this.$router.push(`/grades/${this.$route.params.classNumber}/${this.$route.params.classLetter}`)
        })
        .catch((err) => {
          console.log(err)
          this.$toastr('error', 'Grade could not be added.', 'Error.')
        })
    }
  },
  components: { vSelect }
}
</script>

<style scoped>
#table-wrapper {
  margin-left: 5%;
  margin-right: 5%;
}
</style>
