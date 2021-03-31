const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");
const FakeDb = require("./fake-db");

const rentalRoutes = require("./routes/rentals");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const placeRoutes = require("./routes/places");
const contactformRoutes = require("./routes/contactforms");
const imageUploadRoutes = require("./routes/image-upload");

mongoose
  .connect(config.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      const fakeDb = new FakeDb();
      // fakeDb.seeDb()
    }
  })
  .catch((err) => console.error(err));

const app = express();
app.use(compression()); // compress middleware
app.use(bodyParser.json());

app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/contactforms", contactformRoutes);
app.use("/api/v1", imageUploadRoutes);

if (process.env.NODE_ENV === "production") {
  app.all(/.*/, function (req, res, next) {
    if (
      req.headers.host.match(/^staging*/i) ||
      req.headers.host.match(/^www\..*/i)
    ) {
      return next();
    } else {
      return res.redirect(301, "https://www." + req.headers.host + req.url);
    }
  });

  app.use(function (req, res, next) {
    if (req.headers["x-forwarded-proto"] === "https") {
      return next();
    } else {
      return res.redirect(301, "https://" + req.headers.host + req.url);
    }
  });

  const appPath = path.join(__dirname, "..", "dist", "kanban-chat");
  app.use(express.static(appPath));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log("I am running");
});
