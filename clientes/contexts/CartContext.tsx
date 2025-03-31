import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../components/ProductTable';


export type CartItem = {
    product: Product;
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    getTotal: () => number;
};


const CartContext = createContext<CartContextType | undefined>(undefined);


export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};


type CartProviderProps = {
    children: ReactNode;
};


export const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<CartItem[]>([]);

    
    const addToCart = (product: Product, quantity: number) => {
        setItems(prevItems => {
            
            const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);

            if (existingItemIndex >= 0) {
                
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                
                return [...prevItems, { product, quantity }];
            }
        });
    };

   
    const removeFromCart = (productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    
    const getTotal = () => {
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 
