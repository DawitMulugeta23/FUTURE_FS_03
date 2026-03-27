const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        default: null,
    },
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    title: {
        type: String,
        maxlength: 100,
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    images: [String],
    isApproved: {
        type: Boolean,
        default: false,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', ReviewSchema);