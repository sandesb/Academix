// src/controllers/chatController.js
const chatModel = require('../models/chatModel');

async function getChatResponse(req, res) {
    const userMessage = req.body.message;
    try {
        const botMessage = await chatModel.getChatCompletion(userMessage);
        res.json(botMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Error fetching chat completion");
    }
}

module.exports = {
    getChatResponse,
};
