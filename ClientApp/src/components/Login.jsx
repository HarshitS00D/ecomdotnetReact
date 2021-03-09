import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card } from "antd";

import UserContext from "../contexts/UserContext";

const Login = props => {
    const userContext = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
      if (userContext.user) {
      props.history.push("/");
    }
  }, []);

    const onFinish = async values => {
        setIsLoading(true);
        try {
            const result = await axios.post("/api/user/login", values);

            if (result.status === 200) {
                const user = {
                    userId:result.data.userId,
                    email: result.data.email,
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    role: result.data.role
                };

                localStorage.setItem("user", JSON.stringify(user));

                userContext.setUser(user);
                props.history.push("/");
            }
        } catch (err) {
            form.setFields([
                {
                    name: "Email",
                    errors: ["Invalid username or password"]
                }
            ]);
            console.log(err.message);
        }
        finally {
            setIsLoading(false);
        }
  };

  return (
      <Card
          title="Login"
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -40%)",
        width: "400px"
      }}
    >
      <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              message: "Please input your Email!"
            }
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

              <Form.Item>
                  <Button style={{ width: "100%" }} type="primary" loading={isLoading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
