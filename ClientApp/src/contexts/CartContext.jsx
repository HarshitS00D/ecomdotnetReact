import React from "react";

export default React.createContext({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => {}
});