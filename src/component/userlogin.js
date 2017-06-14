import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/checkbox/style/css';
import './userlogin.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        fetch('/auth/login', {
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
          }).catch(err => this.setState({ error: err.toString() }));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="error">{this.state.error}</div>
        <FormItem
          label="E-mail"
          hasFeedback>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not a valid E-mail!'
            }, { required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="someone@example.com" />
            )}
        </FormItem>
        <FormItem
          label="Password"
          hasFeedback>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
            )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/signup">register now!</a>
        </FormItem>
      </Form>
    );
  }
}

const UserLoginForm = Form.create()(NormalLoginForm);
export default UserLoginForm;