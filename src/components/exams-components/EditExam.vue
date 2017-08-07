<template>
  <div id="addExam" class="row">
    <div id="wrapper" class="col-md-10 col-md-offset-1">
      <form class="form-group form-wrapper" @submit.prevent="onSubmit">
        <section class="is-12">
          <label for="topic">Topic: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
            <input v-model="topic" v-validate="'required|max:60'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic" :value="topic">
          </p>
          <div id="sandbox-container">
            <label for="date">Date: </label>
            <p :class="{'control': true}">
              <span v-show="errors.has('date')" class="help is-danger error">{{ errors.first('date') }}</span>
              <input v-model="date" v-validate="'required'" type="date" class="form-control" id="date" name="date" :value="date">
            </p>
          </div>
          <label for="details">Details: </label>
          <textarea v-model="details" name="details" class="form-control" id="details" rows="4" :v-text="details"></textarea>
          <button class="btn btn-lg btn-primary btn-block submit" id="add-exam">Edit Exam</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'editExam',
  data: function () {
    return {
      date: '',
      topic: '',
      details: '',
      id: null
    }
  },
  beforeCreate: function () {
    requester.get(`/exams/${this.$route.params.id}`)
      .then(res => {
        this.$data.date = res.data.date
        this.$data.topic = res.data.topic
        this.$data.details = res.data.details
        this.$data.id = res.data.id
      })
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.put(`/exams/${this.id}`, this.$data)
          .then((res) => {
            console.log(res)
            this.$toastr('success', 'Exam edited successfully.', 'Success.')
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

<<style scoped>

</style>
