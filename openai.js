const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OPENAI_API;

const openai = new OpenAI({
  apiKey,
});

const getResponse = async (text) => {
  const prompt = `
    Extract the card number, expiration date, CVV, and card holder name from the given text. You must only provide data when you are certain about their format and value. If any data is unavailable, write "Unavailable." Ensure the data follows these rules:
    - Card number: 16 digits, typically grouped in 4 sets of 4 digits (e.g., XXXX XXXX XXXX XXXX)
    - Expiration date: MM/YY or MM-YY or MM/YYYY or MM-YYYY format, where MM is a valid month (01-12) and YY is a valid year (20-99)
    - CVV: Identify and extract the CVV from the text. Look for sequences of numbers that are exactly 3 digits long. Ignore any sequences of numbers that are 4 digits or longer. The CVV should be standalone and not have any other digits directly adjacent to it. If no suitable sequence is found, indicate that the CVV is 'Unavailable'.
    - Name: Alphabetic characters only, with proper capitalization. Need to have both the first name and last name. (e.g., Jone Doe)

    Provide the result in JSON format:
    {
        "number": "XXXX XXXX XXXX XXXX",
        "expiration": "MM/YY or MM-YY",
        "cvv": "XXX",
        "name": "Card Holder Name"
    }

    Use the following text:
    ${text}
    `;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = response.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error getting response from OpenAI:", error.message);
    return null;
  }
};

module.exports = { getResponse };
