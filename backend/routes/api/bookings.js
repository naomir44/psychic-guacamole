const express = require('express');
const { Spot, spotImage, Review, User, reviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res)=>{
const userId = req.user.id;

const bookings = await Booking.findAll({
  where: {userId: userId},
  include: [
    {
      model: Spot
  }
]
})
  return res.json(bookings)

});

//Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next)=> {
  const bookingId = req.params.id
  const user = req.user.id;

  const { startDate, endDate } = req.body;
  const today = new Date()

  const booking = await Booking.findByPk(`${bookingId}`)
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  } else if (booking.id !== user) {
    return res.status(403).json({
      message: "Forbidden"
    })
  }
  else if (endDate <= today) {
    return res.status(403).json({
      message: "Past bookings can't be modified"
    })
  }
  try {
    const bookings = await Booking.findAll({
      where: {
        spotId: booking.spotId
      }
    });

      bookings.forEach(booking => {
        if (endDate >= booking.startDate && startDate <= booking.endDate)
        return res.status(403).json({
          "message": "Sorry, this spot is already booked for the specified dates",
          "errors": {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
          }
        })
      });
        booking.set({
          startDate: startDate,
          endDate: endDate
        })
        await booking.save()
        return res.json(booking)

    } catch(err) {
      console.error(err)
      next(err)
    }
});


//Delete a Booking

router.delete('/:bookingsId', requireAuth, async (req, res, next)=> {
const bookingId = req.params.bookingId;
const user = req.user.id;
const today = new Date();

const booking = await Booking.findByPk(`${bookingId}`);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  } else if (booking.id !== user || Spot.id !== user) {
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
