// const extractText = require("../utils/extractText");
// const extractFields = require("../utils/fieldExtractor");
// const categorizePhoto = require("../utils/photoCategorizer");
// const extractAI = require("../utils/ollamaExtractor");

// exports.uploadDocuments = async (req, res) => {
//     try {
//         const files = req.files;

//         let documentText = "";
//         const photos = {};

//         for (const file of files) {

//             if (!file.mimetype.startsWith("image/")) {
//                 const text = await extractText(file.path, file.mimetype);

//                 if (text && text.trim().length > 0) {
//                     documentText += text + "\n";
//                 }
//             } else {
//                 const category = categorizePhoto(file.originalname);
//                 photos[category] = `http://localhost:5000/uploads/${file.filename}`;
//             }
//         }


//         const extraInstructions = `Desc for registry details



// ·        What is the seller and buyer name  with son of / wife of / daughter of   



// ·        What is area of plot



// ·        What is dimension of plot in given



// ·        What is four side boundries of plot



// ·        What is full address of property in these



// manners ( plot no , khasrano.  Ward



// number ,Survey number, colony or area name , PATWARI HALKA NUMBER , tehsil.



// Distric, state ,pincode )



// ·        Whats Is uses of this property



// ·        What is type of this document on please give result on capital letters`

//         console.log(documentText, "POIUYTREWQASDFGHJKL")

//         const ruleData = extractFields(documentText);
//         const aiData = await extractAI(documentText, extraInstructions);
//         const finalData = { ...aiData, ...ruleData };

//         console.log(finalData, "THIS IS THE FINAL DATA")

//         res.json({
//             formData: finalData,
//             photos,
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Extraction failed" });
//     }
// };



const extractText = require("../utils/extractText");
const extractFields = require("../utils/fieldExtractor");
const categorizePhoto = require("../utils/photoCategorizer");
const extractAI = require("../utils/ollamaExtractor");
const registryFields = require("../utils/registryFields");
const cleanText = require("../utils/cleanText");




exports.uploadDocuments = async (req, res) => {
    try {
        const files = req.files;

        let documentText = "";
        const photos = {};

        for (const file of files) {

            // 📄 Extract text from documents
            if (!file.mimetype.startsWith("image/")) {
                const text = await extractText(file.path, file.mimetype);

                if (text && text.trim()) {
                    documentText += text + "\n";
                }
            }
            // 📷 categorize photos
            else {
                const category = categorizePhoto(file.originalname);
                photos[category] = `http://localhost:5000/uploads/${file.filename}`;
            }
        }

        if (!documentText.trim()) {
            return res.status(400).json({ error: "No document text found" });
        }

        // ✅ Registry extraction instructions
        const extraInstructions = `
Extract registry details:

• seller & buyer name with S/O, W/O, D/O
• plot area
• plot dimensions
• four side boundaries
• full property address including:
  plot no, khasra no, ward no, tehsil, district, state, pincode
• usage of property
• document type
`;

        console.log("📄 DOCUMENT TEXT LENGTH:", documentText.length);

        // rule-based extraction
        const ruleData = extractFields(documentText);

        documentText = cleanText(documentText);

        // AI extraction (STRICT fields)
        const aiData = await extractAI(
            documentText,
            registryFields,
            extraInstructions
        );

        const finalData = { ...registryFields };

        Object.keys(finalData).forEach(key => {
            finalData[key] =
                ruleData[key] ??
                aiData[key] ??
                registryFields[key];
        });


        // merge results
        // const finalData = {
        //     ...registryFields,
        //     ...aiData,
        //     ...ruleData
        // };

        console.log("✅ FINAL DATA:", finalData);

        res.json({
            formData: finalData,
            photos,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Extraction failed" });
    }
};
