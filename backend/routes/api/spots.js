const express = require('express');
const { Spot, spotImage, User, Review, reviewImage, Booking } = require('../../db/models');
// const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

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

const validateGetAllSpots = [
check('page')
  .default(1)
  .isFloat({min: 1, max: 10 })
  .withMessage("Page must be greater than or equal to 1"),

  check('size')
  .default(20)
  .isFloat({ min:1, max: 20})
  .withMessage("Size must be greater than or equal to 1"),

  check('maxLat')
  .optional()
  .isDecimal()
  .withMessage("Maximum latitude is invalid"),

  check('minLat')
  .optional()
  .isDecimal()
  .withMessage("Minimum latitude is invalid"),

  check('minLng')
  .optional()
  .isDecimal()
  .withMessage("Maximum longitude is invalid"),

  check('maxLng')
  .optional()
  .isDecimal()
  .withMessage("Minimum longitude is invalid"),

  check('minPrice')
  .optional()
  .isDecimal()
  .isFloat({ min: 0 })
  .withMessage("Minimum price must be greater than or equal to 0"),

  check('maxPrice')
  .optional()
  .isDecimal()
  .isFloat({ min: 0 })
  .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
]



//get all spots
router.get('/', validateGetAllSpots, async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
try {
      page = !page ? 1 : parseInt(page)
      size = !size ? 20: parseInt(size)
      const pagination = {}

      if (page >= 1 && size >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
      }
          page = +page
          size = +size
          minLat = +minLat
          maxLat = +maxLat
          minLng = +minLng
          maxLng = +maxLng
          minPrice = +minPrice
          maxPrice = +maxPrice

      const where = {}

            if (minLat) {
              where.lat = {
                [Op.gte]: [minLat]
              }
            }
            if (maxLat) {
              where.lat = {
                [Op.lte]: [maxLat]
              }
            }
            if (minLat && maxLat) {
              where.lat = {
                [Op.between]: [minLat, maxLat]
              }
            }
            if (minLng) {
              where.lng = {
                [Op.gte]: [minLng]
              }
            }
            if (maxLng) {
              where.lng = {
                [Op.lte]: [maxLng]
              }
            }
            if (minLng && maxLng) {
              where.lng = {
                [Op.between]: [minLng, maxLng]
              }
            }
            if (minPrice) {
              where.price = {
                [Op.gte]: [minPrice]
              }
            }
            if (maxPrice) {
              where.price = {
                [Op.lte]: [maxPrice]
              }
            }
            if (minPrice && maxPrice) {
              where.price = {
                [Op.between]: [minPrice, maxPrice]
              }
            }


  const spots = await Spot.findAll({
  include: [
    { model: Review },
    { model: spotImage }
  ],
          where,
          ...pagination
  })
    let spotList = []
    spots.forEach(spot => {
      spotList.push(spot.toJSON())
    })
    console.log(spotList)
    spotList.forEach(spot => {
      spot.spotImages.forEach(image => {
        if (image.preview === true) {
          spot.previewImage = image.url
        }
      })
        if (!spot.previewImage) {
          spot.previewImage = "No preview image found"
        }
        delete spot.spotImages
    })

      spotList.forEach(spot => {
        let average = 0
        spot.Reviews.forEach(review => {
          average += review.stars
          average = average / spot.Reviews.length
          spot.avgRating = average
        })
          if (!spot.avgRating) {
            spot.avgRating = "No avgRating found"
          }
          delete spot.Reviews
      })

      return res.json({
        Spots: spotList,
        page,
        size
      })

} catch(err) {
  console.error(err)
  next(err);
}
});

//get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
 const userId = req.user.id;

 const spots = await Spot.findAll({
  where: {
    ownerId:userId
  },
  include: [
    { model: Review },
    { model: spotImage }
  ]
 })
 let spotList = []
 spots.forEach(spot => {
   spotList.push(spot.toJSON())
 })
 console.log(spotList)
 spotList.forEach(spot => {
   spot.spotImages.forEach(image => {
     if (image.preview === true) {
       spot.previewImage = image.url
     }
   })
     if (!spot.previewImage) {
       spot.previewImage = "No preview image found"
     }
     delete spot.spotImages
 })

   spotList.forEach(spot => {
     let average = 0
     spot.Reviews.forEach(review => {
       average += review.stars
       average = average / spot.Reviews.length
       spot.avgRating = average
     })
       if (!spot.avgRating) {
         spot.avgRating = "No avgRating found"
       }
       delete spot.Reviews
   })

   return res.json({
     Spots: spotList
   })
});


//Get details of a Spot from an id

