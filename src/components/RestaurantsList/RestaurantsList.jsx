import { Link } from "react-router-dom";
 
const RestaurantsList = (props) => {
    return(
        <>
        <h1>Restaurants</h1>
        <main>
            {props.restaurants.map((restaurant) => (
                <Link key={restaurant._id} to={`/restaurants/${restaurant._id}`}>
                    <header>
                        <div>
                            <h2>{restaurant.name}</h2>
                        </div>
                    </header>
                </Link>

            ))}
        </main>
        </>
    )
}

export default RestaurantsList;