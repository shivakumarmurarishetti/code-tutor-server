const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;// 🔐 keep private


app.post("/ai", async (req, res) => {

  try {

    const { prompt } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a coding tutor. Use spacing, clean formatting, and readable explanations."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.choices?.[0]?.message?.content || "No AI output";

    res.json({ text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Server error" });
  }

});


app.listen(3000, () => {
  console.log("🚀 Code Tutor server running on http://localhost:3000");
});

