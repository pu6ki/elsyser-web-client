<template>
  <div id="activateAccount">
    <h2> {{ msg }}</h2>
  </div>
</template>

<script>
import requester from '../../utils/requester'

export default {
  name: 'activateAccount',
  data () {
    return {
      id: this.$route.params.id,
      activationId: this.$route.params.activationId,
      msg: ''
    }
  },
  created: function () {
    requester.put(`/activate/${this.id}/${this.activationId}/`)
      .then((res) => {
        this.msg = 'Your account had been activated. Redirecting...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      })
      .catch(err => {
        this.msg = err.data
      })
  }
}
</script>

<style scoped>

</style>
