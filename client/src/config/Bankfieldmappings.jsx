export const TRENCH_MAPPING = {
    propertyAddress: ["addressSite", "addressLegal", "propertyName"],
    dateOfReport: "dateOfReport",
    visitedPersonName: "customerName",
    latitude: "latitude",
    longitude: "longitude",
    dateOfVisit: "dateOfReport",
    contactNumber: "contactNumber",
    LandArea: ["property.LandArea", "landArea"],
};

export const ADITYA_MAPPING = {
    "basicDetails.nameOfClient": "customerName",
    "basicDetails.nameOfPropertyOwner": "propertyOwnerName",
    "basicDetails.caseReferenceNumber": "refNo",
    "basicDetails.reportDate": "dateOfReport",
    "basicDetails.visitDate": "dateOfReport",
    "basicDetails.initiationDate": "dateOfReport",
    "locationDetails.propertyAddressAsTRF": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "locationDetails.propertyAddressAsVisit": [
        "addressSite",
        "addressLegal",
        "propertyName",
    ],
    "locationDetails.propertyAddressAsDocs": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "locationDetails.mainLocality": "city",
    "locationDetails.latitude": "latitude",
    "locationDetails.longitude": "longitude",
    "locationDetails.typeOfProperty": ["usageOfProperty", "zone"],
    "locationDetails.currentUsage": "usageOfProperty",
    "locationDetails.propertyType": ["usageOfProperty", "zone"],
    "locationDetails.propertySubType": "unitType",
    "documentDetails.saleDeedDetails": [
        "numberAndDate",
        "documentsAvailable",
    ],
    "boundaryDetails.northAsPerDocs": "northDocument",
    "boundaryDetails.southAsPerDocs": "southDocument",
    "boundaryDetails.eastAsPerDocs": "eastDocument",
    "boundaryDetails.westAsPerDocs": "westDocument",
    "boundaryDetails.northActual": "northActual",
    "boundaryDetails.southActual": "southActual",
    "boundaryDetails.eastActual": "eastActual",
    "boundaryDetails.westActual": "westActual",
    "boundaryDetails.boundaryMatching": (data) =>
        data.boundariesMatching || "YES",
    "accommodationDetails.typeOfStructure": "typeOfStructure",
    "valuationDetails.plotAreaInDeed": ["plotArea", "landArea"],
    "valuationDetails.plotAreaPhysical": ["plotArea", "landArea"],
    "valuationDetails.builtUpAreaNorms": ["plotArea", "landArea"],
    "valuationDetails.builtUpAreaTinShed": ["plotArea", "landArea"],
};

export const MANAPPURAM_MAPPING = {
    "header.caseRefNo": "refNo",
    "header.dateOfVisit": "dateOfReport",
    "header.dateOfReport": "dateOfReport",
    "header.contactedPerson": (data) =>
        [data.customerName, data.contactNumber].filter(Boolean).join(" / "),
    "propertyInfo.applicantName": "customerName",
    "propertyInfo.ownerName": "propertyOwnerName",
    "propertyInfo.documentProduced": "documentsAvailable",
    "propertyInfo.typeOfProperty": ["usageOfProperty", "unitType"],
    "propertyInfo.currentUsage": "usageOfProperty",
    "propertyInfo.propertyUsage": "usageOfProperty",
    "propertyInfo.addressAtSite": [
        "addressSite",
        "addressLegal",
        "propertyName",
    ],
    "propertyInfo.addressAsPerDocument": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "propertyInfo.landmark": "propertyName",
    "propertyInfo.locationOfProperty": (data) =>
        [data.city, data.projectState].filter(Boolean).join(", "),
    "siteBoundaries.northDoc": "northDocument",
    "siteBoundaries.southDoc": "southDocument",
    "siteBoundaries.eastDoc": "eastDocument",
    "siteBoundaries.westDoc": "westDocument",
    "siteBoundaries.northActual": "northActual",
    "siteBoundaries.southActual": "southActual",
    "siteBoundaries.eastActual": "eastActual",
    "siteBoundaries.westActual": "westActual",
    "siteBoundaries.boundariesTallied": (data) =>
        data.boundariesMatching || "Yes",
    "technicalDetails.totalLandArea": ["plotArea", "landArea"],
    "technicalDetails.constructionType": "typeOfStructure",
    "valuationGLR.landArea": ["plotArea", "landArea"],
    "valuationPMR.landArea": ["plotArea", "landArea"],
    "summary.propertyAddress": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "summary.propertyType": ["unitType", "usageOfProperty"],
    "summary.applicantName": "customerName",
    "summary.coordinates": (data) =>
        data.latitude && data.longitude
            ? `${data.latitude}, ${data.longitude}`
            : null,
};
