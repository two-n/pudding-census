import imageFilesLookup from "../assets/data/imageFilesLookup.json";

export default {
  CATEGORIES: "Categories",
  UNIT: "Unit",
  ASKED_OF: "Asked of",
  ANSWER_TYPE: "Answer Type",
  AGE_RANGE: "Age range",
  UID: "UID",
  QUESTION: "Question",
  YEAR: "Year",
  OPTIONS: "Categorical options",

  MARGIN: 100,
  MOBILE_BREAKPT: 768,

  sortedCategories: [
    "[Multiple]",
    "Social Security",
    "Wealth",
    "Housing",
    "Veteran status",
    "Fertility",
    "Citizenship",
    "Immigration",
    "Education",
    "Marital status",
    "Sex",
    "Identity",
    "Age",
    "Race",
    "Disability",
    "National origin",
    "Language",
    "Occupation",
    "Occupation - Job",
    "Occupation - Income",
    "Occupation - Unemployment",
    "Occupation - Commute"
  ],

  answerTypeLookup: {
    FT: "Text",
    BN: "Yes/No",
    CC: "Multiple Choice",
    FN: "Number",
    FD: "Date",
    FM: "Dollar Amount"
  },

  unitReverseLookup: {
    Individual: "individual",
    "Sampled Individual": "individualS",
    "Reference Individual": "individual",
    Household: "household",
    "Individual in sampled household": "householdSI"
  },

  years: [
    1790,
    1800,
    1810,
    1820,
    1830,
    1840,
    1850,
    1860,
    1870,
    1880,
    1890,
    1900,
    1910,
    1920,
    1930,
    1940,
    1950,
    1960,
    1970,
    1980,
    1990,
    2000,
    2010,
    2020
  ],

  imageFilesLookup
};
