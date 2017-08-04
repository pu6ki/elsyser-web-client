<template>
  <div id="addExam" class="row">
    <div id="wrapper" class="col-md-10 col-md-offset-1">
      <form class="form-group form-wrapper" @submit.prevent="onSubmit">
        <section class="is-12">
          <label for="topic">Topic: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
            <input v-model="topic" v-validate="'required|max:60'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic">
          </p>
          <label for="student-class-number">Student class number: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('studentClassNumber')" class="help is-danger error">Please select class number</span>
            <select v-model="clazz.number" v-validate="'required'" class="form-control" name="studentClassNumber" id="studentClassNumber">
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </p>
          <label for="student-class-number">Student class letter: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('studentClassLetter')" class="help is-danger error">Please select class letter</span>
            <select v-model="clazz.letter" v-validate="'required'" class="form-control" name="studentClassLetter" id="studentClassLetter">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="V">V</option>
              <option value="G">G</option>
            </select>
          </p>
          <div id="sandbox-container">
            <label for="date">Date: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('date')" class="help is-danger error">{{ errors.first('date') }}</span>
              <input v-model="date" v-validate="'required'" type="date" class="form-control" id="date" name="date">
            </p>
          </div>
          <label for="details">Details: </label>
          <textarea v-model="details" name="details" class="form-control" id="details" rows="4"></textarea>
          <button class="btn btn-lg btn-primary btn-block submit" id="add-exam">Add Exam</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'addExam',
  data: function () {
    return {
      date: '',
      topic: '',
      clazz: {
        number: null,
        letter: ''
      },
      details: ''
    }
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.post('/exams', this.$data)
          .then(() => {
            this.$toastr('success', 'Exam added successfully.', 'Success.')
            this.$router.push('/exams/all')
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

<style>

</style>
