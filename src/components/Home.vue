<template>
    <div class="home-container">
        <TweetForm />
        <button @click="getTweets()">GET TWEETS</button>
        <div class="tweets">
            <div v-for="tweet in tweetList" :key="tweet.id">
                <Tweet v-if="tweet.retweeted_status" :tweet="tweet.retweeted_status" :isRetweet="tweet.retweeted_status ? true : false" :retweeterName="tweet.user.name"/>
                <Tweet v-else="" :tweet="tweet" :isRetweet="false" />
            </div>
        </div>
    </div>
</template>

<script>
import TweetForm from './TweetForm';
import Tweet from './Tweet';
import axios from 'axios';
import firebase from 'firebase';
// eslint-disable-next-line no-unused-vars


export default {
    data() {
        return {
            tweetList: []
        };
    },
    components: {
        TweetForm, Tweet
    },
    middleware: 'authenticated',
    methods: {
        async getTweets() {
            const token = await firebase.auth().currentUser.getIdToken()

            axios
                .get(
                    // 'http://localhost:5001/vue-twitter-dev-bot/us-central1/tweets', 
                    'https://us-central1-vue-twitter-dev-bot.cloudfunctions.net/tweets', 
                    { headers: { Authorization: `Bearer ${token}` }}
                )
                // eslint-disable-next-line no-unused-vars
                .then((response) => {
                    // eslint-disable-next-line no-debugger
                    // debugger;
                    this.tweetList = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },

    mounted() {
        // this.getTweets();
    },
};
</script>

<style lang="scss">
.home-container {
    

    .tweets {
        width: 600px;
        border-top: 1px solid rgb(56, 68, 77);
        border-left: solid rgb(56, 68, 77) 1px;
        border-right: solid rgb(56, 68, 77) 1px;

    }
}
</style>