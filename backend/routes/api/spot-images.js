const express = require('express');
const { Spot, spotImage, Review, User, reviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Delete a Spot Image

router.delete('/:imageId', requireAuth, async (req, res, next)=> {
const imageId = req.params.imageId;

const image = await Spot.findByPk(`${imageId}`)
if (!image) {
  const err = new Error("Spot Image couldn't be found")
  err.status = 404;
  next(err)
} else {
    await image.destroy()
    res.json({
        message: "Successfully deleted"
    })
}
});




module.exports = router;
