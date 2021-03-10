import React, { useState, useEffect, useContext } from "react";
import { List, Card, Typography, Divider, Button, message } from "antd";
import axios from "axios";
import _ from "lodash";

import CartContext from "../contexts/CartContext";
import UserContext from "../contexts/UserContext";

const { Text } = Typography;

const Home = props => {
  const cartContext = useContext(CartContext);
  const userContext = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

  if (!userContext.user) {
    props.history.push("/login");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(
    () => {
      fetchProducts();
    },
    [props.location]
  );

  const fetchProducts = async () => {
      try {
          setIsLoading(true);
          const result = await axios.get("/api/product");
          setProducts(result.data);
      } catch (err) {
          console.log(err);
      }
      finally {
          setIsLoading(false);
      }
  };

    const handleDelete = async (productId) => {
        try {
            setIsLoading(true);
            const result = await axios.delete(`/api/product/${productId}`);
            if (result.status === 200) {
                fetchProducts();
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (productId) => {
        props.history.push(`/product/edit/${productId}`);
    }

  const addToCart = item => {
    let newQuantity = parseInt(document.getElementById(item.productId).value);
    if (newQuantity < 1) {
      return message.error("Quantity cannot be less than 1");
    }

    let totalQuantity = item.quantity;
    let clonedItem = _.cloneDeep(item);

    if (cartContext.cart[item.productId]) {
      clonedItem.quantity =
        cartContext.cart[item.productId].quantity + newQuantity;
    } else {
      clonedItem.quantity = newQuantity;
    }

    if (clonedItem.quantity > totalQuantity) {
      return message.error("Quantity cannot be more than total quantity!");
    }

    message.success(`${newQuantity} ${item.productName} added to the cart!`);
    clonedItem.totalQuantity = totalQuantity;
    cartContext.addToCart(clonedItem);
  };

  return (
    <>
          {userContext.user && userContext.user.userId === 1 ? (
              <List
                  loading={isLoading}
                  header={<h2>Products</h2>}
                  itemLayout="horizontal"
                  dataSource={products}
                  renderItem={item => (
                      <List.Item
                          actions={[
                              <Button type="primary" onClick={() => handleEdit(item.productId)}>Edit</Button >,
                              <Button danger onClick={() => handleDelete(item.productId)}>Delete</Button>
                          ]}
                          >
                          <List.Item.Meta
                              description={<div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                  <div><b>{item.productName}</b></div>
                                  <div>Description: {item.productDesc}</div>
                                  <div>Price: {item.price}</div>
                                  <div>Quantity: {item.quantity}</div>
                              </div>}
                          />
                          </List.Item>
                  )}
              />
      ) : (
                  <List
                      loading={isLoading}
          header={<h2>Products</h2>}
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={item => {
            return (
              <List.Item>
                <Card title={item.productName}>
                  <div>
                    <Text type="secondary"> Description </Text>:{" "}
                    {item.productDesc}{" "}
                  </div>
                  <div>
                    <Text type="secondary"> Price </Text>: &#x20B9; {item.price}{" "}
                  </div>
                  <div>
                    <Text type="secondary"> Quantity </Text>: {item.quantity}{" "}
                  </div>
                  <Divider type="horizontal" />
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <input
                      type="number"
                      id={item.productId}
                      defaultValue={1}
                      min={1}
                      max={item.quantity}
                      style={{ border: "1px solid #d3d3d3", width: "50%" }}
                    />
                    <Button type="primary" onClick={() => addToCart(item)}>
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </>
  );
};

export default Home;
