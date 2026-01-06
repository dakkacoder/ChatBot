import { apikey } from "./config.js";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

//no the config file isnt missing i just didnt upload it 

//for saving chat history
window.onload = () => {
    const savedChat = localStorage.getItem("chatHistory");
    console.log({savedChat});
    if (savedChat) chatBox.innerHTML = savedChat;
    chatBox.scrollTop = chatBox.scrollHeight;
}

//creating new message box, can alter this to create a div with the specifical ID/Class name to keep it thematic
function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "className");
        msgDiv.textContent = message;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.textContent = "Bot is Typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getBotReply(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      })
    });

    // 🔴 IMPORTANT: check for API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return;
    }

    const data = await response.json();

    // Log full response
    console.log("Full response:", data);

    // Safely extract text
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Bot reply:", reply);

    return reply;

    // doing in depth error troubleshooting to get specific answers for why something fails
  } catch (error) {
    console.log("userMessage value:", userMessage);
    console.log("type:", typeof userMessage);

    // 🔴 NEVER leave this empty
    console.error("Fetch failed:", error);
  }
}


sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if(message === "") return;
    addMessage(message, "user-message");
    userInput.value = ""

    const typingDiv = showTyping();

    const botReply = await getBotReply(message); //passes the message

    typingDiv.remove();
    addMessage(botReply, "bot-message");

    localStorage.setItem("chatHistory", chatBox.innerHTML);
}

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
})