router.get('/:spotId', async (req, res)=> {
const id = req.params.spotId;

  const spot = await Spot.findByPk(id, {
    include: [
      {
        model: spotImage,
        attributes: ["id", "url", "preview"]
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"]
      }
    ]
  })
    if (!spot) {
      res.status(404).json({
        message: "Spot couldn't be found"
      })
    }
      const numReviews = await Review.count({
        where: { spotId: id }
      })
      const reviews = await Review.findAll({
        where: { spotId: id }
      })
      let avg = 0
      reviews.forEach(review => {
        avg += review.stars
      })
      avg = avg / reviews.length
      const spotList = []
      spotList.push(spot.toJSON())
      spotList.forEach(spot => {
        spot.numReviews = numReviews
        spot.avgStarRating = avg
      })

    return res.json(spotList[0])
});

//Create a Spot
router.post('/', requireAuth, validateCreateSpot, async (req, res, next)=> {
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
      price,
  })
  return res.status(201).json(newSpot)

} catch(err){
  console.error(err)
  next(err)
}
});

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res)=> {
const spotId = req.params.spotId;
const user = req.user.id;
const { url, preview } = req.body;

const spot = await Spot.findByPk(spotId);
if(!spot) {
  return res.status(404).json({
    message: "Spot couldn't be found"
  })
} else if (spot.ownerId !== user) {
  return res.status(403).json({
    message: "Forbidden"
  })
}

else {
  const newImage = spotImage.build({
    spotId,
    url,
    preview
  })
    await newImage.save()
    const image = await spotImage.findByPk(newImage.id, {
      attributes: [
        'id',
        'url',
        'preview'
      ]
    })
  return res.json(image)
}
});

//Edit a Spot
router.put('/:spotId',requireAuth, validateCreateSpot, async (req, res, next)=> {
const spotId = req.params.spotId;
const user = req.user.id;
const { address, city, state, country, lat, lng, name, description, price } = req.body;

try {
const spot = await Spot.findByPk(spotId)
if (!spot) {
  return res.status(404).json({
    message: "Spot couldn't be found"
  })
} else if (spot.ownerId !== user) {
  return res.status(403).json({
    message: "Forbidden"
  })
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
const user = req.user.id;

const spot = await Spot.findByPk(spotId);
if(!spot) {
  return res.status(404).json({
    message: "Spot couldn't be found"
  })
} else if (spot.ownerId !== user) {
  return res.status(403).json({
    message: "Forbidden"
  })
}
else {
   await spot.destroy();
   return res.json({
    message: "Successfully deleted"
  })
}
});


// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next)=> {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
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
      return res.json({
        Reviews: reviews
      })
  }
   });


  //  Create a Review for a Spot based on the Spot's id
  router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next)=> {
    const spotId = req.params.spotId;
    const userId = req.user.id
    const { review, stars } = req.body;

    try {
    const spot = await Spot.findByPk(spotId);
    const reviews = await Review.findAll({
      where: {
        userId: userId,
        spotId: spotId
       }
    })
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      })
} else if (reviews.length) {
  return res.status(500).json({
    message: "User already has a review for this spot"
  })
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

const spot = await Spot.findByPk(spotId);
if (!spot) {
  return res.status(404).json({
    message: "Spot couldn't be found"
  })
} else if (spot.ownerId === userId) {
  const ownerBooking = await Booking.findAll({
    where: {
      spotId: spotId
    },
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }
  })
  return res.json({
    Bookings: ownerBooking
  })
}  else {
    const booking = await Booking.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json({
      Bookings: booking
    })
}
});

// // Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next)=> {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  } else if (spot.ownerId === userId) {
    return res.status(403).json({
      message: "Forbidden"
    })
  }  else if (end <= today) {
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
      try {
        const bookings = await Booking.findAll({
          where: {
            spotId: spotId
          }
        });

        bookings.forEach(booking => {
          if ((startDate >= booking.startDate && startDate <= booking.endDate) && (endDate >= booking.startDate && endDate <= booking.endDate)) {
            return res.status(403).json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
              }
            })
          } else if (startDate >= booking.startDate && startDate <= booking.endDate) {
            return res.status(403).json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "errors": {
                "startDate": "Start date conflicts with an existing booking"
              }
            })
          } else if (endDate >= booking.startDate && endDate >= booking.endDate) {
            return res.status(403).json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "errors": {
                "endDate": "End date conflicts with an existing booking"
              }
            })
          } else if (startDate <= booking.startDate && endDate >= booking.endDate) {
            return res.status(403).json({
              "message": "Sorry, this spot is already booked for the specified dates",
              "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
              }
            })
          }
        })
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
