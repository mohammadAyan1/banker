const Bajaj = require("../model/Banks/BajajModel");
const HomeFirst = require("../model/Banks/homeFirstModel");
const Piramal = require("../model/Banks/piramalModel");
const HomeFirstTrench = require("../model/Banks/homeTrenchModel");
const ICICI_BANK = require("../model/Banks/IciciBankModel");

const modelMap = {
  HomeFirstTrench: HomeFirstTrench,
  Bajaj: Bajaj,
  HomeFirst: HomeFirst,
  Piramal: Piramal,
  Icici: ICICI_BANK,
};

module.exports = modelMap;
