import axios from "axios";

export function handler(event, context, callback) {
  const API_KEY = process.env.API_KEY;
  const body = JSON.parse(event.body);
  const { name, age, hobby } = body;
  if (
    !name ||
    name.length > 20 ||
    !age ||
    age.toString().length > 20 ||
    !hobby ||
    hobby.length > 20
  ) {
    return res.status(400).json({ message: "Invalid request parameters." });
  }
  const prompt = `Formuliere ein Geburtstagsgedicht für die Person ${name}, ${age} Jahre alt und hat die Hobbys ${hobby}. Länge: 1 Strophe aus 6 Versen.`;

  axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
      },
      {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    )
    .then((response) => {
      const message = response.data.choices[0].message.content;
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(message),
      });
    })
    .catch((error) => {
      console.log(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: "Fehler bei der Anfrage" }),
      });
    });
}
