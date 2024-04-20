import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/reviews";

const ManageReviews = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)
  const reviews = useSelector((state) => state.reviews)
  const reviewsList = Object.values(reviews)
  const ownerReviews = [];

  reviewsList.forEach((review) => {
    if (review.ownerId === user.id) ownerReviews.push(review)
  })

  useEffect(() => {
    dispatch(fetchReviews())
  }, [dispatch])

  // if (ownerReviews.length === 0) {
  //   return (
  //     <NavLink to={'/reviews'} >
  //       <button>Post A Review</button>
  //     </NavLink>
  //   )
  // }

  return (
    <>
      <h1>Manage Reviews</h1>
    </>
  )
}


export default ManageReviews;
