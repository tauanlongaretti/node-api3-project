const express = require('express');

const userDb = require('./userDb.js');

const router = express.Router();

// POST - New post
router.post('/', (req, res) => {
  const postInfo = req.body;

  userDb.insert(postInfo)
    .then(post => {
      if (postInfo) {
        res.status(201).json({ post })
      } else {
        res.status(400).json({ success: false, errorMessage: "Please provide content for the post."})
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

// GET - Get all posts
router.get('/', (req, res) => {
  userDb.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ error: "Error retrieving the posts" })
    })
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
