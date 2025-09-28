require("dotenv").config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const idfcRoute = require("./Routes/Banks/idfcRoute");
const cholaRoutes = require("./Routes/Banks/cholaRoute");
const FedralRoute = require("./Routes/Banks/FedralRoute");
const ProtiumRoute = require("./Routes/Banks/ProtiumRoute");
const adityaRoutes = require("./Routes/Banks/adityaRoutes");
const piramalRoutes = require("./Routes/Banks/piramalRoute");
const manappuram = require("./Routes/Banks/manappuramRoute");
const icichfcRoutes = require("./Routes/Banks/iciciHFCRoute");
const agriwiseRoutes = require("./Routes/Banks/agriwiseRoutes");
const SamstaflnRoute = require("./Routes/Banks/SamstaflnRoute");
const sundaramRoutes = require("./Routes/Banks/sundaram.routes");
const iciciBankRoutes = require("./Routes/Banks/iciciBankRoutes");
const profectusRoutes = require("./Routes/Banks/profectusRoutes");
const HeroFinCorpRoutes = require("./Routes/Banks/heroFinCopRoutes");
const homeFirstBankRoutes = require("./Routes/Banks/homeFirstBankRoutes");
const piramalFinanceRoutes = require("./Routes/Banks/PriamalFinanceRoutes");

const bajajRoutes = require("./Routes/Banks/bajajRoutes");
const bajajAmeriyaRoutes = require("./Routes/Banks/BajajAmeriyaRoutes");
const dmiFinanceReportRoutes = require("./Routes/Banks/DmiFinanceRoute");
const homeTrenchReportRoutes = require("./Routes/Banks/homeTrenchReportRoutes");

const authRoutes = require("./Routes/auth/authRoutes");
// const ErrorHandler  = require("./middleware/errorHandler");
// const connectDb = require("./db/db");

const bodyParser = require("body-parser");
// Routes

const app = express();

const PORT = process.env.PORT || 5000; // Hardcoded port

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (global.io) {
    req.io = global.io; // use global if needed
  }
  next();
});

app.use("/api/image_kit", require("./Routes/uploadRoute"));
// Routes
app.use("/api/notifications", require("./Routes/notifications"));
app.use("/api/auth", authRoutes);

app.use("/api/idfc", idfcRoute);


app.use("/api/chola", cholaRoutes);
app.use("/api/fedral", FedralRoute);
app.use("/api/aditya", adityaRoutes);
app.use("/api/protium", ProtiumRoute);
app.use("/api/icichfc", icichfcRoutes);
app.use("/api/manappuram", manappuram);
app.use("/api/piramal", piramalRoutes);
app.use("/api/agriwise", agriwiseRoutes);
app.use("/api/sundaram", sundaramRoutes);
app.use("/api/samstafln", SamstaflnRoute);
app.use("/api/profectus", profectusRoutes);
app.use("/api/icici-bank", iciciBankRoutes);
app.use("/api/heroFinCorp", HeroFinCorpRoutes);
app.use("/api/first-bank", homeFirstBankRoutes);
app.use("/api/piramal-finance", piramalFinanceRoutes);

// !
app.use("/api/bajaj", bajajRoutes);
app.use("/api/bajajA", bajajAmeriyaRoutes);
app.use("/api/dmi-finance-reports", dmiFinanceReportRoutes);
app.use("/api/home-trench-reports", homeTrenchReportRoutes);

app.use("/api/case", require("./Routes/User/CaseRoutes"));
app.use("/api/notes", require("./Routes/noteRoutes"));

app.use("/api/assign", require("./Routes/assignmentRoutes"));

app.use("/api/uploads", require("./Routes/upload"));
app.use("/api/proxy", require("./Routes/proxyDownload"));


app.get("/api", (req, res) => {
  res.send("Server is running!");
});


// ErrorHandling
// app.use(ErrorHandler);

app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.url}`);
  err.status = 404;
  next(err);
});

module.exports = app;
