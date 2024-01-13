const express = require('express');
const { Spot, spotImage, Review, User, reviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//Delete a Spot Image

router.delete('/:imageId', requireAuth, async (req, res)=> {
const imageId = req.params.imageId;
const user = req.user.id;

const image = await Spot.findByPk(imageId)
if (!image) {
 return res.status(404).json({
  message: "Spot Image couldn't be found"
 })
} else if (Spot.id !== user) {
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
