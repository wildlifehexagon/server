const express = require("express")
const mongoose = require("mongoose")
const cookieSession = require("cookie-session")
const passport = require("passport")
const bodyParser = require("body-parser")
const keys = require("./config/keys")
require("./models/User")
require("./models/Survey")
// add passport after models to access schema
require("./services/passport")

mongoose.connect(keys.mongoURI)

const app = express()

app.use(bodyParser.json())
// extracts cookie data
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

// pass in app to our routing files
require("./routes/authRoutes")(app)
require("./routes/billingRoutes")(app)

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js or main.css files
  app.use(express.static("client/build"))

  // Express will serve up index.html
  // if it doesn't recognize the route
  const path = require("path")
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT)
