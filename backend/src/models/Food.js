// backend/src/models/Food.js
const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Coffee", "Pastry", "Meal", "Drink"],
      default: "Coffee",
    },
    isAvailable: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },

    // Rating fields
    ratings: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },

    // Like/Dislike fields
    likes: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dislikes: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Method to update average rating
FoodSchema.methods.updateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.ratings.reduce((total, item) => total + item.rating, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(1));
    this.totalRatings = this.ratings.length;
  }
  return this.save();
};

// Method to check if user has liked
FoodSchema.methods.hasUserLiked = function (userId) {
  return this.likes.some((like) => like.user.toString() === userId.toString());
};

// Method to check if user has disliked
FoodSchema.methods.hasUserDisliked = function (userId) {
  return this.dislikes.some(
    (dislike) => dislike.user.toString() === userId.toString(),
  );
};

// Method to get user's rating
FoodSchema.methods.getUserRating = function (userId) {
  const rating = this.ratings.find(
    (r) => r.user.toString() === userId.toString(),
  );
  return rating ? rating.rating : null;
};

// Method to toggle like
FoodSchema.methods.toggleLike = async function (userId) {
  const likedIndex = this.likes.findIndex(
    (like) => like.user.toString() === userId.toString(),
  );
  const dislikedIndex = this.dislikes.findIndex(
    (dislike) => dislike.user.toString() === userId.toString(),
  );

  if (likedIndex > -1) {
    // User already liked - remove like
    this.likes.splice(likedIndex, 1);
    this.likeCount = this.likes.length;
    await this.save();
    return {
      action: "unliked",
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount,
    };
  } else {
    // User hasn't liked - add like
    this.likes.push({ user: userId });
    this.likeCount = this.likes.length;

    // If user had disliked, remove the dislike
    if (dislikedIndex > -1) {
      this.dislikes.splice(dislikedIndex, 1);
      this.dislikeCount = this.dislikes.length;
    }

    await this.save();
    return {
      action: "liked",
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount,
    };
  }
};

// Method to toggle dislike
FoodSchema.methods.toggleDislike = async function (userId) {
  const dislikedIndex = this.dislikes.findIndex(
    (dislike) => dislike.user.toString() === userId.toString(),
  );
  const likedIndex = this.likes.findIndex(
    (like) => like.user.toString() === userId.toString(),
  );

  if (dislikedIndex > -1) {
    // User already disliked - remove dislike
    this.dislikes.splice(dislikedIndex, 1);
    this.dislikeCount = this.dislikes.length;
    await this.save();
    return {
      action: "undisliked",
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount,
    };
  } else {
    // User hasn't disliked - add dislike
    this.dislikes.push({ user: userId });
    this.dislikeCount = this.dislikes.length;

    // If user had liked, remove the like
    if (likedIndex > -1) {
      this.likes.splice(likedIndex, 1);
      this.likeCount = this.likes.length;
    }

    await this.save();
    return {
      action: "disliked",
      likeCount: this.likeCount,
      dislikeCount: this.dislikeCount,
    };
  }
};

module.exports = mongoose.model("Food", FoodSchema);
