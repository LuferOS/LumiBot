import axios from 'axios';
import fs from 'fs';

async function testQuote() {
  const quoteObj = { 
    type: 'quote', 
    format: 'png', 
    backgroundColor: '#1f2c34', 
    width: 512, 
    height: 768, 
    scale: 2, 
    messages: [{ 
      entities: [], 
      avatar: true, 
      from: { id: 1, name: "Test User", photo: { url: "https://i.imgur.com/8Q9N49Q.jpeg" } }, 
      text: "Testing name color", 
      replyMessage: {} 
    }] 
  };
  
  try {
    const { data } = await axios.post('https://bot.lyo.su/quote/generate', quoteObj, { headers: { 'Content-Type': 'application/json' } });
    const buffer = Buffer.from(data.result.image, 'base64');
    fs.writeFileSync('test_quote.png', buffer);
    console.log("Image saved as test_quote.png");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testQuote();
