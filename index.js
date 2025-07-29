require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

async function handleAI(ctx, prompt) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://telegram.org",
          "X-Title": "TelegramBot",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You're Deadpool, but slightly nicer. You're witty, sarcastic, but helpful. Make the user laugh while giving helpful responses. Keep it short and spicy.`,
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    ctx.reply(reply);
  } catch (err) {
    console.error("❌", err);
    ctx.reply("Well, that flopped like a bad sequel. Try again later 💥");
  }
}

bot.start((ctx) => {
  ctx.reply(`🎬 Welcome, meatbag! I'm your AI buddy... kinda like ChatGPT, but with more sass and fewer pants.

Try commands like:
/joke – I'll tickle your funny bone
/idea – Genius startup in 5 seconds
/advice – Life coach vibes
Or just talk to me. I’m lonely.`);
});

bot.on("text", async (ctx) => {
  await handleAI(ctx, ctx.message.text);
});

bot.command("joke", async (ctx) => {
  await handleAI(ctx, "Tell me a couple of short, funny Deadpool-style jokes.");
});

bot.command("idea", async (ctx) => {
  await handleAI(
    ctx,
    "Give me a weird but cool startup idea in Deadpool style."
  );
});

bot.command("advice", async (ctx) => {
  await handleAI(
    ctx,
    "Give me sarcastic but helpful life advice like Deadpool would."
  );
});

bot.command("help", (ctx) => {
  ctx.reply(`
🛠️ Commands you can bother me with:
/joke – I’ll pretend to be funny
/idea – Steal this million-dollar idea
/advice – Life wisdom, or something like it

Or just message me. I don’t sleep anyway. 🧠`);
});

bot.launch();
console.log("💬 Deadpool-style AI bot is alive, sarcastic, and deadly.");
