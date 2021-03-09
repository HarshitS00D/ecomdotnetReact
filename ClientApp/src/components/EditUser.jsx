import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import axios from "axios";

const EditUser = props => {
  const [userId, setUserId] = useState(props.match.params.id);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(
    () => {
      if (userId) {
        fetchUser();
      }
    },
    [userId]
  );

  useEffect(
    () => {
      setUserId(props.match.params.id);
    },
    [props.match.params.id]
  );

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`/api/user/${userId}`);
      setUser(result.data);
      form.setFieldsValue(result.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

    const onFinish = async values => {
        try {
            setIsLoading(true);
            const result = await axios.put(`/api/user/${userId}`, values);

            props.history.push('/users');
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
  };

    return (
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="First Name"
        name="firstName"
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
        label="Last Name"
        name="lastName"
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
        name="email"
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
        <Button
          style={{ width: "100%" }}
          type="primary"
          loading={isLoading}
          htmlType="submit"
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditUser;
