// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY, // or user .env from process.env.GOOGLE_API_KEY
// });

// const extractRegistryDetails = async (base64Pdf) => {
//   try {
//     const cleanedBase64 = base64Pdf.includes("base64,")
//       ? base64Pdf.split("base64,")[1]
//       : base64Pdf;

//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       systemInstruction: `
// You are a professional Indian property registry document extraction AI.

// STRICT RULES:
// - Return ONLY valid JSON.
// - Do NOT include explanations.
// - If any field is missing, return null.
// - Document type must be in CAPITAL LETTERS.
// `,
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `
// Extract ONLY the following details from the registry document.

// Return JSON in this exact format:

// {
//   "document_type": "",
//   "registration_number": "",
//   "registration_date": "",

//   "seller": [
//     {
//       "name": "",
//       "relation": ""
//     }
//   ],

//   "buyer": [
//     {
//       "name": "",
//       "relation": ""
//     }
//   ],

//   "property": {
//     "plot_area": "",
//     "plot_dimensions": "",
//     "property_use": "",
//     "property_type": "",

//     "address": {
//       "plot_number": "",
//       "survey_number": "",
//       "ward_number": "",
//       "colony_area": "",
//       "patwari_halka_number": "",
//       "tehsil": "",
//       "district": "",
//       "state": "",
//       "pincode": ""
//     },

//     "boundaries": {
//       "east": "",
//       "west": "",
//       "north": "",
//       "south": ""
//     }
//   }
// }

// If any field is not found, return null.
// `
//             },
//             {
//               inlineData: {
//                 mimeType: "application/pdf",
//                 data: cleanedBase64,
//               },
//             },
//           ],
//         },
//       ],
//     });

//     let output = response.text;
//     output = output.replace(/```json/g, "").replace(/```/g, "").trim();

//     return JSON.parse(output);

//   } catch (error) {
//     console.error("AI Service Error:", error);
//     throw error;
//   }
// };

// module.exports = {
//   extractRegistryDetails,
// };



const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractRegistryDetails = async (base64Pdf) => {
  try {
    const cleanedBase64 = base64Pdf.includes("base64,")
      ? base64Pdf.split("base64,")[1]
      : base64Pdf;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: `
You are a professional Indian property registry document extraction AI.

STRICT RULES:
- Return ONLY valid JSON. No explanation, no markdown, no backticks.
- If any field is missing or not found, return null for that field.
- Document type must be in CAPITAL LETTERS (e.g. "SALE DEED", "GIFT DEED").

LANGUAGE RULES (VERY IMPORTANT):
- ALL text values must be written in HINGLISH (Roman script Hindi).
- This means: write Hindi words using English/Roman letters. Do NOT use Devanagari script.
- Examples:
    - "राम कुमार" → "Ram Kumar"
    - "ग्राम पंचायत" → "Gram Panchayat"
    - "वार्ड नंबर 5, कॉलोनी, भोपाल" → "Ward Number 5, Colony, Bhopal"
    - "खसरा नंबर 123/1" → "Khasra Number 123/1"
    - "पटवारी हल्का नंबर 10" → "Patwari Halka Number 10"
    - "तहसील होशंगाबाद" → "Tehsil Hoshangabad"
    - "जिला नर्मदापुरम" → "Jila Narmadapuram"
    - "आवासीय" → "Aawasiya"
    - "भूखण्ड" → "Bhukhanda"
    - "मकान" → "Makan"
    - "पुत्र" → "Putra"
    - "पत्नी" → "Patni"
- Keep English words (numbers, proper nouns already in English) as-is.
- Convert ALL Devanagari text to Hinglish Roman script.
`,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Extract ONLY the following details from the registry document.

Return JSON in this exact format (all text values in Hinglish Roman script):

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
      "khasra_number": "",
      "ward_number": "",
      "colony_area": "",
      "village_name": "",
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

Rules:
- All text must be in Hinglish (Roman script Hindi).
- If a field is not found, return null.
- Numbers can stay as numbers or English.
- Registration date format: DD/MM/YYYY
`,
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
    // Strip any markdown code fences if present
    output = output
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    return JSON.parse(output);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

module.exports = {
  extractRegistryDetails,
};
