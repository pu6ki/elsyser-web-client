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
      activationId: this.$route.params.activationId,
      msg: ''
    }
  },
  created: function () {
    requester.put(`/activate/${this.activationId}`)
      .then((res) => {
        this.msg = 'Your account had been activated. Redirecting...'
        setTimeout(() => {
          this.$router.push('/auth/login')
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
