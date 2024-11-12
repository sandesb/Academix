// src/models/chatModel.js
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // Use your API key from .env
});

async function getChatCompletion(userMessage) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Greet by saying you are Academix AI developed by Sandes with the help of the LLaMA API Key, at the first prompt only. If the user asks 'how did sandes built this or something like who are you' then say '😪 Sandes roz Chalta tha, chalte chalte thak jata tha, aur fir chalta tha, This is how he made me and this project'",
                },
                {
                    role: "user",
                    content: userMessage,
                }
            ],
            model: "llama3-8b-8192",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: true, // Enable streaming
            stop: null,
        });

        // Collect the streamed response
        let responseContent = "";
        for await (const chunk of chatCompletion) {
            responseContent += chunk.choices[0]?.delta?.content || '';
        }

        return responseContent || "No response";
    } catch (error) {
        console.error("Error fetching chat completion:", error);
        throw new Error("Error fetching chat completion");
    }
}

module.exports = {
    getChatCompletion,
};
