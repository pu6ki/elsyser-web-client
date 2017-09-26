<template>
  <div id="class-grades">
    <div class="panel panel-default">
      <div class="heading text-center panel-body">
        <h3>{{$route.params.classNumber}}{{$route.params.classLetter}} class</h3>
      </div>
    </div>
  
    <div id="table-wrapper">
      <table class="table table-responsive table-hover table-striped table-bordered">
        <thead>
          <tr>
            <th class="text-center">№</th>
            <th class="text-center">Name</th>
            <th class="text-center">Grades</th>
            <th class="text-center">Average Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="student.id">
            <td class="text-center">{{index + 1}}</td>
            <td class="text-center">{{student.firstName}} {{student.lastName}}</td>
            <td class="text-center">
              <span v-for="grade in student.grades" :key="grade">{{grade}}</span>
            </td>
            <td class="text-center"> {{student.averageGrade}} </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-circle btn-lg btn-bottom" id="add-grades" v-on:click="$router.push(`/grades/${$route.params.classNumber}/${$route.params.classLetter}/add`)">
        <i class="glyphicon glyphicon-pencil"></i>
      </button>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'class-grades',
  data: function () {
    return {
      grades: []
    }
  },
  computed: {
    students: function () {
      let students = [...new Set(this.grades.map(grade => grade.student.user.username))]
      let studentsWithGrades = []
      students.forEach((username) => {
        let student = {
          username,
          firstName: '',
          lastName: '',
          averageGrade: 0.0,
          grades: []
        }

        student.firstName = this.grades.filter(grade => grade.student.user.username === username).map(grade => grade.student.user.first_name)[0]
        student.lastName = this.grades.filter(grade => grade.student.user.username === username).map(grade => grade.student.user.last_name)[0]
        student.grades = this.grades.filter(grade => grade.student.user.username === username).map(grade => grade.value.toFixed(2))

        student.averageGrade = student.grades.reduce((a, b) => { return parseFloat(a) + parseFloat(b) })
        student.averageGrade = (student.averageGrade / student.grades.length).toFixed(2)

        student.grades = student.grades.join(', ')

        studentsWithGrades.push(student)
      })

      studentsWithGrades.sort((a, b) => {
        let firstNameA = a.firstName.toUpperCase()
        let firstNameB = b.firstName.toUpperCase()
        let lastNameA = a.lastName.toUpperCase()
        let lastNameB = b.lastName.toUpperCase()

        if (firstNameA < firstNameB) {
          return -1
        } else if (firstNameA > firstNameB) {
          return 1
        } else {
          if (lastNameA < lastNameB) {
            return -1
          } else if (lastNameA > lastNameB) {
            return 1
          } else {
            return 0
          }
        }
      })

      return studentsWithGrades
    }
  },
  beforeCreate: function () {
    requester.get(`/grades/${window.localStorage.getItem('elsyserTeacherSubjectId')}?class_number=${this.$route.params.classNumber}&class_letter=${this.$route.params.classLetter}`)
      .then((res) => {
        this.grades = res.data
      })
  }
}
</script>

<style scoped>
  #table-wrapper {
    margin-left: 5%;
    margin-right: 5%;    
  }
</style>
