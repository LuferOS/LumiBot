import axios from 'axios';
import fs from 'fs';

async function test() {
  try {
    const jsonParams = {
      type: "quote",
      format: "png",
      backgroundColor: "#1B1429",
      width: 512,
      height: 768,
      scale: 2,
      messages: [{
        entities: [],
        avatar: true,
        from: {
          id: 1,
          name: "Test",
          photo: { url: "https://i.imgur.com/8Q5g0wY.png" }
        },
        text: "Test quote message",
        replyMessage: {}
      }]
    };
    const res = await axios.post('https://qc.botcahx.eu.org/generate', jsonParams);
    console.log("Success! Base64 starts with: ", res.data.result?.image?.substring(0, 50));
  } catch (e) {
    console.error("Failed QC:", e.message);
  }
}
test();
