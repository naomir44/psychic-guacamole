const express = require('express');
const { Spot, spotImage, Review, User, reviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Delete a Spot Image

router.delete('/:imageId', requireAuth, async (req, res, next)=> {
const imageId = req.params.imageId;

const image = await Spot.findByPk(`${imageId}`)
if (!image) {
 return res.status(404).json({
  message: "Spot Image couldn't be found"
 })
} else {
    await image.destroy()
   return res.json({
        message: "Successfully deleted"
    })
}
});




module.exports = router;
