import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Button, Radio, Input, Icon, Alert } from 'antd';
import MainContainer from './maincontainer';
import 'antd/lib/form/style/css';
import 'antd/lib/breadcrumb/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/radio/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/alert/style/css';
import { formFetch } from '../util';

class PollForm extends React.Component {
  state = {
    addition: [],
    voted: false
  };

  handleReload = (e) => {
    window.location.reload();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const len = this.props.Options.length;
        const value = this.props.form.getFieldValue('options');
        let data = {
          token: localStorage.getItem('token'),
          title: this.props.Title
        };
        if (value <= len) {
          data.value = value - 1;
        } else {
          data.option = this.state.addition[value - len - 1];
        }
        formFetch('/api/update/vote', data).then(res => res.json())
          .then(data => {
            if (data.success) this.setState({ voted: true });
          })
      }
    });
  };

  handleAdd = e => {
    const { getFieldValue } = this.props.form;
    const added = getFieldValue('addition');
    if (added) {
      const id = this.state.addition.indexOf(added);
      if (~id) return;
      this.setState(prev => ({ addition: prev.addition.concat(added) }));
    }
  };

  handleRadioChange = e => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ 'options': e.target.value });
  }

  render() {
    if (this.state.voted)
      return (
        <div>
          <h3>Your voting is submitted successfully!</h3>
          <p>
            <Link to={`/aggregate/${this.props.Title}`}>
              Click here</Link> to see the aggregate results!
          </p>
          <p>
            <a onClick={this.handleReload}>
              Click here</a> to vote the same topic one more time.
          </p>
        </div>
      );
    const { getFieldDecorator } = this.props.form;
    const radios = this.props.Options.map((item, id) => (
      <Radio value={id + 1} key={id + 1} style={{ display: 'block' }}>
        {item}
      </Radio>
    ));
    const len = this.props.Options.length;
    const radioAdd = this.state.addition.map((item, id) => (
      <Radio value={id + len + 1} key={id + len + 1}
        style={{ display: 'block' }}>
        {item}
      </Radio>
    ))
    return (
      <Form onSubmit={this.handleSubmit} style={{ margin: '16px auto', width: '360px' }}>
        <h3>{this.props.Title}</h3>
        <Form.Item>
          {getFieldDecorator('options', {
            rules: [{ required: true, message: 'Please give your choice!' }]
          })(
            <Radio.Group onChange={this.handleRadioChange}
              disabled={!this.props.User}>
              {radios}{radioAdd}
            </Radio.Group>
            )}
        </Form.Item>
        {this.props.User &&
          <Form.Item label="Or write your own. You can add more than one option, but only your selected one will be submit.">
            {getFieldDecorator('addition')(
              <Input placeholder="Your opinion here..."></Input>
            )}
            <Icon type="plus-circle-o" onClick={this.handleAdd} />
          </Form.Item>}
        <Form.Item>
          <Button type="primary" htmlType="submit"
            disabled={!this.props.User}>Submit</Button>
        </Form.Item>
      </Form>
    )
  }
}

const Polls = Form.create()(PollForm);

class PollDetail extends React.Component {
  constructor(props) {
    super(props);
    const match = this.props.match;
    this.state = {
      title: match.params.title,
      polls: []
    }
  }

  componentWillMount() {
    const url = '/api/get?title=' + encodeURIComponent(this.state.title);
    fetch(url).then(res => res.json())
      .then(data => this.setState({ title: data.title, polls: data.polls }))
      .catch(err => this.setState({ polls: [] }));
  }

  render() {
    return (
      <MainContainer>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Detail</Breadcrumb.Item>
          <Breadcrumb.Item>{this.state.title}</Breadcrumb.Item>
        </Breadcrumb>
        {!this.props.User &&
          <Alert message="You are not logged in!"
            description={`Only registered user can vote! Please login or join us!`} type="warning" closable />}
        <Polls Title={this.state.title} Options={this.state.polls}
          User={this.props.User} />
      </MainContainer>
    );
  }
}

export default PollDetail;