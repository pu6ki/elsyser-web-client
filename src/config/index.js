import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueToastr from '@deveodk/vue-toastr'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'

Vue.use(VeeValidate)
Vue.use(VueToastr, {
  defaultPosition: 'toast-top-right',
  defaultType: 'info',
  defaultTimeout: 2500
})
