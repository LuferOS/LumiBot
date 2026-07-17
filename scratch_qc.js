import axios from 'axios';
import fs from 'fs';
import { generateQuoteSticker } from './interruptores/utils/quote_api.js';

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
    const base64Image = await generateQuoteSticker(quoteObj);
    const buffer = Buffer.from(base64Image, 'base64');
    fs.writeFileSync('test_quote.png', buffer);
    console.log("Image saved as test_quote.png");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testQuote();
