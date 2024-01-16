const express = require('express');
const { Spot, spotImage, Review, User, reviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();



router.delete('/:imageId', requireAuth, async (req, res)=> {
  const imageId = req.params.imageId;
  const user = req.user.id;

  const image = await reviewImage.findByPk(imageId, {
    include:[
      { model: Review }
    ]
  })
  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found"
     })
  }else if (image.Review.userId !== user) {
    return res.status(403).json({
      message: "Forbidden"
    })
  }
  else {
      await image.destroy()
     return res.json({
          message: "Successfully deleted"
      })
  }
  });





module.exports = router;
