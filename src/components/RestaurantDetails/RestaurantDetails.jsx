import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import restaurantService from "../../services/restaurantService.js";
import ReviewForm from "../ReviewForm/ReviewForm";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading.jsx";
import styles from "./RestaurantDetails.module.css";
import RatingReview from "../RatingReview/RatingReview.jsx";

const RestaurantDetails = ({ user, handleDeleteRestaurant, review }) => {
  const { restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState(null);

  const setRating = () => { return }

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantData = await restaurantService.show(restaurantId);
        setRestaurant(restaurantData);
      } catch (error) {}
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleAddReview = async (reviewFormData) => {
    const newReview = await restaurantService.createReview(
      restaurantId,
      reviewFormData
    );
    setRestaurant({
      ...restaurant,
      reviews: [...restaurant.reviews, newReview],
    });
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await restaurantService.deleteReview(restaurant._id, reviewId);
      setRestaurant({
        ...restaurant,
        reviews: restaurant.reviews.filter((review) => review._id !== reviewId),
      });
    } catch (error) {}
  };

  if (!restaurant) return <Loading />;

    return (
        <main className={styles.container}>
            <section style={{padding: '0px'}}>
                <header>
                    <img src={restaurant.image ? restaurant.image : "../../public/images/default-restaurant-image.png"} alt="a restaurant logo" />
                    <h1>{restaurant.name}</h1>
                    <>
                    <Link id={styles.editLink} to={`/restaurants/${restaurantId}/edit`}>Edit</Link>
                    <button onClick={() => handleDeleteRestaurant(restaurantId)}>Delete</button>
                    </>
                </header>
                <div id={styles.restaurantBio}>
                    <p>{restaurant.category}</p>
                    <p>{restaurant.hours}</p>
                    <p style={{fontSize:'large'}}>{restaurant.description}</p>
                </div>  
            </section>
            <section>
                <div>
                    <h2 style={{margin:'20px'}}>Reviews</h2>
                    <ReviewForm handleAddReview={handleAddReview} />
                    {!restaurant.reviews.length && <p>Be the first to review this restaurant!</p>}
                </div>

                {restaurant.reviews.map((review) => (
                <article key={review._id}>
                    <div>
                        <h3 style={{borderBottom:'solid 1px gray', margin:'0 0 6px'}}>{review.author.username}</h3>
                        <div className={styles.starRating} style={{display:'flex', flexDirection:'row'}}>
                          <RatingReview rating={review.rating} setRating={setRating}/>
                        </div>
                        <p>{review.text}</p>
                    </div>
                    <header style={{padding:'0', justifyContent:'flex-end', gap: '10px'}}>
                        {review.author._id === user._id && (
                        <>
                            <Link id={styles.editLink}
                            to={`/restaurants/${restaurantId}/reviews/${review._id}/edit`}
                            >
                            Edit
                            </Link>
                            <button onClick={() => handleDeleteReview(review._id)}>
                            Delete
                            </button>
                        </>
                        )}
                    </header>
                </article>
                ))}
            </section>
    </main>
  );
};

export default RestaurantDetails;
