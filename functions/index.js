require('dotenv').config();
const functions = require('firebase-functions');
const Twitter = require('twitter');
const uploadMedia = require('./uploadMedia');
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY;
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

console.log(TWITTER_API_KEY);
console.log(TWITTER_API_SECRET_KEY);
console.log(TWITTER_ACCESS_TOKEN_KEY);
console.log(TWITTER_ACCESS_TOKEN_SECRET);

const twitterClient = new Twitter({
    consumer_key: TWITTER_API_KEY,
    consumer_secret: TWITTER_API_SECRET_KEY,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

exports.setDailyTweetTime = functions.https.onRequest((request, response) => {
    const time = getDailyTweetTime();
    addTweetTimeDoc(time);
    response.send(time);
});

exports.postDailyTweet = functions.https.onRequest((request, response) => {
    const result = postDailyTweet();
    response.send(result);
});

// firebase service account.
const admin = require('firebase-admin');
const serviceAccount = require('./vue-twitter-dev-bot-firebase-adminsdk-pquob-e675549e55.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://vue-twitter-dev-bot.firebaseio.com',
});
const db = admin.firestore();

exports.dailyJob = functions.pubsub.schedule('* 7 * * *').onRun((context) => {
    console.log(`IT'S 7:00AM - TIME TO DETERMINE POST TIME!`);

    const time = getDailyTweetTime();

    addTweetTimeDoc(time);
});

function addTweetTimeDoc(time) {
    const dateTime = new Date();
    dateTime.setUTCHours(time.hour + 6);
    dateTime.setUTCMinutes(time.minute);
    // dateTime.formatUTC()
    // dateTime.setUtc
    // const t = dateTime.getDate();

    const doc = {
        // timeToTweet: admin.firestore.Timestamp.fromDate(dateTime),
        timeToTweet: admin.firestore.Timestamp.fromDate(dateTime),
    };
    db.collection('tweetTime').add(doc);
}

function getDailyTweetTime() {
    const hour = getRndInteger(9, 16);
    const minute = getRndInteger(0, 59);

    return { hour, minute };
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.checkPostTweetTimetaskRunner = functions
    .runWith({ memory: '2GB' })
    .pubsub.schedule('1 * * * *')
    .onRun(async (context) => {
        postDailyTweet();
    });

async function postDailyTweet() {
    // Consistent timestamp
    const now = admin.firestore.Timestamp.now();    

    // Query all documents ready to perform
    const query = db
        .collection('tweetTime')
        .where('timeToTweet', '<=', now);

    const snapshot = await query.get();
    console.log('snapshot.size: ' + snapshot.size)
    if (snapshot.size > 0) {

        // Loop over documents and push job.
        snapshot.forEach(async (snapshot) => {
            // Randomly select tweet from queued_tweets
            const queuedTweetsQuery = db.collection('queued_tweets');
            const queuedTweetsSnapshot = await queuedTweetsQuery.get();

            const queuedTweetIds = [];

            queuedTweetsSnapshot.forEach((snapshot) => {
                queuedTweetIds.push(snapshot.id);
            });

            console.log('queuedTweetIds.length: ' + queuedTweetIds.length);

            const randomIndex = getRndInteger(0, queuedTweetIds.length - 1);
            console.log('randomIndex: ' + randomIndex);

            const tweetId = queuedTweetIds[randomIndex];
            const tweet = await (await db.collection('queued_tweets').doc(tweetId).get()).data();

            console.log('tweet: ' + JSON.stringify(tweet));

            let mediaIds = '';

            if(tweet && tweet.media_urls && tweet.media_urls.length > 0) {
                for(const url of tweet.media_urls) {
                    const mediaId = await uploadMedia.startUpload(url);
                    mediaIds += mediaId + ',';
                }
            }

            // TODO: post to twitter via API.
            const payload = {
                status: tweet.status,
            };

            console.log('mediaIds: ' + mediaIds);

            if(mediaIds) {
                
                payload['media_ids'] = mediaIds;
            }

            console.log('Posting Tweet: ' + JSON.stringify(payload));

            const twitterApiResponse = twitterClient.post('statuses/update', payload)
                .then(function (tweet) {
                console.log(tweet);
              })
              .catch(function (error) {
                if (error && error.length > 0) {
                    for(const e of error) {
                        console.log('Error Message: ' + e.message);
                        console.log('Error Code: ' + e.code);
                    }
                }
                throw error;
              });


            const id = snapshot.id;
            // await db.collection('tweetTime').doc(id).delete();
        });
    }
}

// https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
function uploadImage() {

}

// https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
function uploadGif() {

}

// https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
function uploadVideo() {

}

postDailyTweet();