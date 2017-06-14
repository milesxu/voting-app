import React from 'react';
import { Breadcrumb } from 'antd';
import { Form, Input, Tooltip, Icon, Row, Col, Button } from 'antd';
import { Redirect } from 'react-router-dom';
import 'antd/lib/breadcrumb/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/tooltip/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/button/style/css';
import './signup.css';

const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    error: ''
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        fetch('/auth/signup', {
          method: 'POST',
          headers: header,
          body: JSON.stringify(values)
        }).then(res => res.json())
          .then(data => {
            if (data.success) {
              localStorage.setItem('token', data.token);
              this.props.Login(data.user.name);
            } else {
              throw new Error(data.message);
            }
          })
          .catch(err => console.error(err));
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  isEmailDuplicate = (rule, value, callback) => {
    console.log(rule);
    const url = `/auth/duplicate/${value}`;
    console.log(url);
    fetch(url).then(res => {
      console.log(res);
      if (!res.ok)
        throw new Error(res.statusText);
      return res.json();
    })
      .then(data => {
        if (data.count)
          callback([new Error('Email address has already been taken.')]);
        else
          callback();
      })
      .catch(err => {
        console.log(err);
        callback([new Error(err)]);
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = () => ({
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    });
    const tailFormItemLayout = () => ({
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    });
    return (
      <Row>
        <Col span={18} offset={3}>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Signup</Breadcrumb.Item>
          </Breadcrumb>
          <Form onSubmit={this.handleSubmit} className="sign-form">
            <div className="error">{this.state.error}</div>
            <FormItem
              {...formItemLayout}
              label="E-mail"
              hasFeedback
            >
              {getFieldDecorator('email', {
                validateFirst: true,
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your email!'
                }, {
                  validator: this.isEmailDuplicate
                }],
              })(
                <Input />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Password"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Confirm Password"
              hasFeedback
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  Nickname&nbsp;
                  <Tooltip title="What do you want other to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
              })(
                <Input />
                )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large">Register</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

const SignupForm = Form.create()(RegistrationForm);

class Signup extends React.Component {
  render() {
    if (this.props.User)
      return <Redirect to='/' />;
    return <SignupForm Login={this.props.Login} />;
  }
}

export default Signup;