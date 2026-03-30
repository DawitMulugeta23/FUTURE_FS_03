import { useCart } from '../context/CartContext';
import axios from 'axios';
import { Trash2, CreditCard } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  
  // Calculate Total
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handleCheckout = async () => {
    try {
      // 1. Get the token from localStorage (assuming user is logged in)
      const token = localStorage.getItem('token'); 
      
      // 2. Call your backend Order API
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        { orderItems: cartItems, totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Redirect user to Chapa's hosted checkout page
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      alert("Please login to complete your order!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-amber-900">Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">Your cart is empty. Go grab some coffee!</p>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <p className="text-gray-500">{item.qty} x {item.price} ETB</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <div className="mt-8 flex flex-col items-end">
            <h3 className="text-2xl font-bold mb-4">Total: <span className="text-amber-600">{totalPrice} ETB</span></h3>
            <button 
              onClick={handleCheckout}
              className="bg-amber-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-amber-700 transition shadow-lg w-full md:w-auto"
            >
              <CreditCard size={22} /> Pay with Chapa (Telebirr/CBE)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;