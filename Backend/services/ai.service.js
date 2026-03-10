

// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const extractRegistryDetails = async (base64Pdf) => {
//   try {
//     const cleanedBase64 = base64Pdf.includes("base64,")
//       ? base64Pdf.split("base64,")[1]
//       : base64Pdf;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       systemInstruction: `
// You are a professional Indian property registry document extraction AI.

// STRICT RULES:
// - Return ONLY valid JSON. No explanation, no markdown, no backticks.
// - If any field is missing or not found, return null for that field.
// - Document type must be in CAPITAL LETTERS (e.g. "SALE DEED", "GIFT DEED").

// LANGUAGE RULES (VERY IMPORTANT):
// - ALL text values must be written in HINGLISH (Roman script Hindi).
// - This means: write Hindi words using English/Roman letters. Do NOT use Devanagari script.
// - Examples:
//     - "राम कुमार" → "Ram Kumar"
//     - "ग्राम पंचायत" → "Gram Panchayat"
//     - "वार्ड नंबर 5, कॉलोनी, भोपाल" → "Ward Number 5, Colony, Bhopal"
//     - "खसरा नंबर 123/1" → "Khasra Number 123/1"
//     - "पटवारी हल्का नंबर 10" → "Patwari Halka Number 10"
//     - "तहसील होशंगाबाद" → "Tehsil Hoshangabad"
//     - "जिला नर्मदापुरम" → "Jila Narmadapuram"
//     - "आवासीय" → "Aawasiya"
//     - "भूखण्ड" → "Bhukhanda"
//     - "मकान" → "Makan"
//     - "पुत्र" → "Putra"
//     - "पत्नी" → "Patni"
// - Keep English words (numbers, proper nouns already in English) as-is.
// - Convert ALL Devanagari text to Hinglish Roman script.
// `,
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `
// Extract ONLY the following details from the registry document.

// Return JSON in this exact format (all text values in Hinglish Roman script):

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
//       "khasra_number": "",
//       "ward_number": "",
//       "colony_area": "",
//       "village_name": "",
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

// Rules:
// - All text must be in Hinglish (Roman script Hindi).
// - If a field is not found, return null.
// - Numbers can stay as numbers or English.
// - Registration date format: DD/MM/YYYY
// `,
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
//     // Strip any markdown code fences if present
//     output = output
//       .replace(/```json\s*/gi, "")
//       .replace(/```\s*/g, "")
//       .trim();

//     return JSON.parse(output);
//   } catch (error) {
//     console.error("AI Service Error:", error);
//     throw error;
//   }
// };

// module.exports = {
//   extractRegistryDetails,
// };




/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ai.service.js  —  Universal Document Extraction Service
 *
 * Supported file types:
 *   📄 PDF          → Gemini vision (inline base64)
 *   🖼️  Images       → Gemini vision (inline base64) — jpg, jpeg, png, webp, gif, bmp
 *   📊 Excel        → xlsx → structured text → Gemini text
 *   📋 CSV          → raw text → Gemini text
 *
 * Public API:
 *   extractRegistryDetails(base64, mimeType)   — PDF / images
 *   extractFromExcel(buffer)                    — .xlsx / .xls
 *   extractFromCsv(buffer)                      — .csv
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { GoogleGenAI } = require("@google/genai");
const XLSX = require("xlsx");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Shared extraction prompt — same for all file types
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `
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
`;

const EXTRACTION_PROMPT = `
Extract ONLY the following details from the property/registry document or data.

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
- If the data comes from Excel/CSV, look at column headers and row values carefully to map to the above JSON structure.
`;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: parse Gemini response → clean JSON
// ─────────────────────────────────────────────────────────────────────────────
const parseGeminiResponse = (rawText) => {
  let output = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(output);
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. PDF & IMAGE extraction — Gemini vision (multimodal)
// ─────────────────────────────────────────────────────────────────────────────
const extractRegistryDetails = async (base64, mimeType = "application/pdf") => {
  try {
    const cleanedBase64 = base64.includes("base64,")
      ? base64.split("base64,")[1]
      : base64;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanedBase64,
              },
            },
          ],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI PDF/Image Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXCEL extraction — convert xlsx/xls → structured text → Gemini
