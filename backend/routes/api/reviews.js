const express = require('express');
const { Spot, spotImage, Review, User, reviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateReviews = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


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
 return res.json(reviews)
});


// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
const reviewId = req.params.reviewId;
const user = req.user.id;
const { url } = req.body;

const review = await Review.findByPk(`${reviewId}`);
if(!review) {
  return res.status(404).json({
    message: "Review couldn't be found"
  })
} else if (review.userId !== user) {
  return res.status(403).json({
    message: "Forbidden"
  })
}
const numImages = await reviewImage.count({
  where: {
    reviewId: reviewId
  }
})
 if (numImages > 10) {
  return res.status(403).json({
    message:"Maximum number of images for this resource was reached"
  })
}
else {
  const newImage = reviewImage.build({
    reviewId: reviewId,
    url: url
  })

    await newImage.save()
      const image = await reviewImage.findByPk(newImage.id, {
        attributes: [
          "id",
          "url"
        ]
      })

      return res.json(image)
    }
});

// Edit a Review
router.put('/:reviewId',requireAuth, validateReviews, async (req, res, next)=> {
  const reviewId = req.params.reviewId;
  const user = req.user.id;
  const { review, stars } = req.body

  try {
    const findReview = await Review.findByPk(`${reviewId}`)
  if (!findReview) {
    return res.status(404).json({
      message: "Review couldn't be found"
    })
  } else if (review.id !== user) {
    return res.status(403).json({
      message: "Forbidden"
    })
  } else {
    findReview.set({
      review: review,
      stars: stars

    })
    await findReview.save();
   return res.json(findReview)
  }
  } catch(err) {
    console.error(err)
    next(err)
  }
});


// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res)=> {
const reviewId = req.params.reviewId;
const user = req.user.id;

const deleteReview = await Review.findByPk(`${reviewId}`);
if (!deleteReview) {
  return res.status(404).json({
    message: "Review couldn't be found"
  })
} else if (review.id !== user) {
  return res.status(403).json({
    message: "Forbidden"
  })
} else {
  await deleteReview.destroy()
 return res.json({
    message: "Successfully deleted"
  })
}
});




module.exports = router;
