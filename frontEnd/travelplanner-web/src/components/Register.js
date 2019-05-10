import React from 'react';
import {
    Form, Input, Button, message
} from 'antd';
import $ from 'jquery';
import {API_ROOT} from "../constants"
import { Link } from 'react-router-dom';


class RegisterationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form. validateFieldsAndScroll((err, values) => {

            if (!err) {
                //console.log('Received values of form: ', values);
                $.ajax({
                    url: `${API_ROOT}/Register`,
                    method: 'POST',
                    data: JSON.stringify({
                        userID: values.username,
                        password: values.password,
                        firstName: values.firstname,
                        lastName: values.lastname
                    })
                }).then((response) => {
                    //console.log(response);
                    message.success('register success!');
                    this.props.history.push('/login');
                }, (response) => {
                    //console.log(response);
                    message.error(JSON.parse(response.responseText)["status"]);
                }).catch((e) => {
                    console.log(e);
                });
            }

        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const sample = "https://i.imgur.com/ydH7ULN.mp4";
        return (
            <div className="main_page" >
            <div className="register-container">
            <Form className="register-form" {...formItemLayout} onSubmit={this.handleSubmit}>
                 
                <Form.Item style={{marginLeft:"auto"}}>
                   <div style={{color:"white", float:"left", fontWeight:10}}>*Username</div>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your nickname!', whitespace: true}],
                    })(
                        
                        <Input/>
                    )}
                   </Form.Item>
                
                <Form.Item class="register-item" style={{marginLeft:"auto"}}>
                <div style={{color:"white", float:"left", fontWeight:10}}>*Password</div>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </Form.Item>
               
        
                <Form.Item class="register-item" style={{marginRight:"auto"}} >
                <div style={{color:"white", float:"left" }}>*Confirm Password</div>
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </Form.Item>
                
                <Form.Item class="register-item" >
                <div style={{color:"white", float:"left" }}>*First name</div>
                    {getFieldDecorator('firstname', {
                        rules: [{required: true, message: 'Please input your firstname!', whitespace: true}],
                    })(
                        <Input/>
                    )}

                </Form.Item>
                
                <Form.Item class="register-item">
                <div style={{color:"white", float:"left",fontWeight:10}}>*Last name</div><br/>
                    {getFieldDecorator('lastname', {
                        rules: [{required: true, message: 'Please input your lastname!', whitespace: true}],
                    })(
                        <Input/>
                    )}

                </Form.Item>

                <Form.Item >
                    <div>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <p style={{color:"white"}}>I already have an account, go back to <Link to="/login" style={{color:"#007bff", fontWeight:"14"}}>login</Link></p>
                    </div>
                </Form.Item>
            </Form>
                </div>
                </div>
        );
    }
}

export const Register = Form.create()(RegisterationForm);

