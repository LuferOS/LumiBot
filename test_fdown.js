import fetch from 'node-fetch';

async function testFdown() {
  try {
    const body = new URLSearchParams({ URLz: 'https://www.facebook.com/share/r/18pqJuLh2m/' });
    const res = await fetch('https://fdown.net/download.php', {
      method: 'POST',
      body,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    // Use regex to find hdlink or sdlink
    const hdMatch = html.match(/id="hdlink" href="(.*?)"/);
    const sdMatch = html.match(/id="sdlink" href="(.*?)"/);
    console.log(html);
  } catch(e) {
    console.error(e);
  }
}
testFdown();
