const express = require('express');

const userDb = require('./userDb.js');

const postDb = require('../posts/postDb.js');

const router = express.Router();

// POST - New user
router.post('/', (req, res) => {
  const userInfo = req.body;

  userDb.insert(userInfo)
    .then(user => {
      if (userInfo) {
        res.status(201).json({ user })
      } else {
        res.status(400).json({ errorMessage: "Please provide content for the post."})
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
});

// POST - New post 
router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id }

  postDb.insert(postInfo)
    .then(post => {
        res.status(201).json(post)
      })
    .catch(() => {
      res.status(500).json({ errorMessage: "It was not possible to create this post" })
    })  
});

// GET - Get all users
router.get('/', (req, res) => {
  userDb.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ error: "Error retrieving the posts" })
    })
});

// GET - Get user by id
router.get('/:id', (req, res) => {
  const {id} = req.params

  userDb.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was a problem retrieving the user" })
    })
});

// GET - Get posts by ID
router.get('/:id/posts', (req, res) => {
  const {id} = req.params

  userDb.getUserPosts(id)
    .then(userPosts => {
      if (userPosts) {
        res.status(200).json(userPosts)
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was a problem retrieving user's posts" })
    })
});

// DELETE - Remove user from database
router.delete('/:id', validateUserId, (req, res) => {

  userDb.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been removed"});
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was problem removing the user from the database" });
    });
});

// PUT - Update user
router.put('/:id', [validateUserId, validateUser], (req, res) => {
  const {id} = req.params
  const changes = req.body

  userDb.update(id, changes)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "There was a problem updating the user" })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;
  userDb.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next(); 
        } else {
          next({ message: "user ID not found" })
        }
    })
    .catch(() => {
      res.status(500).json({ message: "There was a poblem finding the user"})
    })
}

function validateUser(req, res, next) {
  const body = req.body;

    if (!body && body === {}) {
       res.status(400).json({ message: "missing user data" })
     } else if (!body.name) {
       res.status(400).json({ message: "missing required name field" })
     } else {
       next();
     }
}

function validatePost(req, res, next) {
  const body = req.body;

    if (!body && body === {}) {
       res.status(400).json({ message: "missing user data" })
     } else if (!body.text) {
       res.status(400).json({ message: "missing required text field" })
     } else {
       next();
     }
}

module.exports = router;
