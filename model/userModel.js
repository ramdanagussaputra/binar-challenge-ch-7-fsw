const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: [true, 'User must have an email'],
        },
        password: {
            type: String,
            trim: true,
            select: false,
            required: [true, 'User must have a password'],
        },
        passwordChangedAt: Date,
        username: {
            type: String,
            trim: true,
            required: [true, 'User must have a username'],
        },
        biodata: {
            type: mongoose.Types.ObjectId,
            ref: 'Biodata',
            required: [true, 'User must have a biodata object id'],
        },
        role: {
            // 1 admin, 2 user
            type: Number,
            default: 2,
            required: [true, 'User must have a role'],
        },
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// VIRTUAL PROPERTY
// Create virtual populate
userSchema.virtual('history', {
    ref: 'History',
    localField: '_id',
    foreignField: 'user',
});

// DOC METHODS
// Check password
userSchema.methods.checkPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Check have password changed
userSchema.methods.passwordChanged = function (JWTTimestamp) {
    if (!this.passwordChangedAt) return false;

    const passwordTimestamp = this.passwordChangedAt.getTime() / 1000;

    return passwordTimestamp > JWTTimestamp;
};

// DOCUMENT MIDDLEWARE
// Encrypt password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// QUERY MIDDLEWARE
userSchema.pre(/^find/, function () {
    this.populate('biodata history');
});

const User = mongoose.model('User', userSchema);

module.exports = User;
