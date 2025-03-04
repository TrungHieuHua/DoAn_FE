export const addCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find((item) => item.product.id === product.id);
    if (existingItem) {
        const updatedItem = {
            ...existingItem,
            quantity: parseInt(existingItem.quantity) + 1,
        };
        const updatedCartItems = cartItems.map((item) => (item === existingItem ? updatedItem : item));
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
        const newItem = {
            product: product,
            quantity: 1,
        };
        const updatedCartItems = [...cartItems, newItem];
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
};

export const update = (product, newQuantity) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }

    const existingItem = cartItems.find((item) => item.product.id === product.id);
    if (existingItem) {
        const updatedItem = {
            ...existingItem,
            quantity: newQuantity,
        };
        const updatedCartItems = cartItems.map((item) => (item === existingItem ? updatedItem : item));
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
};

export const getCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return cartItems;
};
export const removeFromCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter((item) => item.product.id !== product.id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
};

export const removeItem = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter((item) => item.product.id !== product.id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
};

export const calculateTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

export const checkout = () => {
    localStorage.removeItem('cartItems');
    sessionStorage.removeItem('cartItems');
};
