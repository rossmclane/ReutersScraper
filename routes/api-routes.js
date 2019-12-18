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

        let link = $(element)
          .find("h2 > a")
          .attr("href");

        result = {
          headline: headline,
          story: story,
          link: link
        };

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
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
      .populate("comments")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/api/articles/:id", function(req, res) {
    console.log(req.params.id);
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comments: dbComment._id } },
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
