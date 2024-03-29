const express = require('express');
const { Spot, spotImage, Review, User, reviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { where } = require('sequelize');
const router = express.Router();


// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res)=>{
const userId = req.user.id;

const bookings = await Booking.findAll({
  where: {userId: userId},
  include:
    {
      model: Spot,
      attributes: ["id","ownerId","address","city","state","country","lat","lng","name","price"],
      include: { model: spotImage }
  }

})
    let bookingList = []
    bookings.forEach(booking => {
      bookingList.push(booking.toJSON())
    })
    bookingList.forEach(booking => {
        booking.Spot.spotImages.forEach(image => {
          booking.Spot.previewImage = image.url
        })
        delete booking.Spot.spotImages
    })
  return res.json({
   Bookings: bookingList
  })

});

//Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res)=> {
  let bookingId = req.params.bookingId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const booking = await Booking.findByPk(bookingId)
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  } else if (booking.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden"
    })
  } else if (end <= today) {
    return res.status(403).json({
      message: "Past bookings can't be modified"
    })
  } else if (start < today && end <= start) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate"
      }
    })
  } else if (start < today) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past"
      }
    })
  } else if (end <= start) {
    return res.status(400).json({
      message: "Bad Request",
      errors: "endDate cannot be on or before startDate"
    })
  }

  const bookings = await Booking.findAll({
    where: { spotId: booking.spotId }
  })
      bookings.forEach(booking => {
        bookingId = parseInt(bookingId)
        if ((startDate >= booking.startDate && startDate <= booking.endDate) && (endDate >= booking.startDate && endDate <= booking.endDate) && booking.id !== bookingId) {
          return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
          })
        } else if (startDate >= booking.startDate && startDate <= booking.endDate && booking.id !== bookingId) {
          return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking"
            }
          })
        } else if (endDate >= booking.startDate && endDate <= booking.endDate && booking.id !== bookingId) {
          return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "endDate": "End date conflicts with an existing booking"
            }
          })
        } else if (startDate <= booking.startDate && endDate >= booking.endDate && booking.id !== bookingId) {
          return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
          })
        }
      })
          booking.set({
            startDate: startDate,
            endDate: endDate
          })
            await booking.save()
            return res.json(booking)
})


//Delete a Booking

router.delete('/:bookingId', requireAuth, async (req, res, next)=> {
const bookingId = req.params.bookingId;
const user = req.user.id;
const today = new Date();

const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  } else if (booking.userId !== user) {
      return res.status(403).json({
        message: "Forbidden"
      })
  }
  else if (booking.startDate >= today) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted"
    })
  } else {
      await booking.destroy()
     return res.json({
           message: "Successfully deleted"
      })
  }
});




module.exports = router;
