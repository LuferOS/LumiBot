import fetch from 'node-fetch';

async function test() {
    const res = await fetch('https://open.spotify.com/search/bad%20bunny', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    const html = await res.text();
    const match = html.match(/<script id="session" data-testid="session" type="application\/json">(\{.*?\})<\/script>/);
    if (match) {
        const json = JSON.parse(match[1]);
        console.log(json.accessToken);
        
        // Try searching
        const searchRes = await fetch('https://api.spotify.com/v1/search?type=track&q=bad+bunny&decorate_restrictions=false&include_external=audio&limit=3', {
            headers: {
                'Authorization': `Bearer ${json.accessToken}`
            }
        });
        const searchData = await searchRes.json();
        console.log(searchData.tracks.items.map(t => `${t.name} - ${t.artists[0].name} (${t.external_urls.spotify})`));
    } else {
        console.log('No session script found');
    }
}
test();
