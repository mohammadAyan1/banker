const Bajaj = require("../model/Banks/BajajModel");
const HomeFirst = require("../model/Banks/homeFirstModel");
const Piramal = require("../model/Banks/piramalModel");
const HomeFirstTrench = require("../model/Banks/homeTrenchModel");
const ICICI_BANK = require("../model/Banks/IciciBankModel");
const Aditya = require("../model/Banks/adityaModel")
const modelMap = {
  HomeFirstTrench: HomeFirstTrench,
  Bajaj: Bajaj,
  Homefirst: HomeFirst,
  Piramal: Piramal,
  Icici: ICICI_BANK,
  Aditya: Aditya

};

module.exports = modelMap;
