import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { List, Avatar, Skeleton, Upload, message, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("/api/user");
      setUsers(result.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

    const handleDelete = async (userId) => {
        setIsLoading(true);
        try {
            const result = await axios.delete(`/api/user/${userId}`);
            if (result.status === 200) {
                fetchUsers();
            }
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = async (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            fetchUsers();
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

  return (
      <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2> All Users</h2>
              <Upload
                  name='file'
                  action='/api/user/upload'
                  headers={
                      {authorization:'authorization-text'}
                  }
                  onChange={handleFileUpload}
              >
                  <Button icon={<UploadOutlined />}>Upload Users (XML)</Button>
              </Upload>
              </div>
          
      <List
              className="demo-loadmore-list"
              loading={isLoading}
              itemLayout="horizontal"
              dataSource={users}
              renderItem={item => (
                  <List.Item
                      actions={[
                          <Link to={`/user/${item.userId}`}>Edit</Link>,
                          <Button onClick={() => handleDelete(item.userId)}>Delete</Button>
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
                        title={
                            <a>
                                {item.firstName + " " + item.lastName}
                            </a>
                        }
                        description={`Email: ${item.email}`}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  );
};

export default UserList;
