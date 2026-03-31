/**
 * ─────────────────────────────────────────────────────────────────────────────
 * autoFillAdapter.js
 *
 * UNIVERSAL AutoFill Adapter — ek baar banao, har bank me use karo.
 *
 * HOW IT WORKS:
 *   AutoFillForm extractedData ko call karta hai setFormData ke saath.
 *   Ye adapter us extracted data ko BANK-SPECIFIC field names me translate karta hai.
 *
 * USAGE (kisi bhi bank component me):
 *   import { createAutoFillAdapter } from "../utils/autoFillAdapter";
 *   import { TRENCH_MAPPING } from "../config/bankFieldMappings";
 *
 *   const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mapped) => {
 *     setFormData(prev => ({ ...prev, ...mapped }));
 *     form.setFieldsValue(mapped);
 *   });
 *
 *   <AutoFillForm setFormData={handleAutoFill} />
 *
 * MAPPING FORMAT:
 *   {
 *     targetFieldName: "sourceFieldFromExtractedData",
 *     // OR multiple fallback sources (first non-null wins):
 *     targetFieldName: ["source1", "source2", "source3"],
 *     // OR custom transform function:
 *     targetFieldName: (extractedData) => extractedData.someField?.toUpperCase(),
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Safely get a value from a nested object using dot-notation path.
 * @param {object} obj
 * @param {string} path - e.g. "property.address.district"
 * @param {*} defaultValue
 */
const deepGet = (obj, path, defaultValue = null) =>
    path
        .split(".")
        .reduce(
            (acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue),
            obj
        );

/**
 * Resolve a single mapping rule against extracted data.
 *
 * @param {*} rule - string | string[] | function
 * @param {object} extractedData - the raw data from AutoFillForm
 * @returns {*} resolved value or null
 */
const resolveRule = (rule, extractedData) => {
    // Function rule — custom transform
    if (typeof rule === "function") {
        try {
            const result = rule(extractedData);
            return result !== undefined && result !== "" ? result : null;
        } catch {
            return null;
        }
    }

    // Array rule — try each source key, return first non-null
    if (Array.isArray(rule)) {
        for (const key of rule) {
            const value = deepGet(extractedData, key);
            if (value !== null && value !== undefined && value !== "") {
                return value;
            }
        }
        return null;
    }

    // String rule — direct key lookup (supports dot notation)
    if (typeof rule === "string") {
        const value = deepGet(extractedData, rule);
        return value !== undefined && value !== "" ? value : null;
    }

    return null;
};

const cloneValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(cloneValue);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, nestedValue]) => [
                key,
                cloneValue(nestedValue),
            ])
        );
    }

    return value;
};

export const applyMappedFields = (baseObject, mappedFields) => {
    const nextState = cloneValue(baseObject ?? {});

    Object.entries(mappedFields || {}).forEach(([targetPath, value]) => {
        if (!targetPath) return;

        const pathParts = targetPath.split(".");
        let cursor = nextState;

        for (let index = 0; index < pathParts.length - 1; index += 1) {
            const key = pathParts[index];

            if (
                cursor[key] === null ||
                cursor[key] === undefined ||
                typeof cursor[key] !== "object" ||
                Array.isArray(cursor[key])
            ) {
                cursor[key] = {};
            }

            cursor = cursor[key];
        }

        cursor[pathParts[pathParts.length - 1]] = value;
    });

    return nextState;
};

/**
 * Core adapter factory.
 *
 * @param {object} mapping       - Bank-specific field mapping config
 * @param {function} onMapped    - Callback with the mapped + filtered data object
 * @returns {function}           - A function to pass as `setFormData` to AutoFillForm
 *
 * The returned function:
 *   - Receives extracted data from AutoFillForm
 *   - Translates it using the provided mapping
 *   - Strips out null/undefined values
 *   - Calls onMapped with the clean result
 */
export const createAutoFillAdapter = (mapping, onMapped) => {
    return (extractedData) => {
        if (!extractedData || typeof extractedData !== "object") return;

        const mapped = {};

        Object.entries(mapping).forEach(([targetField, rule]) => {
            const value = resolveRule(rule, extractedData);
            if (value !== null && value !== undefined) {
                mapped[targetField] = value;
            }
        });

        if (Object.keys(mapped).length > 0) {
            onMapped(mapped);
        }
    };
};

export default createAutoFillAdapter;
