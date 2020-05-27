<template>
    <div class="tweet-container">
        <div class="left">
            <img
                class="profile-pic"
                :src="tweet.user.profile_image_url_https"
            />
        </div>
        <div class="right">
            <div v-if="isRetweet" class="retweet">
                {{ retweeterName }} Retweeted
            </div>
            <div class="username-handle-time">
                <span class="username">{{ tweet.user.name }}</span>
                <span class="handle">@{{ tweet.user.screen_name }}</span>
                <span class="time-ago">
                    - {{ tweet.created_at | formatDate }}</span
                >
            </div>
            <div class="status">
                {{ tweet.full_text }}
            </div>
            <div
                v-if="
                    tweet.entities &&
                    tweet.entities.media &&
                    tweet.entities.media.length > 0
                "
                class="media"
            >
                <div v-for="media of tweet.entities.media" :key="media.id_str">
                    <div v-if="media.type === 'photo'">
                        <img :src="media.media_url_https" />
                    </div>
                </div>
            </div>
            <div class="actions">
                <button>COMMENT</button>
                <button @click="showRetweetOptions()">RETWEET</button> {{ tweet.retweet_count }}
                <button>LIKE</button> {{ tweet.favorite_count }}
                <button>SHARE</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {};
    },
    methods: {
        showRetweetOptions() {
            // TODO: implement.
        }
    },
    filters: {
        formatDate(date) {
            const fromNow = moment(date).fromNow();

            return fromNow;
        },
    },
    props: {
        tweet: Object,
        isRetweet: Boolean,
        retweeterName: String
    },
};
</script>

<style lang="scss">
.tweet-container {
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
            text-align: left;

            .username {
                font-weight: bold;
                margin-right: 5px;
            }

            .handle {
                margin-right: 5px;
            }
        }

        .status {
            font-weight: bold;
            text-align: left;
        }

        .media {
            img {
                width: 507px;
                border-radius: 25px;
            }
        }

        .retweet,
        .handle,
        .time-ago {
            color: rgb(136, 153, 166);
        }

        .actions {
            display: flex;
            justify-content: space-evenly;
        }
    }
}
</style>
