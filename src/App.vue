<template>
  <div id="app">
    <div>
      <router-link to="/" v-if="user">Home</router-link>
      <router-link v-if="!user" to="/login">Login</router-link>
      <button @click="logoutUser()" v-if="user">Logout</button>
    </div>
    <h1>Jared's Vue Twitter Dev Bot</h1>
    <h3>Powered by Vue, Twitter APIs, and Firebase</h3>
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
import firebase from 'firebase';


export default {
  name: 'App',
  computed: {
    user: function() {
      return this.$store.getters.auth;
    }
  },
  methods: {
    logoutUser() {
      const auth = firebase.auth();
      this.$store.commit('setUser', null);
      auth.signOut();
      this.$router.push('/login');
    }
  }
}
</script>

<style>
html {
  background: #15202B;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  
}
</style>
