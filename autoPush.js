var request = require('request');

const FB_APP_ID = '<--insert-->';    //your app id: Settings > basic > APP ID
const FB_APP_SECRET = '<--insert-->'; //your app scret:   Settings > basic > APP Secret 
const FB_PAGE_ID = '<--insert-->'; //Go to your fan page > About > Page ID (at the bottom)
let fbShortenToken = '<--insert-->';
//Graph API Explorer > choose User token (not page!) > Access Token
//vist this site: https://developers.facebook.com/tools/explorer/


let autoPush = function(message) {
    "use strict";
    let extend_token_url = `https://graph.facebook.com/v3.2/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&amp&client_secret=${FB_APP_SECRET}&amp&fb_exchange_token=${fbShortenToken}`
    //Generate a permission token for your posting, you may need to update your fbShortenToken if is doesnt work

    request(extend_token_url, function (err, response, body) {
        let access_token = JSON.parse(body).access_token;
        //This generate a get request from the extend_token_url, it retrun a json file, and we try to grab the "access_token"
        //you can use console.log(access_token) to check if it recieve the token, or if(err){console.log(err)}

        fbShortenToken = access_token;
        //it replace your fbShortenToken by access_token, because fbShortenToken will expired
        //this will work if you run the server 24x7, if not you may need to update the fbShortenToken manually

        request(`https://graph.facebook.com/${FB_PAGE_ID}?fields=access_token&access_token=${access_token}`, function (err, response, body) {

            let access_token = JSON.parse(body).access_token;
            let post_link = 'your share link url'; // &link=${post_link}  << if your post contains a url link, add this to post_page_url below 
            let post_message = message;    
            console.log(access_token);
            let post_page_url = `https://graph.facebook.com/v3.2/${FB_PAGE_ID}/feed?message=${post_message}&access_token=${access_token}`;
                //this is the v3.2 url using post request, you may need to change it.
            
            request.post(post_page_url, function (err, response, body) {
                //this fired the post request, check your wall!
                console.log(body);
            })
        })
    });
}



module.exports = autoPush
//call the function by weeklyFacebookPost("what_your_post_about")