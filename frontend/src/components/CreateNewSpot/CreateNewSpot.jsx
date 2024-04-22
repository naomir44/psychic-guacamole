import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot, fetchAddImage } from "../../store/spots";
import { useNavigate } from 'react-router-dom';
import './CreateNewSpot.css';


const CreateNewSpot = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.session.user)
  const navigate = useNavigate();
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [img1, setImg1] = useState('')
  const [img2, setImg2] = useState('')
  const [img3, setImg3] = useState('')
  const [img4, setImg4] = useState('')
  // const [img5, setImg5] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [errors, setErrors] = useState({})



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
    if (!img1) valErrors.img1 = "Preview Image is required.";
    // if (!img1.endsWith('.png') || !img1.endsWith('.jpg') || !img1.endsWith('.jpeg')) valErrors.img1 = 'Image URL must end in .png,.jpg, or .jpeg';
    // if (!img2.endsWith('.png') || !img2.endsWith('.jpg') || !img2.endsWith('.jpeg')) valErrors.img2 = 'Image URL must end in .png, .jpg, or .jpeg';
    // if (!img3.endsWith('.png') || !img3.endsWith('.jpg') || !img3.endsWith('.jpeg')) valErrors.img3 = 'Image URL must end in .png, .jpg, or .jpeg';
    // if (!img4.endsWith('.png') || !img4.endsWith('.jpg') || !img4.endsWith('.jpeg')) valErrors.img4 = 'Image URL must end in .png, .jpg, or .jpeg';
    if (Object.values(valErrors).length > 0) {
      setErrors(valErrors)
      return
    } else {
      const payload = {
        ownerId: user.id,
        country,
        address,
        city,
        state,
        description,
        name,
        price,
        lat: latitude,
        lng: longitude,
        previewImage: img1
    }

    const newSpot = await dispatch(createSpot(payload))
    const newSpotId = newSpot.id
    const newSpotPreviewImage = {
      url: img1,
      preview: true,
      spotId: newSpotId
    }
    await dispatch(fetchAddImage(+newSpotId, newSpotPreviewImage))
    if (newSpot) {
      navigate(`/spots/${newSpot.id}`)
    }
    }
  }

return (
  <>
    <h1 className="create-new-spot-h1">Create a new spot</h1>
    <form className="new-spot-form" onSubmit={handleSubmit}>
    <h2>Where&apos;s your place located?</h2>
    <p>
      Guests will only get your exact address once they booked a
      reservation.
    </p>
      <label>Country
        <input type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"

        />
      </label>
      {errors.country && <div className="create-spot-errors">{errors.country}</div>}
      <label>Street Address
        <input type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"

        />
      </label>
      {errors.address && <div className="create-spot-errors">{errors.address}</div>}
      <div className="city-state">
      <label>City
        <input type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"

        />
      </label>
      <label>State
        <input type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="STATE"

        />
      </label>
      </div>
      <div>
      {errors.city && <div className="create-spot-errors">{errors.city}</div>}
      {errors.state && <div className="create-spot-errors">{errors.state}</div>}
      </div>
    <div className="lng-lat">
    <label>Latitude
        <input type="text"
          value={latitude || ''}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
        />
      </label>
      <label>Longitude
        <input type="text"
          value={longitude || ''}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
        />
      </label>
    </div>
      <div className="line"></div>
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amentities like
        fast wifi or parking, and what you love about the neighborhood.</p>
      <input className="description"
      type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Please write at least 30 characters"

      />

      {errors.description && <div className="create-spot-errors">{errors.description}</div>}
      <div className="line"></div>
      <h2>Create a name for your spot</h2>
      <p>Catch guests&apos; attention with a spot name that highlights what makes
        your place special.</p>

      <input
      type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name of your spot"

      />
      {errors.name && <div className="create-spot-errors">{errors.name}</div>}
      <div className="line"></div>
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher
        in search results.</p>

      <label className="price-container">
        <div className="dollar-sign">$</div>
        <input
        className="price-per-night"
        type="text"
          value={price || ''}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night (USD)"

        />
      </label>
      {errors.price && <div className="create-spot-errors">{errors.price}</div>}
      <div className="line"></div>
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot</p>
      <input type="text"
        value={img1}
        onChange={(e) => setImg1(e.target.value)}
        placeholder="Preview Image URL"

      />
      {errors.img1 && <div className="create-spot-errors">{errors.img1}</div>}

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

      <button className="create-spot-button"
      type="submit"
        disabled={errors.length}
      >Create Spot</button>
    </form>

  </>
)
}

export default CreateNewSpot;
