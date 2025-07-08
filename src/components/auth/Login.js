import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../../util/baseurl';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { theme } = useTheme()

  const onFinish = values => {
    console.log('Received values of form: ', values);
    login(values)
  };

  async function login(values) {

    axios({
      method: 'POST',
      url: `${baseurl}/auth/login`,
      data: values
    })
      .then((res) => {
        localStorage.removeItem('token')
        localStorage.setItem('token', res.data.token)
        console.log(res)
        navigate('/user/templatelist');

      })
      .catch((err) => {
        console.log(err)
        setError(err?.response?.data)
      });
  }

  return (
    <div className='login' style={{ backgroundColor: theme == 'light' ? '#fff' : '#000', height: '100vh', color: theme == 'dark' ? '#fff' : '#000' }}>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-md-4 offset-4'>
            <h3 className='text-center mb-3'>Login</h3>
            <Form
              name="login"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360 }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email"  />
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
                  <Link to={'/register'}>Register</Link>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;