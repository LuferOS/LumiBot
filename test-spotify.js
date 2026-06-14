import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function run() {
    const res = await fetch('https://open.spotify.com/search/bad%20bunny/tracks', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    console.log($('title').text());
    
    // Check if there is any initial state json
    const match = html.match(/<script id="initial-state"[^>]*>([^<]+)<\/script>/);
    if (match) {
        try {
            const data = JSON.parse(Buffer.from(match[1], 'base64').toString('utf-8'));
            console.log(Object.keys(data));
        } catch (e) {
            console.log("Could not parse initial state");
        }
    } else {
        console.log("No initial state found");
    }
}
run();
