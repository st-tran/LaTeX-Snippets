/* LaTeX Snippet mongoose model */
const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const LatexSnippetSchema = new mongoose.Schema({
    description: {
        type: String,
        minlength: 1,
        trim: true,
        unique: false,
        required: true,
    },
    latex: {
        type: String,
        minlength: 1,
        trim: false,
        unique: false,
        required: true,
    },
});

// Fuzzy searching of description
LatexSnippetSchema.plugin(mongoose_fuzzy_searching, { fields: ["description"] });

// Make a model using the ChatMessage schema
const LatexSnippet = mongoose.model("LatexSnippet", LatexSnippetSchema);

module.exports = { LatexSnippet };
