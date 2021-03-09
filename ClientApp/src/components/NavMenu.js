import React, { Component } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Button
} from "reactstrap";

import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

import { withRouter, Link } from "react-router-dom";

import UserContext from "../contexts/UserContext";
import "./NavMenu.css";

class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  onLogout = (setUser, emptyCart) => {
    setUser(null);
    emptyCart();
    localStorage.removeItem("user");
    this.props.history.push("/login");
  };

  render() {
    return (
      <UserContext.Consumer>
        {({ user, setUser, cart, emptyCart }) => {
          const cartArray = [];
          for (let key in cart) {
            cartArray.push(cart[key]);
          }

          return (
            <header>
              <Navbar
                className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                light
              >
                <Container>
                  <NavbarBrand tag={Link} to="/">
                    User Management
                  </NavbarBrand>
                  <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                  <Collapse
                    className="d-sm-inline-flex flex-sm-row-reverse"
                    isOpen={!this.state.collapsed}
                    navbar
                  >
                    <ul className="navbar-nav flex-grow">
                      {user ? (
                        <>
                          <NavItem>
                            <NavLink>{`Hi, ${user.firstName}`}</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">
                              Home
                            </NavLink>
                          </NavItem>
                          {user.role === 1 ? (
                            <>
                              <NavItem>
                                <NavLink
                                  tag={Link}
                                  className="text-dark"
                                  to="/users"
                                >
                                  Users
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  tag={Link}
                                  className="text-dark"
                                  to="/product/add"
                                >
                                  Add Product
                                </NavLink>
                              </NavItem>
                            </>
                          ) : null}
                          <NavItem>
                            <NavLink
                              tag={Link}
                              className="text-dark"
                              to="/cart"
                            >
                              <Badge count={cartArray.length}>
                                <ShoppingCartOutlined
                                  style={{ fontSize: "1.4rem" }}
                                />
                              </Badge>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <Button
                              color="link"
                              onClick={() => this.onLogout(setUser, emptyCart)}
                            >
                              Logout
                            </Button>
                          </NavItem>
                        </>
                      ) : (
                        <>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">
                              Home
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              tag={Link}
                              className="text-dark"
                              to="/login"
                            >
                              Login
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              tag={Link}
                              className="text-dark"
                              to="/register"
                            >
                              Register
                            </NavLink>
                          </NavItem>
                        </>
                      )}
                    </ul>
                  </Collapse>
                </Container>
              </Navbar>
            </header>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default withRouter(NavMenu);
