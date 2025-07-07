"use client";

import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  originalPrice: number;
  totalWithTax: number;
  image: string;
  barcode: string;
  quantity: number;
  minQuantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalWithTax: number;
}

const CART_STORAGE_KEY = 'labass_cart';

// Helper function to get cart from localStorage
const getCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    totalWithTax: 0
  };
};

// Helper function to save cart to localStorage and dispatch event
const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Calculate totals helper
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWithTax = items.reduce((sum, item) => sum + (item.totalWithTax * item.quantity), 0);
  
  return { totalItems, subtotal, totalWithTax };
};

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    totalWithTax: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadedCart = getCartFromStorage();
    setCart(loadedCart);
  }, []);

  // Add item to cart
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const currentCart = getCartFromStorage();
    const existingItem = currentCart.items.find(item => item.id === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      // Update existing item quantity
      newItems = currentCart.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      newItems = [...currentCart.items, { ...product, quantity }];
    }

    const totals = calculateTotals(newItems);
    const newCart = {
      items: newItems,
      ...totals
    };

    saveCartToStorage(newCart);
    setCart(newCart);
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId: number) => {
    const currentCart = getCartFromStorage();
    const newItems = currentCart.items.filter(item => item.id !== productId);
    const totals = calculateTotals(newItems);
    const newCart = {
      items: newItems,
      ...totals
    };

    saveCartToStorage(newCart);
    setCart(newCart);
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentCart = getCartFromStorage();
    const newItems = currentCart.items.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(quantity, item.minQuantity) }
        : item
    );
    const totals = calculateTotals(newItems);
    const newCart = {
      items: newItems,
      ...totals
    };

    saveCartToStorage(newCart);
    setCart(newCart);
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    const emptyCart = {
      items: [],
      totalItems: 0,
      subtotal: 0,
      totalWithTax: 0
    };
    
    saveCartToStorage(emptyCart);
    setCart(emptyCart);
  }, []);

  // Get item quantity by product ID
  const getItemQuantity = useCallback((productId: number) => {
    const currentCart = getCartFromStorage();
    const item = currentCart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, []);

  // Refresh cart from localStorage
  const refreshCart = useCallback(() => {
    const loadedCart = getCartFromStorage();
    setCart(loadedCart);
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    refreshCart
  };
};