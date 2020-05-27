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
</style>
