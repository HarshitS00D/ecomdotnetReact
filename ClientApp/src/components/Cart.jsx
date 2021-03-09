import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { List, Divider, Button, Tag, message } from "antd";

import CartContext from "../contexts/CartContext";

const Cart = props => {
  const cartContext = useContext(CartContext);
  const [errors, setErrors] = useState({});
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      const cartArray = [];
      for (let key in cartContext.cart) {
        cartArray.push(cartContext.cart[key]);
      }

      let totalPrice = 0;
      cartArray.forEach(item => {
        totalPrice += item.price * item.quantity;
      });

      setTotalPrice(totalPrice);
      setCart(cartArray);
    },
    [cartContext]
  );

  const decreaseItemQuantity = item => {
    cartContext.decreaseQuantity(item);
  };

  const increaseItemQuantity = item => {
    if (item.quantity === item.totalQuantity) {
      return message.error("Quantity exceeds total quantity!");
    }

    cartContext.increaseQuantity(item);
  };

  const removeItemFromCart = item => {
    cartContext.removeFromCart(item);
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post("/api/product/checkout", cart);

      if (result.status === 200) {
        console.log("200");
        cartContext.emptyCart();
        message.success("Thank you for shopping with us!");
        props.history.push("/");
      }
    } catch (err) {
      console.log({ err });

      let obj = {};
      for (let key in err.response.data) {
        obj = { ...obj, [key]: err.response.data[key] };
      }

      setErrors(obj);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Your Cart</h2>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<a>{item.productName}</a>}
              description={
                <>
                  <div>{item.productDesc}</div>
                  <div>{`Price: ${item.price}`}</div>
                  <div>
                    Quantity: <Tag color="blue">{item.quantity}</Tag>
                    <Button onClick={() => decreaseItemQuantity(item)}>
                      -
                    </Button>
                    <Button onClick={() => increaseItemQuantity(item)}>
                      +
                    </Button>
                    <Tag color="red" visible={!!errors[item.productId]}>
                      {errors[item.productId]}
                    </Tag>
                  </div>
                </>
              }
            />
            <div>
              &#x20B9; {item.price * item.quantity + "  "}
              <Button danger onClick={() => removeItemFromCart(item)}>
                Remove
              </Button>
            </div>
          </List.Item>
        )}
      />
      <Divider />
      <div style={{ float: "right" }}>
        <div>
          <b>Total:</b> &#x20B9; {totalPrice}
        </div>
        <Button
          type="primary"
          disabled={cart.length ? false : true}
          onClick={handleCheckout}
          loading={isLoading}
        >
          Checkout
        </Button>
      </div>
    </>
  );
};

export default Cart;
