import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import axios from 'axios';
import { DeleteOutlined, UnlockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../util/baseurl';





const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'status',
        render: (role) => (
            role === 'user'
                ? <Tag onClick={changerole} color="red">User</Tag>
                : <Tag color="green">Admin</Tag>
        ),
    }
];

const changerole = (e) => {
    console.log(e);
}


const Dashboard = () => {
    const notify = (text) => toast(text, { autoClose: 1000 });
    const [data, setData] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        get_users()
    }, [])


    async function get_users() {
        const token = localStorage.getItem('token');
        axios({
            method: 'get',
            url: `${baseurl}/auth/getallusers`,
            headers: token ? { Authorization: `Bearer ${token}`, } : {}
        })
            .then((res) => {
                setData(res.data)
                console.log(res);

            })
            .catch((err) => {
                console.log(err)
                setData([])
                // navigate('/login')
            });
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = newSelectedRowKeys => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: changeableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };

    async function Delete() {
        const token = localStorage.getItem('token');
        axios({
            method: 'DELETE',
            url: `${baseurl}/auth/delete`,
            headers: token ? { Authorization: `Bearer ${token}`, } : {},
            data: selectedRowKeys
        })
            .then((res) => {
                notify(res?.data?.message);
                get_users()
            })
            .catch((err) => {
                console.log(err)
            });
    }
    async function Logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('blocked');
        navigate('/');
    }


    return (
        <div className='container'>
            <ToastContainer />
            <h3 className='text-center my-5'>ADMIN PANEL</h3>
            <div className='d-flex align-items-center justify-content-between'>
                <div className='btn-group my-2'>
                    <Button color="danger" variant='outlined' className='mr-2' onClick={Delete}><DeleteOutlined /> Delete</Button>
                </div>
                <div>
                    <Button color="danger" variant='outlined' className='mr-2' onClick={Logout}>Log out</Button>
                </div>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data || ''} rowKey={'id'} />
        </div>)
};
export default Dashboard;