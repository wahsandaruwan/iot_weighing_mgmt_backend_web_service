// ----------Third-party libraries and modules----------
const express = require("express");
const cors = require("cors");
require("dotenv/config");

// ----------Custom libraries and modules----------
const Configs = require("./configs");
const { ConnectDatabase } = require("./api/v1/helpers");
const {
  UserRoutes,
  WeighingDeviceRoutes,
  WeighingDataRoutes,
  UserTokenRoutes,
  ItemRoutes,
  FileRoutes,
  SummaryRoutes,
  NotificationRoutes,
} = require("./api/v1/routes");

// ----------Global instances----------
const app = express();
const PORT = Configs.DEV_PORT || 3308;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// ----------Common middleware----------
app.use(cors());
// Accept json
app.use(express.json());

// Allow access uploads folder
app.use("/uploads", express.static("./uploads/"));

// Base route
app.get("/", (req, res) => {
  res.status(200).json({ success: { message: `Welcome to the server!` } });
});

// User route
app.use("/api/users", UserRoutes);

// Device data route
app.use("/api/weighingdata", WeighingDataRoutes);

// Device route
app.use("/api/device", WeighingDeviceRoutes);

// Item route
app.use("/api/item", ItemRoutes);

// User token route
app.use("/api/usertokens", UserTokenRoutes);

// File route
app.use("/api/files", FileRoutes);

//Summary route
app.use("/api/summary", SummaryRoutes);

//Notification route
app.use("/api/notification", NotificationRoutes);

// Error route
app.use((req, res) => {
  res.status(404).json({ error: { message: `Not found!` } });
});

// ----------Initialize the connection----------
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);

  // Initialize the db connection
  ConnectDatabase()
    .then(() => console.log("Connected to DB!"))
    .catch((err) => console.log(err));
});
