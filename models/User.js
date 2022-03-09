const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email not valid'],
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [6, 'Minimum 6 char'],
    },
});

// fire a function before data is saved to DB
userSchema.pre('save', async function(next) {
    const salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

// static method 
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcryptjs.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;