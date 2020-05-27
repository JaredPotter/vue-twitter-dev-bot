<template>
    <div class="home-container">
        <TweetForm />
        <button @click="getTweets()">GET TWEETS</button>
        <div class="tweets">
            <div v-for="tweet in tweetList" :key="tweet.id" class="tweet">
                <div class="left">
                    <img class="profile-pic" v-if="!tweet.retweeted_status" :src="tweet.user.profile_image_url_https">
                    <img class="profile-pic" v-if="tweet.retweeted_status" :src="tweet.retweeted_status.user.profile_image_url_https">
                </div>
                <div class="right">
                    <div v-if="tweet.retweeted_status" class="retweeted-status">
                        <div class="retweet" >
                            {{ tweet.user.name }} Retweeted
                        </div>
                        <div class="username-handle-time">
                            <span class="username">{{ tweet.retweeted_status.user.name }}</span>
                            <span class="handle">@{{  tweet.retweeted_status.user.screen_name }}</span>
                            <span class="time-ago">TIME AGO {{ tweet.retweeted_status.created_at | formatDate }}</span>
                        </div>
                        <div class="status">
                            {{ tweet.retweeted_status.full_text }}
                        </div>
                    </div>
                    <div v-if="!tweet.retweeted_status" class="normal-status">
                        <div class="username-handle-time">
                            <span class="username">{{ tweet.user.name }}</span>
                            <span class="handle">@{{  tweet.user.screen_name }}</span>
                            <span class="time-ago">TIME AGO {{ tweet.created_at | formatDate }}</span>
                        </div>
                        <div class="status">
                            {{ tweet.full_text }}
                        </div>
                        <div v-if="tweet.entities && tweet.entities.media && tweet.entities.media.length > 0" class="media">
                            <div v-for="media of tweet.entities.media" :key="media.id_str">
                                <div v-if="media.type === 'photo'">
                                    <img :src="media.media_url_https">
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TweetForm from './TweetForm';
import axios from 'axios';
import firebase from 'firebase';
// eslint-disable-next-line no-unused-vars
import moment from 'moment';

export default {
    data() {
        return {
            tweetList: []
        };
    },
    components: {
        TweetForm,
    },
    middleware: 'authenticated',
    methods: {
        async getTweets() {
            const token = await firebase.auth().currentUser.getIdToken()

            axios
                .get(
                    'http://localhost:5001/vue-twitter-dev-bot/us-central1/tweets', { headers: { Authorization: `Bearer ${token}` }}
                )
                // eslint-disable-next-line no-unused-vars
                .then((response) => {
                    // eslint-disable-next-line no-debugger
                    debugger;
                    this.tweetList = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },
    filters: {
        formatDate(date) {
            const fromNow = moment(date).fromNow();

            return fromNow;
        }
    },
    mounted() {
        this.getTweets();
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

        .tweet {
            padding: 5px;
            display: flex;
            border-bottom: 1px solid rgb(56, 68, 77);

            .left {
                width: 10%;

                .profile-pic {
                    border-radius: 100px;                    
                }
            }

            .right {
                width: 90%;
                padding-left: 10px;
                .retweet {
                    display: flex;
                }

                .username-handle-time {
                    
                    .username {
                        font-weight: bold;
                    }

                }

                .status {
                    font-weight: bold;
                }


                .media {
                    img {
                        width: 507px;
                        border-radius: 25px;
                    }
                }


                .retweet, .handle, .time-ago {
                    color: rgb(136, 153, 166);
                }
            }
        }
    }
}
</style>