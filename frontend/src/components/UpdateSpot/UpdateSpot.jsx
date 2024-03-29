import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEditSpot, fetchOneSpot } from "../../store/spots";
import { useNavigate, useParams } from 'react-router-dom';
 import './UpdateSpot.css';


const UpdateSpot = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots[spotId])
  // const user = useSelector((state) => state.session.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [country, setCountry] = useState(spot.country)
  const [address, setAddress] = useState(spot.address)
  const [city, setCity] = useState(spot.city)
  const [state, setState] = useState(spot.state)
  const [description, setDescription] = useState(spot.description)
  const [name, setName] = useState(spot.name)
  const [price, setPrice] = useState(spot.price)
  const [img1, setImg1] = useState('')
  const [img2, setImg2] = useState('')
  const [img3, setImg3] = useState('')
  const [img4, setImg4] = useState('')
  // const [img5, setImg5] = useState('')
  const [latitude, setLatitude] = useState(spot.lat)
  const [longitude, setLongitude] = useState(spot.lng)
  const [errors, setErrors] = useState({})
  const [isLoaded, setIsLoaded ] = useState(false)


  useEffect(() => {
    dispatch(fetchOneSpot(+spotId))
      .then(setIsLoaded(true))
  }, [dispatch, spotId])


  const handleSubmit = async (e) => {
    e.preventDefault()
    let valErrors = {}

    if (country.length === 0) valErrors.country = 'Country is required';
    if (address.length === 0) valErrors.address = 'Address is required';
    if (city.length === 0) valErrors.city = "City is required";
    if (state.length === 0) valErrors.state = 'State is required';
    if (description.length < 30) valErrors.description = 'Description needs a minimum of 30 characters';
    if (name.length === 0) valErrors.name = 'Name is required';
    if (!price) valErrors.price = "Price is required";
    // if (!img1) valErrors.img1 = "Preview Image is required.";
    // if (!img1.endsWith('.png') || !img1.endsWith('.jpg') || !img1.endsWith('.jpeg')) valErrors.img1 = 'Image URL must end in .png,.jpg, or .jpeg';
    // if (!img2.endsWith('.png') || !img2.endsWith('.jpg') || !img2.endsWith('.jpeg')) valErrors.img2 = 'Image URL must end in .png, .jpg, or .jpeg';
    // if (!img3.endsWith('.png') || !img3.endsWith('.jpg') || !img3.endsWith('.jpeg')) valErrors.img3 = 'Image URL must end in .png, .jpg, or .jpeg';
    // if (!img4.endsWith('.png') || !img4.endsWith('.jpg') || !img4.endsWith('.jpeg')) valErrors.img4 = 'Image URL must end in .png, .jpg, or .jpeg';
    if (Object.values(valErrors).length > 0) {
      setErrors(valErrors)
      return
    } else {
      const payload = {
        country,
        address,
        city,
        state,
        description,
        name,
        price,
        lat: latitude,
        lng: longitude
        // img1,
        // img2,
        // img3,
        // img4,
        // img5
    }
    const updated = await dispatch(fetchEditSpot(spotId, payload))
    if (updated) {
      navigate(`/spots/${updated.id}`)
    }
    }
  }

return (
  <>
  {
    isLoaded &&
    <>

    <h1>Update your Spot</h1>
    <h2>Where&apos;s your place located?</h2>
    <p>
      Guests will only get your exact address once they booked a
      reservation.
    </p>
    <form className="update-spot-form" onSubmit={handleSubmit}>
      <label>Country
        <input type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"

        />
      </label>
      {errors.country && <p>{errors.country}</p>}
      <label>Street Address
        <input type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"

        />
      </label>
      {errors.address && <p>{errors.address}</p>}
      <label>City
        <input type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"

        />
      </label>
      {errors.city && <p>{errors.city}</p>}
      <label>State
        <input type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="STATE"

        />
      </label>
      {errors.state && <p>{errors.state}</p>}
      <label>Latitude
        <input type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
        />
      </label>
      <label>Longitude
        <input type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
        />
      </label>
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amentities like
        fast wifi or parking, and what you love about the neighborhood.</p>
      <input type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Please write at least 30 characters"

      />
      {errors.description && <p>{errors.description}</p>}
      <h2>Create a name for your spot</h2>
      <p>Catch guest&apos;s attention with a spot name that highlights what makes
        your place special.</p>

      <input type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name of your spot"

      />
      {errors.name && <p>{errors.name}</p>}
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher
        in search results.</p>

      <label>$
        <input type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night (USD)"

        />
      </label>
      {errors.price && <p>{errors.price}</p>}

      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot</p>
      <input type="text"
        value={img1}
        onChange={(e) => setImg1(e.target.value)}
        placeholder="Preview Image URL"

      />
      {errors.img1 && <p>{errors.img1}</p>}

      <input type="text"
        value={img2}
        onChange={(e) => setImg2(e.target.value)}
        placeholder="Image URL"
      />
      {errors.img2 && <p>{errors.img2}</p>}
      <input type="text"
        value={img3}
        onChange={(e) => setImg3(e.target.value)}
        placeholder="Image URL"
      />
      {errors.img3 && <p>{errors.img3}</p>}
      <input type="text"
        value={img4}
        onChange={(e) => setImg4(e.target.value)}
        placeholder="Image URL"
      />
      {errors.img4 && <p>{errors.img4}</p>}

      <button type="submit"
        disabled={errors.length}
      >Create Spot</button>
    </form>
    </>

  }
  </>
)
}

export default UpdateSpot;
