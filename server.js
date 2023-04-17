const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "artisanNow-session",
        keys: ["artisan_key1", "arisan_key2"],
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
);

// mongoose db connect 
const db = require("./app/models");
const { g_func } = require("./app/global");
const { dbConfig } = require("./app/config")
const Role = db.role;

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        g_func.initial(Role);
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// routes
const routes = require('./app/routes');
routes.authRoutes(app);
routes.userRoutes(app);

app.post("/", (req, res) => {
    res.json({ message: "Welcome to artisanNow application." });
});
app.get("/", (req, res) => {
    res.json({ message: "Welcome to artisanNow application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});