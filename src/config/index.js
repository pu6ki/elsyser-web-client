import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'
import reactiveStorage from 'vue-reactivestorage'
import VueSimplemde from 'vue-simplemde'

Vue.use(VeeValidate)

Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultType: 'info',
  defaultTimeout: 2500
})

Vue.use(reactiveStorage, [
  'elsyserToken',
  'elsyserId',
  'elsyserUsername',
  'elsyserTeacherSubjectId'
])

Vue.use(VueSimplemde)
