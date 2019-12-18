var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
  // Scrape news and insert into MongoDB
  app.get("/api/scrape", function(req, res) {
    axios.get("https://www.reuters.com/news/world").then(function(response) {
      var $ = cheerio.load(response.data);
      $(".story_with_image_featured").each(function(i, element) {
        let headline = $(element)
          .find("h2")
          .text();

        let story = $(element)
          .find("p.FeedItemLede_lede")
          .text();

        result = {
          headline: headline,
          story: story
        };

        db.Article.create(result)
          .then(function(dbArticle) {})
          .catch(function(err) {
            console.log(err);
          });
      });

      res.end();
    });
  });

  // Get all Articles
  app.get("/api/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Get all Articles
  app.get("/api/articles/saved", function(req, res) {
    db.Article.find({ saved: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Get all Articles
  app.get("/api/articles/:id", function(req, res) {
    db.Article.find({ _id: req.params.id })
      .populate("posts")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Add a new post
  app.post("/api/articles/:id", function(req, res) {
    console.log(req.params.id);
    db.Post.create(req.body)
      .then(function(dbPost) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { posts: dbPost._id } },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      });
  });

  app.post("/api/articles/save/:id", function(req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { saved: req.body.saved } },
      { new: true }
    )
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
