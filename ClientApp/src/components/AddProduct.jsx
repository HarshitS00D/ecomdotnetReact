import React from 'react';
import axios from 'axios';
import { Form, Input, Button, Card, InputNumber } from 'antd';

const AddProduct = (props) => {
    const onFinish = async (values) => {
        try {
            const result = await axios.post('/api/product/add', values);
            if (result.status === 200) {
                props.history.push('/');
            }
        }
        catch (err) {
            console.log(err);
        }

    };


    return (
        <Card title="Add Product">
        <Form
            name="basic"
            layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Product Name"
                    name="productName"
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product Description"
                    name="productDesc"
                    rules={[{ required: true, message: 'Please input product description!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input price!' }]}
                >
                    <Input/>
                </Form.Item>

            <Form.Item
                label="Product Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please input product quantity!' }]}
                >
                    <InputNumber min={1} max={1000}/>
            </Form.Item>

            <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
        </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddProduct;