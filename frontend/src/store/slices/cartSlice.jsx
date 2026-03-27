import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  };
};

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    totalQuantity: state.totalQuantity,
    totalAmount: state.totalAmount,
  }));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.menuItem === newItem.menuItem);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        toast.success(`Added another ${newItem.name} to cart`);
      } else {
        state.items.push(newItem);
        toast.success(`${newItem.name} added to cart`);
      }
      
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find(item => item.menuItem === id);
      state.items = state.items.filter(item => item.menuItem !== id);
      toast.success(`${item?.name} removed from cart`);
      
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.menuItem === id);
      
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.menuItem !== id);
        }
      }
      
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      saveCartToStorage(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
      toast.success('Cart cleared');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;