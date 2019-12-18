//Article model

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },

  story: {
    type: String,
    trim: true
  },

  link: {
    type: String,
    trim: true
  },

  saved: {
    type: Boolean,
    trim: true,
    default: false
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
