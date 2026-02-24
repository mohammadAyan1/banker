const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // or user .env from process.env.GOOGLE_API_KEY
});

const extractRegistryDetails = async (base64Pdf) => {
  try {
    const cleanedBase64 = base64Pdf.includes("base64,")
      ? base64Pdf.split("base64,")[1]
      : base64Pdf;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      systemInstruction: `
You are a professional Indian property registry document extraction AI.

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT include explanations.
- If any field is missing, return null.
- Document type must be in CAPITAL LETTERS.
`,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Extract ONLY the following details from the registry document.

Return JSON in this exact format:

{
  "document_type": "",
  "registration_number": "",
  "registration_date": "",

  "seller": [
    {
      "name": "",
      "relation": ""
    }
  ],

  "buyer": [
    {
      "name": "",
      "relation": ""
    }
  ],

  "property": {
    "plot_area": "",
    "plot_dimensions": "",
    "property_use": "",
    "property_type": "",

    "address": {
      "plot_number": "",
      "survey_number": "",
      "ward_number": "",
      "colony_area": "",
      "patwari_halka_number": "",
      "tehsil": "",
      "district": "",
      "state": "",
      "pincode": ""
    },

    "boundaries": {
      "east": "",
      "west": "",
      "north": "",
      "south": ""
    }
  }
}

If any field is not found, return null.
`
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: cleanedBase64,
              },
            },
          ],
        },
      ],
    });

    let output = response.text;
    output = output.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(output);

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

module.exports = {
  extractRegistryDetails,
};
