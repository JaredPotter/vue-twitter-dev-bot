<template>
    <div class="login-container">
        Please Login
        <label class="field">
            Username:
            <input type="text" v-model="username" />
        </label>
        <label class="field">
            Password:
            <input type="password" v-model="password" />
        </label>
        <button @click="handleLoginClick()">Login</button>
    </div>
</template>

<script>
import firebase from 'firebase';
const auth = firebase.auth();

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    mounted() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.$store.commit('setUser', user);
                this.$router.push('/');
            }
        });
    },
    methods: {
        handleLoginClick() {
            auth.signInWithEmailAndPassword(this.username, this.password)
                .then((user) => {
                    this.$store.commit('setUser', user);
                    // this.$store.dispatch('login', user);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss">
.login-container {
    display: flex;
    flex-direction: column;
}
</style>
