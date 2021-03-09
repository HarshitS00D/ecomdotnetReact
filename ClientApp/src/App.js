import React, { Component } from "react";
import { Route } from "react-router";
import _ from 'lodash';

import UserContext from "./contexts/UserContext";
import CartContext from "./contexts/CartContext";

import { Layout } from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import EditUser from "./components/EditUser";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Cart from './components/Cart';

import "antd/dist/antd.css";
import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);

    this.setUser = user => {
      this.setState({ user });
    };

      this.addToCart = item => {
          let cart = this.state.cart;
        cart[item.productId] = item;
      this.setState({ cart });
    };

      this.removeFromCart = item => {
        let cart = this.state.cart;
        cart = _.omit(cart, item.productId);
      this.setState({ cart });
      };

      this.decreaseQuantity = item => {
          let cart = this.state.cart;
          cart[item.productId].quantity -= 1;

          if (cart[item.productId].quantity === 0) {
              return this.removeFromCart(item);
          }
          this.setState({ cart });
      }

      this.increaseQuantity = item => {
          let cart = this.state.cart;
          cart[item.productId].quantity += 1;
          this.setState({ cart });
      }

      this.emptyCart = () => {
          this.setState({ cart: {} });
      }

    this.state = {
      user: JSON.parse(localStorage.getItem("user")),
      setUser: this.setUser,
        cart: {},
        emptyCart: this.emptyCart,
      addToCart: this.addToCart,
        removeFromCart: this.removeFromCart,
        increaseQuantity: this.increaseQuantity,
        decreaseQuantity: this.decreaseQuantity
    };
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <CartContext.Provider value={this.state}>
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
                    <Route path="/users" component={UserList} />
                    <Route path="/cart" component={Cart} />
            <Route path="/user/:id" component={EditUser} />
                    <Route path="/product/add" component={AddProduct} />
                    <Route path="/product/edit/:id" component={EditProduct} />
                    
          </Layout>
        </CartContext.Provider>
      </UserContext.Provider>
    );
  }
}
