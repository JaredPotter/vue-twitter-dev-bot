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
debugger;
// const imageUrl =
//     'https://firebasestorage.googleapis.com/v0/b/vue-twitter-dev-bot.appspot.com/o/images%2F9e28222e-f732-4030-85e9-9a0d0c1c5f2b?alt=media&token=a70141d7-5f67-46c8-b793-168b03f49384';


async function startUpload(mediaUrl) {
    console.log(mediaUrl);
    const response = await axios.get(mediaUrl);
    
    const mediaType = response.headers['content-type'];
    const mediaSize = response.headers['content-length'];
    
    await download_image(mediaUrl, 'tempImage');
    const mediaData  = fs.readFileSync('tempImage');
    
    // const mediaData = response.data;
    
    // console.log(mediaData);
    
    console.log('mediaType: ' + mediaType);
    console.log('mediaSize: ' + mediaSize);
    
    const initParams = {
        command: 'INIT',
        total_bytes: mediaSize,
        media_type: mediaType,
    };
    const initUploadResponse = await twitterPost('media/upload', initParams);
    let mediaId = initUploadResponse.media_id_string;
    console.log('mediaId: ' + mediaId);
    
    const appendParams = {
        command: 'APPEND',
        media_id: mediaId,
        media: mediaData,
        segment_index: 0,
    };
    
    console.log('NOW UPLOADING');
    
    await twitterPost(
        'media/upload',
        appendParams
    );
    
    
    console.log('STILL GOOD! mediaId: ' + mediaId);
    
    const finalizeUploadParams = {
        command: 'FINALIZE',
        media_id: mediaId,
    };
    
    await twitterPost('media/upload', finalizeUploadParams);
    
    console.log('FINISHED UPLOADING! mediaId: ' + mediaId);
    
    return mediaId;
};

module.exports.startUpload = startUpload;

async function download_image(url, image_path) {
  return axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
}

async function twitterPost(endpoint, params) {
    console.log('Endpoint: ' + endpoint);

    return new Promise((resolve, reject) => {
        twitterClient.post(endpoint, params, (error, data, response) => {
            if (error && error.length > 0) {
                for(const e of error) {
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