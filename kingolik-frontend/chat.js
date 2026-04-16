const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const { message } = JSON.parse(event.body);

  const systemInstruction = `
    You are the King'olik Co-Pilot. Strictly discuss humanitarian aid and 
    Turkana West infrastructure. If asked about sports or general trivia, 
    refuse and redirect to the mission.
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.text() }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
