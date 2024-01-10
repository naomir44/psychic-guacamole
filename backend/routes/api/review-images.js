const express = require('express');
const { Spot, spotImage, Review, User, reviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res, next)=> {
  const imageId = req.params.imageId;

  const image = await Review.findByPk(`${imageId}`)
  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found"
     })
  } else {
      await image.destroy()
     return res.json({
          message: "Successfully deleted"
      })
  }
  });





module.exports = router;
