import React from 'react';
import {
    Form, Icon, Input, Button, message
} from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { API_ROOT} from "../constants"

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/Login`,
                    method: 'POST',
                    data: JSON.stringify({
                        userID: values.username,
                        password: values.password,
                    })
                }).then((response) => {
                    message.success('login success!');
                    //this.props.handleLogin(response, values.username); // with jwt
                    this.props.handleLogin("xxx", values.username); // no jwt
                },(response) => {
                    message.error(JSON.parse(response.responseText)["status"]);
                }).catch((e) => {
                    console.log(e);
                });

                //this.props.handleLogin("xxx", values.username); //for testing


            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="main_page"> 
            <div className="login_container">
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button  style={{color:"white"}} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                     <Link to="/register" style={{color:"white"}}>Or register now!</Link>
                </Form.Item>
            </Form> 
            </div>
            </div>
        );
       
    }
}

export const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