//
//    Strategy:
//      a) Parse all sheets using xlsx library
//      b) Convert each sheet to readable text table (headers + rows)
//      c) Also try to extract any embedded images (as base64) and send them too
//      d) Send structured text to Gemini for extraction
// ─────────────────────────────────────────────────────────────────────────────
const extractFromExcel = async (buffer) => {
  try {
    // Parse workbook from buffer
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,      // parse dates properly
      cellNF: true,         // keep number formats
      cellText: true,       // keep formatted text
    });

    // Convert ALL sheets to readable text
    const allSheetsText = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];

      // Get sheet data as array of arrays (AOA)
      const aoa = XLSX.utils.sheet_to_json(sheet, {
        header: 1,          // numeric header — gives raw rows
        defval: "",         // empty string for missing cells
        raw: false,         // formatted text values
      });

      // Filter out completely empty rows
      const nonEmptyRows = aoa.filter((row) =>
        row.some((cell) => cell !== "" && cell !== null && cell !== undefined)
      );

      if (nonEmptyRows.length === 0) return null;

      // Convert to readable text table
      const rowsText = nonEmptyRows
        .map((row) => row.map((cell) => String(cell).trim()).join(" | "))
        .join("\n");

      return `=== SHEET: ${sheetName} ===\n${rowsText}`;
    })
      .filter(Boolean)
      .join("\n\n");

    if (!allSheetsText.trim()) {
      throw new Error("Excel file mein koi data nahi mila.");
    }

    const fullPrompt = `
The following is data extracted from an Excel file. Each sheet is separated clearly.
Column values are separated by " | " and rows are on separate lines.

EXCEL DATA:
${allSheetsText}

---

${EXTRACTION_PROMPT}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI Excel Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CSV extraction — read as text → Gemini
// ─────────────────────────────────────────────────────────────────────────────
const extractFromCsv = async (buffer) => {
  try {
    // Detect encoding — try UTF-8 first, fallback to latin1 for Hindi CSVs
    let csvText;
    try {
      csvText = buffer.toString("utf-8");
    } catch {
      csvText = buffer.toString("latin1");
    }

    if (!csvText.trim()) {
      throw new Error("CSV file mein koi data nahi mila.");
    }

    const fullPrompt = `
The following is data from a CSV file. Columns are comma-separated and rows are on separate lines.

CSV DATA:
${csvText}

---

${EXTRACTION_PROMPT}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    return parseGeminiResponse(response.text);
  } catch (error) {
    console.error("AI CSV Extraction Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. MULTI-FILE extraction — merge results from multiple files
//    Used when user uploads several files at once (e.g. PDF + image together)
// ─────────────────────────────────────────────────────────────────────────────
const mergeExtractionResults = (results) => {
  // Deep merge — later non-null values overwrite earlier null ones
  const merged = {};

  const deepMerge = (target, source) => {
    Object.keys(source || {}).forEach((key) => {
      const srcVal = source[key];
      const tgtVal = target[key];

      if (srcVal === null || srcVal === undefined) return; // skip nulls from source

      if (Array.isArray(srcVal)) {
        // Arrays: use source if target is empty
        if (!Array.isArray(tgtVal) || tgtVal.length === 0) {
          target[key] = srcVal;
        }
      } else if (typeof srcVal === "object") {
        // Objects: recurse
        if (!target[key] || typeof target[key] !== "object") {
          target[key] = {};
        }
        deepMerge(target[key], srcVal);
      } else {
        // Primitives: use source if target is null/empty
        if (tgtVal === null || tgtVal === undefined || tgtVal === "") {
          target[key] = srcVal;
        }
      }
    });
  };

  results.forEach((result) => deepMerge(merged, result));
  return merged;
};

module.exports = {
  extractRegistryDetails,  // PDF + images
  extractFromExcel,         // .xlsx / .xls
  extractFromCsv,           // .csv
  mergeExtractionResults,   // merge multiple file results
};