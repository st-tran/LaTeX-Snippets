const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passwordValidator = () => true;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: passwordValidator,
        },
    },
});

// Middleware to encrypt the password
UserSchema.pre("save", function (next) {
    const user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.statics.findByUserPassword = function (username, password) {
    const User = this;

    return User.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject("User doesn't exist");
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject("Invalid password");
                }
            });
        });
    });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };
