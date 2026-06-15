import fetch from 'node-fetch';

async function testFB() {
  try {
    const url = 'https://www.facebook.com/share/r/18pqJuLh2m/';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const sdMatch = html.match(/"sd_src":"(.*?)"/);
    const hdMatch = html.match(/"hd_src":"(.*?)"/);
    console.log("SD:", sdMatch ? sdMatch[1].replace(/\\/g, '') : "Not found");
    console.log("HD:", hdMatch ? hdMatch[1].replace(/\\/g, '') : "Not found");
  } catch (e) {
    console.error(e);
  }
}

testFB();
