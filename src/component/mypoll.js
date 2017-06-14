import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Alert, Table, Popconfirm, message } from 'antd';
import MainContainer from './maincontainer';
import { userFetch } from '../util';
import 'antd/lib/breadcrumb/style/css';
import 'antd/lib/alert/style/css';
import 'antd/lib/table/style/css';

class MyPoll extends React.Component {
  state = {
    titles: []
  };

  componentWillMount() {
    const token = localStorage.getItem('token');
    userFetch('/api/update/mypoll', token).then(res => res.json())
      .then(data => {
        if (data.success)
          this.setState({ titles: data.titles });
      });
  }

  handleDelete = (id) => {
    const url = '/api/update?title='
      + encodeURIComponent(this.state.titles[id]);
    userFetch(url, localStorage.getItem('token'), 'DELETE')
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        if (data.success) {
          message.success('You are sure. ' + this.state.titles[id]);
          let arr = this.state.titles;
          arr.splice(id, 1);
          this.setState({ titles: arr });
        }
      });
  };

  render() {
    const columns = [{
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: 'Detail',
      key: 'detail',
      render: (text, record, id) => (
        <Link to={`/detail/${this.state.titles[id]}`}>details</Link>
      )
    }, {
      title: 'Result',
      key: 'result',
      render: (text, record, id) => (
        <Link to={`/aggregate/${this.state.titles[id]}`}>results</Link>
      )
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record, id) => (
        <Popconfirm title="Are you sure to delete this poll?"
          onConfirm={() => this.handleDelete(id)}>
          <a href="">Delete</a>
        </Popconfirm>
      )
    }];
    let titles = this.state.titles.map((item, id) => ({
      title: item,
      key: id
    }));
    return (
      <MainContainer>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>My Polls</Breadcrumb.Item>
        </Breadcrumb>
        {!this.props.User &&
          <Alert message="You are not logged in!"
            description={`Only registered user can view his own polls! Please login or join us!`} type="warning" closable />}
        <Table columns={columns} dataSource={titles}
          pagination={false} bordered={true} size="small" />
      </MainContainer>
    )
  }
}

export default MyPoll;