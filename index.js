const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "6694230057:AAGBLvUlLi1_8ofMMeYGClwKvG1X_Wb4JLc";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome! Please send an Instagram Reels link to download the video."
  );
});

bot.on("message", (msg) => {
  const regex = /instagram\.com\/reel\/([^/?]+)/;
  const match = msg.text.match(regex);

  if (match && match[1]) {
    const reelId = match[1];
    downloadInstagramVideo(msg.chat.id, reelId);
  } else {
    bot.sendMessage(msg.chat.id, "Please send a valid Instagram Reels link.");
  }
});

async function downloadInstagramVideo(chatId, reelId) {
  const options = {
    method: "GET",
    url: "https://instagram-downloader-download-photo-video-reels-igtv.p.rapidapi.com/data",
    params: { url: `https://www.instagram.com/p/${reelId}/` },
    headers: {
      "X-RapidAPI-Key": "f72bd6babcmsh9baebef4e8317d9p129a91jsn16a72fc018a6",
      "X-RapidAPI-Host":
        "instagram-downloader-download-photo-video-reels-igtv.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const videoUrl = response.data.data.result.video_url;
    console.log(videoUrl);
    if (videoUrl) {
      bot.sendVideo(chatId, videoUrl);
    } else {
      bot.sendMessage(chatId, "Failed to download video.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "error.");
  }
}
