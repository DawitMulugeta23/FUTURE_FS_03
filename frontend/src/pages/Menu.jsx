import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await axios.get("http://localhost:5000/api/food");
      setFoods(data.data);
    };
    fetchFoods();
  }, []);

  return (
    <div className="menu-container">
      <h1>Yesekela Café Menu</h1>
      <div className="grid">
        {foods.map((food) => (
          <div key={food._id} className="food-card">
            <img src={food.image} alt={food.name} />
            <h3>{food.name}</h3>
            <p>{food.price} ETB</p>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
