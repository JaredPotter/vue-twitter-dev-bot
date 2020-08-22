require('dotenv').config();
const axios = require('axios');
const Twitter = require('twitter');
const fs = require('fs');
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY;
const TWITTER_ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN_KEY;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const twitterClient = new Twitter({
    consumer_key: TWITTER_API_KEY,
    consumer_secret: TWITTER_API_SECRET_KEY,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
});
// const imageUrl =
//     'https://firebasestorage.googleapis.com/v0/b/vue-twitter-dev-bot.appspot.com/o/images%2F9e28222e-f732-4030-85e9-9a0d0c1c5f2b?alt=media&token=a70141d7-5f67-46c8-b793-168b03f49384';

async function startUpload(mediaUrl) {
    console.log('startUpload() called');
    console.log(mediaUrl);
    const response = await axios.get(mediaUrl);

    const mediaType = response.headers['content-type'];
    const mediaSize = response.headers['content-length'];

    console.log('mediaType: ' + mediaType);
    console.log('mediaSize: ' + mediaSize);

    await download_image(mediaUrl, '/tmp/tempImage');
    const mediaData = fs.readFileSync('/tmp/tempImage');

    const stats = fs.statSync('/tmp/tempImage');
    const fileSizeInBytes = stats['size'];
    console.log('fileSizeBytes: ' + fileSizeInBytes);


    console.log('mediaType: ' + mediaType);
    console.log('mediaSize: ' + mediaSize);

    const initParams = {
        command: 'INIT',
        total_bytes: mediaSize,
        media_type: mediaType,
    };
    let initUploadResponse;

    try {
        initUploadResponse = await twitterPost('media/upload', initParams);
    } catch (error) {
        console.log(error);

        throw error;
    }

    let mediaId = initUploadResponse.media_id_string;

    if (!mediaId) {
        throw 'mediaId is undefined';
    }

    console.log('mediaId: ' + mediaId);

    const appendParams = {
        command: 'APPEND',
        media_id: mediaId,
        media: mediaData,
        segment_index: 0,
    };

    console.log('NOW UPLOADING');

    await twitterPost('media/upload', appendParams);

    console.log('STILL GOOD! mediaId: ' + mediaId);

    const finalizeUploadParams = {
        command: 'FINALIZE',
        media_id: mediaId,
    };

    try {
        await twitterPost('media/upload', finalizeUploadParams);
    } catch (error) {
        console.log(error);

        throw error;
    }

    console.log('FINISHED UPLOADING! mediaId: ' + mediaId);

    return mediaId;
}

module.exports.startUpload = startUpload;

async function download_image(url, image_path) {
    const writer = fs.createWriteStream(image_path);
    const response = await axios({ url, responseType: 'stream' });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function twitterPost(endpoint, params) {
    console.log('Endpoint: ' + endpoint);

    return new Promise((resolve, reject) => {
        twitterClient.post(endpoint, params, (error, data) => {
            if (error && error.length > 0) {
                for (const e of error) {
                    console.log('Error Message: ' + e.message);
                    console.log('Error Code: ' + e.code);
                }

                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}
