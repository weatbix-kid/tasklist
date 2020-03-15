import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as firebase from 'firebase/app'
import './registerServiceWorker'

const firebaseConfig = JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG)

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false

new Vue({
  data () {
    return {
      userData: {
        settings: {},
        tasklists: []
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    save () {
      console.log('saving')
      localStorage.setItem('tlUserData', JSON.stringify(this.userData))
    },
    load () {
      console.log('load triggered')
      if (localStorage.getItem('tlUserData')) {
        console.log('loaded user data')
        var data = JSON.parse(localStorage.getItem('tlUserData'))
        console.log(data)
        this.userData = data
      }
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
