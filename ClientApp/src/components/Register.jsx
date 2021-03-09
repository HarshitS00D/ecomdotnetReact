import React, { useContext, useEffect,useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";

import UserContext from "../contexts/UserContext";

const Register = props => {
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
            const result = await axios.post("/api/user", values);

            if (result.status === 200) {
                props.history.push("/login");
            }
        } catch (err) {
            form.setFields([
                {
                    name: "Email",
                    errors: [err.response.data]
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
          title="Register"
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -40%)",
        width: "500px"
      }}
    >
      <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="FirstName"
          name="FirstName"
          rules={[
            {
              required: true,
              message: "Please input your First Name!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="LastName"
          name="LastName"
          rules={[
            {
              required: true,
              message: "Please input your Last Name!"
            }
          ]}
        >
          <Input />
        </Form.Item>

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

export default withRouter(Register);
