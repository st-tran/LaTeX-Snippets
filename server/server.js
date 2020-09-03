"use strict";

const prompt = require("prompt");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const session = require("express-session");

// Mongoose models
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { LatexSnippet } = require("./models/snippet");
const { User } = require("./models/user");

// Starting the express server
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());

// Mongoose and MongoDB connection
mongoose.set("useFindAndModify", false);

// body-parser middleware for parsing req body into usable object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prompt for admin password on first start
prompt.start();

// Session/cookie middleware
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
};

///////////////////////////////////////////////////////////////////////////////
// START OF EXPRESS ROUTES
///////////////////////////////////////////////////////////////////////////////

app.use(
    session({
        secret: "T8O1T5a6l8l9Y0S4EgC7R5E3Tbpma6N1DDsiVaNry",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: new Date(390219032193218),
        },
    })
);

// Use sessionChecker for all routes.
app.get("/", sessionChecker, (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
});

app.get("/check-session", (req, res) => {
    if (req.session.user) {
        User.findOne({ username: req.session.username })
            .then((user) => {
                res.status(200).send({
                    currentUser: req.session.username,
                });
            })
            .catch(() => {
                res.status(500).send();
            });
    } else {
        res.status(401).send();
    }
});

// A route to login and create a session
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password)

    // Use the static method on the User model to find a user
    // by their email and password
    User.findByUserPassword(username, password)
        .then((user) => {
            if (!user) {
                res.status(401).send({
                    message: "No such user",
                });
            } else {
                // Add the user's id to the session cookie.
                // We can check later if this exists to ensure we are logged in.
                req.session.user = user._id;
                req.session.username = user.username;
                res.status(200).send({
                    username: user.username,
                });
            }
        })
        .catch((e) => {
            res.status(401).send({
                message: "Invalid password",
            });
        });
});

// A route to create a new user account. If successful, the user is logged in
// and a session is created.
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username: username,
        password: password,
    });

    user.save()
        .then((user) => {
            req.session.user = user._id;
            req.session.username = user.username;
            res.status(200).send({
                username: user.username,
            });
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).send({
                    message:
                        "Username and/or password not secure enough. Usernames must contain at least 1 character, and passwords must contain at least 1 special character (!@#$%^&*).",
                });
            } else if (err.code === 11000) {
                console.log(11000);
                res.status(400).send({ message: "User already exists" });
            } else {
                console.log(err);
                res.status(500).send("");
            }
        });
});

// A route to logout a user, destroying the associated session
app.get("/logout", (req, res) => {
    // Remove the session
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send();
        } else {
            res.status(200).send("Successful logout");
        }
    });
});

// Get all approved snippets.
app.get("/snips/approved", (req, res) => {
    LatexSnippet.find({ status: "approved" })
        .then((json) => {
            res.status(200).send(json);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Get all suggested snippets. For admin use only.
app.get("/snips/suggested", (req, res) => {
    if (req.session.username != "admin") {
        res.status(401).send();
        return;
    }

    LatexSnippet.find({ status: "suggested" })
        .then((json) => {
            res.status(200).send(json);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Get all snippets matching a description
app.get("/snips/descs/:desc", (req, res) => {
    LatexSnippet.fuzzySearch(req.params.desc)
        .then((json) =>
            res
                .status(200)
                .send(
                    json.filter(
                        (el) =>
                            el._doc.confidenceScore > 10 &&
                            (el._doc.status === "approved" || el._doc.status === null)
                    )
                )
        )
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

// Get all approved snippet descriptions
app.get("/snips/descs", (req, res) => {
    LatexSnippet.find({ status: "approved", status: null }).then((json) => {
        res.status(200).send(json.map((el) => el.description));
    });
});

// POST route to suggest a new snippet
app.post("/snips", (req, res) => {
    if (!req.body.description || !req.body.latex) {
        res.status(400).send("Snippets must have a description and LaTeX code.");
        return;
    }

    new LatexSnippet(Object.assign(req.body, { status: "suggested" }))
        .save()
        .then(() => res.status(200).send())
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal server error");
        });
});

///////////////////////////////////////////////////////////////////////////////
// END OF EXPRESS ROUTES
///////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 5000;

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

User.findOne({ username: "admin" })
    .then((res) => {
        console.log(res);
        if (!res) {
            console.log("Admin account not found. Please enter a password.");
            prompt.get(["password"], (err, res) => {
                if (err) {
                    return onErr(err);
                }
                new User({
                    username: "admin",
                    password: res.password,
                }).save();
                console.log("Admin password saved. Proceeding...");
            });
        }
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}...`);
        });
    })
    .catch((err) => console.log("err", err));
