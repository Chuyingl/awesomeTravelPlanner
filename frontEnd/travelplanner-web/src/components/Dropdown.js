import {Form, Input, Select} from 'antd';
import React from 'react';
import '../styles/Downdown.css';
import {formItemLayout} from '../constants';

const { Option } = Select;

export class Dropdown extends React.Component {

    handleChange = (value) => {
        this.props.onDropdownClick(value);
    }
    render () {
        return (

            <div className="Day" >
                <Form {...formItemLayout} >
                    <Form.Item>
                        <Select className="Day" defaultValue="1" onChange={this.handleChange}>
                            {
                                [...Array(this.props.totalDays).keys()].map((i) =>
                                    <Option value={i} key={i}>{`Day ${i + 1}`}</Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>


        );
    }
}

