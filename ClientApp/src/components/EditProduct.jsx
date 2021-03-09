import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, InputNumber } from "antd";
import { findLast } from "lodash";


const EditProduct = props => {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(props.match.params.id);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProduct();
    },[])

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(`/api/product/${productId}`);
            setProduct(result.data);
            form.setFieldsValue(result.data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    } 

    const onFinish = async values => {
        if (values.quantity < 1) {
            return form.setFields([
                {
                    name: "quantity",
                    errors: ["Quantity cannot be zero"]
                }
            ]);
        }


        try {
            setIsLoading(true);
            const result = await axios.post(`/api/product/${productId}`, values);
            if (result.status === 200) {
                props.history.push('/');
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }

    };

    return (
    <Card title="Edit Product">
            <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Description"
          name="productDesc"
          rules={[
            { required: true, message: "Please input product description!" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Quantity"
          name="quantity"
          rules={[
              { required: true, message: "Please input product quantity!" },
          ]}
        >
          <InputNumber min={0} max={1000} />
        </Form.Item>

                <Form.Item>
                    <Button loading={isLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>

  );
};

export default EditProduct;
