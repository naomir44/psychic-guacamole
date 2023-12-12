const express = require('express');
const { Spot, SpotImage, User, Review, reviewImage, Booking } = require('../../db/models');
// const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const router = express.Router();


//get all spots
router.get('/', async (req, res, next) => {
try {
  const spot = await Spot.findAll({
    attributes: ['id', 'ownerId', 'address','city','state','country','lat','lng','name','description','price','createdAt','updatedAt','avgRating','previewImage']
  })
 return res.json(spot)
} catch(err) {
  console.error(err)
  next(err);
}
});

//get all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
 const userId = req.user.id;

 const spot = await Spot.findAll({
  where: {
    ownerId:userId
  }
 })
 return res.json(spot)
});


//Get details of a Spot from an id

router.get('/:spotId', requireAuth, async (req, res, next)=> {
const id = req.params.spotId;

try {
  const spot = await Spot.findAll({
    where: {id: `${id}`},
    include: SpotImage
  });
  return res.json(spot)
} catch {
  res.status(404).json({
    message: "Spot couldn't be found"
    })
  }
});

//Create a Spot
router.post('/', requireAuth, async (req, res, next)=> {
const { address, city, state, country, lat, lng, name, description, price } = req.body;
const userId = req.user.id;
try{
  const newSpot = await Spot.create({
    ownerId: userId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
})
return res.status(201).json(newSpot)

} catch(err){
  console.error(err)
  next(err)
}
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next)=> {
const spotId = req.params.spotId;
const userId = req.user.id;

const { url, preview } = req.body;

const spot = await Spot.findByPk(`${spotId}`);
if(!spot) {
  const err = new Error("Spot couldn't be found")
  err.status = 404
  next(err)
} else {
  const newImage = await SpotImage.create({
    url,
    preview
  })
  return res.json(newImage)
}
});

//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next)=> {
const spotId = req.params.spotId;
const { address, city, state, country, lat, lng, name, description, price } = req.body;

try {
const spot = await Spot.findByPk(spotId)
if (!spot) {
  const err = new Error("Spot couldn't be found")
  err.status = 404
  next(err)
} else {
  spot.set({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  })
  await spot.save()
  return res.json(spot)
}

} catch(err) {
  console.error(err)
  next(err)
}
});


//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res)=> {
const spotId = req.params.spotId;

const spot = await Spot.findByPk(`${spotId}`);
if(!spot) {
  const err = new Error("Spot couldn't be found")
  err.status = 404;
  next(err)
}else {
   await spot.destroy();
   return res.json({
    message: "Successfully deleted"
  })
}
});


// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res)=> {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(`${spotId}`);
  if (!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404
    next(err)
  } else {
    const reviews = await Review.findAll({
      where: { spotId: spotId },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: reviewImage,
        attributes: ['id', 'url']
      }]
    })
   return res.json(reviews)
  }
   });


  //  Create a Review for a Spot based on the Spot's id
  router.post('/:spotId/reviews', requireAuth, async (req, res, next)=> {
    const spotId = req.params.spotId;
    const userId = req.user.id
    const { review, stars } = req.body;

    try {
    const spot = await Spot.findByPk(`${spotId}`);
    const reviews = await Review.findAll({
      where: {
        userId: userId,
        spotId: spotId
       }
    })
    if (!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404
    next(err)
}
  else if (reviews.length) {
    const err = new Error("User already has a review for this spot")
    err.status = 500
    next(err)
  }else {
    const newReview = await Review.create({
      userId: userId,
      spotId: spotId,
      review: review,
      stars: stars
    })
    return res.status(201).json(newReview)
  }
} catch(err) {
  console.error(err)
  next(err)
}
  });


// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next)=> {
const spotId = req.params.spotId;
const userId = req.user.id;

const spotBooking = await Spot.findByPk(`${spotId}`);
if (!spotBooking) {
  const err = new Error("Spot couldn't be found")
  err.status = 404;
  next(err)
} else if (Spot.ownerId === userId) {
  const ownerBooking = await Booking.findAll({
    where: {
      userId: userId
    },
    include: {
      model: 'User',
      attributes: ['id', 'firstName', 'lastName']
    }
  })
  return res.json(ownerBooking)
}  else {
    const userBooking = await Booking.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json(userBooking)
}
});

// // Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next)=> {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(`${spotId}`);
  if (!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404;
    next(err)
  };
      try {
        const bookings = await Booking.findAll({
          where: {
            spotId: spotId
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
              const validBooking = await Booking.create({
                spotId: spotId,
                userId: userId,
                startDate: startDate,
                endDate: endDate
              })
              return res.json(validBooking)

      } catch(err) {
        console.error(err)
        next(err)
      }
});



module.exports = router;
