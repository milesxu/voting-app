import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Input, Button, Icon, message } from 'antd';
import { Alert } from 'antd';
import { formFetch } from '../util';
import MainContainer from './maincontainer';
import 'antd/lib/breadcrumb/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/message/style/css';
import 'antd/lib/alert/style/css';
import './addpoll.css';

let uuid = 1;
class AddPollForm extends React.Component {
  state = {
    newPollUrl: null
  };
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 2) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };
  add = () => {
    ++uuid;
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const options = Object.keys(values)
          .filter(key => key.startsWith('option'))
          .map(key => values[key]);
        const data = {
          title: values.title,
          polls: options,
          token: localStorage.getItem('token')
        };
        formFetch('/api/update/new', data).then(res => res.json())
          .then(data => {
            if (data.success) {
              this.setState({ newPollUrl: values.title });
            } else {
              message.error(data.message, 3);
            }
          }).catch(err => message.error(err.toString(), 3));
      }
    });
  };
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [0, 1] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Form.Item
          label={`Option ${index + 1}`}
          required={false}
          key={k}>
          {getFieldDecorator(`option-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input option details or delete this field."
            }]
          })(
            <Input placeholder="options" />
            )}
          <Icon type="minus-circle-o" disabled={keys.length === 2}
            onClick={() => this.remove(k)} />
        </Form.Item>
      );
    });

    return (
      <Form onSubmit={this.handleSubmit} className="addpoll-form">
        {this.state.newPollUrl &&
          <Alert message="New Poll create success!"
            description={<Link to={`/detail/${this.state.newPollUrl}`}>Click here to see the details.</Link>}
            type="success" closable showIcon />}
        <Form.Item label="Poll Title">
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: 'What\'s the title of your new poll?'
            }]
          })(
            <Input />
            )}
        </Form.Item>
        {formItems}
        <Form.Item>
          <Button type="dashed" onClick={this.add}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">Submit</Button>
        </Form.Item>
      </Form>
    );
  }
}

const NewPoll = Form.create()(AddPollForm);

class AddPoll extends React.Component {
  render() {
    return (
      <MainContainer>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Add new poll</Breadcrumb.Item>
        </Breadcrumb>
        <NewPoll />
      </MainContainer>
    );
  }
}

export default AddPoll;