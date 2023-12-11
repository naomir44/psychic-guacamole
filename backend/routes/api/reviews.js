const express = require('express');
const { Spot, spotImage, Review, User, reviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
const userId = req.user.id;

  const reviews = await Review.findAll({
    where: { userId: userId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot
      },
      {
        model: reviewImage
      }
    ]
  })
  res.json({ reviews })
});


// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
const reviewId = req.params.reviewId;
const { url } = req.body;

const review = await Spot.findByPk(`${reviewId}`);
if(!review) {
  const err = new Error("Review couldn't be found")
  err.status = 404;
  next(err)
}
const numImages = await Review.count({
  where: {
    review: reviewId
  }
})
if (numImages > 10) {
  const err = new Error("Maximum number of images for this resource was reached")
  err.status = 403;
  next(err)
}
else {
  const newImage = await reviewImage.create({
    reviewId: reviewId,
    url:url
  })
  res.json(newImage)
}
});

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next)=> {
  const reviewId = req.params.reviewId;
const { review, stars } = req.body

  try {
    const findReview = await Review.findByPk(`${reviewId}`)
  if (!findReview) {
    const err = new Error("Review couldn't be found")
    err.status = 404;
    next(err)

  } else {
    findReview.set({
      review: review,
      stars: stars

    })
    await findReview.save();
    res.json(findReview)
  }
  } catch(err) {
    console.error(err)
    next(err)
  }

});


// Delete a Review

router.delete('/:reviewId', requireAuth, async (req, res, next)=> {
const reviewId = req.params.reviewId;

const deleteReview = await Review.findByPk(`${reviewId}`);
if (!deleteReview) {
  const err = new Error("Review couldn't be found")
  err.status = 404;
  next(err)
} else {
  await deleteReview.destroy()
  res.json({
    message: "Successfully deleted"
  })
}
});





module.exports = router;
