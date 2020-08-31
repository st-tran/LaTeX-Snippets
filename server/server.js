"use strict";

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

// Starting the express server
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());

// Mongoose and MongoDB connection
mongoose.set("useFindAndModify", false);

// body-parser middleware for parsing req body into usable object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////////////////////////////////////////////////////
// START OF EXPRESS ROUTES
///////////////////////////////////////////////////////////////////////////////

// Get all snippets
app.get("/snips", (req, res) => {
    LatexSnippet.find({})
        .then((json) => {
            res.status(200).send(json);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Get all snippets matching a description
app.get("/snips/:desc", (req, res) => {
    LatexSnippet.fuzzySearch(req.params.desc)
        .then((json) => res.status(200).send(json))
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

// Get all snippet descriptions
app.get("/snipdescs", (req, res) => {
    LatexSnippet.find({}).then((json) => {
        res.status(200).send(json.map((el) => el.description));
    });
});

app.post("/snips", (req, res) => {
    new LatexSnippet(req.body)
        .save()
        .then(() => res.status(200).send())
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

///////////////////////////////////////////////////////////////////////////////
// END OF EXPRESS ROUTES
///////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 5000;

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
