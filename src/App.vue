<template>
  <div id="app">
    <h1>Jared's Vue Twitter Dev Bot</h1>
    <h3>Powered by Vue, Twitter APIs, and Firebase</h3>
    <img alt="Vue logo" src="./assets/logo.png">
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home';


export default {
  name: 'App',
  components: {
    Home
  },
  mounted() {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
