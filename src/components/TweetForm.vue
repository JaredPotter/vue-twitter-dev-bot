<template>
    <div class="tweet-form-container">
        <textarea
            v-model="status"
            v-focus
            placeholder="What's happening?"
            class="status"
        ></textarea>
        <div>Remaining Characters: {{ remainingCharacters }}</div>
        <button
            @click="queueTweet()"
            class="twitter-button"
            :class="{ disabled: !status }"
            :disabled="!status"
        >
            QUEUE TWEET
        </button>
        <h3>TIPS</h3>
        <div>Links magically load preview content</div>
        <div># Hashtags # work as expected</div>
        <div>Only 1 blank link - \r\n\r\n will get displayed by Twitter</div>
        <input
            type="file"
            @change="handleFileInputChange"
            multiple
            class="file-input"
            ref="imageInput"
        />
        <ul>
            <li>Up to 4 Images - 5 MB each</li>
            <li>1 GIF - 15 MB</li>
            <li>1 Video - 15 MB</li>
        </ul>
        <div>CATEGORY</div>
        <select v-model="category" class="category">
            <option value="devTip">Dev Tip</option>
            <option value="devFunny">Dev Funny</option>
            <option value="devOptinion">Dev Opinion</option>
            <option value="html5Magic">HTML 5 Magic</option>
        </select>
        <div v-if="isUploading">WE ARE CURRENTLY UPLOADING!</div>
        <button
            @click="postTweet()"
            class="twitter-button"
            :class="{ disabled: !status }"
            :disabled="!status"
        >
            POST TWEET
        </button>
    </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_appId,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

import { v4 as uuidv4 } from 'uuid';

export default {
    data() {
        return {
            status: '',
            files: [],
            isUploading: false,
            category: 'devTip',
        };
    },
    computed: {
        remainingCharacters() {
            return 250 - this.status.length;
        }
    },
    methods: {
        handleFileInputChange(event) {
            const files = event.target.files;
            this.files = files;
        },
        async queueTweet() {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const status = this.status.replace(/\n/g, `\\r\\n`); 
            const tweet = {
                created: timestamp,
                status: status,
                media_urls: [],
                category: this.category,
            };

            const mediaUrls = [];

            if (this.files.length > 0) {
                for (const file of this.files) {
                    const uuid = uuidv4();
                    const fileRef = storageRef.child(`images/${uuid}`);

                    const metadata = {
                        contentType: file.type,
                    };

                    this.isUploading = true;

                    const uploadTaskSnapshot = await fileRef.put(
                        file,
                        metadata
                    );

                    const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

                    mediaUrls.push(downloadURL);
                }

                this.$refs.imageInput.value = null;

                this.isUploading = false;
            }

            if (mediaUrls.length > 0) {
                tweet.media_urls = mediaUrls;
            }

            await db.collection('queued_tweets').add(tweet);

            this.status = '';
        },
        postTweet() {},
    },
    directives: {
        focus: {
            // directive definition
            inserted: function (el) {
                el.focus();
            },
        },
    },
};
</script>

<style lang="scss">
.tweet-form-container {
    // width: 30rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .status {
        width: 20rem;
        height: 4rem;
        font-size: 1.2rem;
        background: #15202B;
        color: white;
        font-weight: bold;
        border: 1px solid rgb(56, 68, 77);
        padding: 8px;
    }

    .status,
    .file-input,
    .category {
        margin-bottom: 1rem;
    }

    .category {
        width: 20rem;
        font-size: 2rem;
    }

    .file-input {
    }

    .twitter-button {
        cursor: pointer;
        background-color: rgb(29, 161, 242);
        border-radius: 1rem;
        color: white;
        width: 20rem;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Ubuntu, 'Helvetica Neue', sans-serif;
    }

    .disabled {
        opacity: 0.4;
        cursor: unset;
    }
}
</style>
