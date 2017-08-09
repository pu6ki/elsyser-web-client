<template>
  <div id="wrapper" class="col-md-10 col-md-offset-1">
    <form class="form-group form-wrapper" @submit.prevent="onSubmit">
      <section class="is-12">
        <label for="topic">Topic: </label>
        <p :class="{'control': true}">
          <span v-show="errors.has('topic')" class="help is-danger error">{{ errors.first('topic') }}</span>
          <input v-model="homework.topic" v-validate="'required|max:60'" :class="{'input': true, 'is-danger': errors.has('topic') }" type="text" class="form-control" id="topic" name="topic">
        </p>
        <div id="sandbox-container">
          <label for="deadline">Deadline: </label>
          <p :class="{'control': true}">
            <span v-show="errors.has('deadline')" class="help is-danger error">{{ errors.first('deadline') }}</span>
            <input v-model="homework.deadline" v-validate="'required'" type="date" class="form-control" id="deadline" name="deadline">
          </p>
        </div>
        <label for="details">Details: </label>
        <textarea v-model="homework.details" name="details" class="form-control" id="details" rows="4"></textarea>
        <button class="btn btn-lg btn-primary btn-block submit" id="add-exam">Edit Homework</button>
      </section>
    </form>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'edit-homework',
  data: function () {
    return {
      homework: {
        deadline: '',
        topic: '',
        clazz: {
          number: null,
          letter: ''
        },
        details: ''
      }
    }
  },
  beforeCreate: function () {
    requester.get(`/homeworks/${this.$route.params.id}`)
      .then((res) => {
        this.homework = res.data
      })
  },
  methods: {
    onSubmit: function () {
      this.$validator.validateAll()

      if (this.errors.any()) {
        this.$toastr('error', 'Invalid input data.', 'Error')
      } else {
        requester.put(`/homeworks/${this.$route.params.id}`, this.$data.homework)
          .then(() => {
            this.$toastr('success', 'Exam edited successfully.', 'Success.')
            this.$router.push(`/homeworks/${this.$route.params.id}`)
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
