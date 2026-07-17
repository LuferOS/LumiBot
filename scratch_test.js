import axios from 'axios';

async function testAlya() {
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
      text: "Testing Alya API", 
      replyMessage: {} 
    }] 
  };
  try {
    console.log("Sending GET to Alya with texto...");
    const url = 'https://api.alyacore.xyz/tools/quotesticker?key=LumiBot-alya&texto=Hola&username=TestUser&avatar=https://i.imgur.com/8Q9N49Q.jpeg';
    const response = await axios.get(url);
    console.log("Response Keys:", Object.keys(response.data));
    console.log("Full Response:", JSON.stringify(response.data).substring(0, 300));
  } catch (e) {
    if (e.response) {
       console.error("API Error Status:", e.response.status);
       console.error("API Error Data:", e.response.data);
    } else {
       console.error("Fetch Error:", e.message);
    }
  }
}

testAlya();
