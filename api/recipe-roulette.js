const request = require("request");

//require('dotenv').config();

module.exports = async (req, res) => {
	if (req.method === 'POST') {

		if (!req.body) {
			return res.status(400).json({ error: 'Invalid input' });
		}

		// Set the options for the request to ChatGPT
		const options = {
			method: "POST",
			url: "https://api.openai.com/v1/completions",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					`Bearer ${process.env.API_TOKEN} `,
			},
			body: {
				//conversation_id: "conv-1",
				model: "text-davinci-003",
				prompt: generatePrompt(req.body.style, req.body.ingredient, req.body.lactoseFree),
				max_tokens: 3500
			},
			json: true,
		};

		console.log("These are the request options")
		console.log(options.headers)

		// Send the request to ChatGPT
		request(options, (error, response, body) => {
			if (error) {
				return res
					.status(500)
					.send({ error: "Error sending message to ChatGPT" });
			}
			// Send the response from ChatGPT back to the client
			res.send(body.choices[0].text);
		});

	} else {
		res.status(405).send('Method Not Allowed');
	}
}

function generatePrompt(styleChoice, ingredient, lactoseFree) {
	let prompt = `Suggest a ${styleChoice} recipe with ${ingredient}`
	prompt += lactoseFree ? " that is lactose free" : ""
	console.log(prompt)
	return prompt
}

