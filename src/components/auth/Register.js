import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
// import './Login.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { baseurl } from '../../util/baseurl';


const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const notify = (text) => toast(text, { autoClose: 1000 });

  const onFinish = values => {
    // console.log('Received values of form: ', values);
    register(values)
  };

  async function register(values) {

    axios({
      method: 'POST',
      url: `${baseurl}/auth/register`,
      data: values
    })
      .then((res) => {
        notify(res?.data?.message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })
      .catch((err) => {
        setError(err?.response?.data)
      });

  }
  return (
    <div className='login'>
      <ToastContainer />
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-md-4 offset-4'>
            <h3 className='text-center mb-3'>Register</h3>
            <Form
              name="register"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360 }}
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                type="text"
                rules={[{ required: true, message: 'Please input your Name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="email"
                type="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
              </Form.Item>
              <p className='text-danger'>{error?.error}</p>
              <Form.Item>
                <Flex justify="end" align="center">
                  <Link to={'/login'}>I've account. Login</Link>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className='col-md-6 d-none d-md-block'>
            {/* <img className='w-100' src='./img.webp' /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;