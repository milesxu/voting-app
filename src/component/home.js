import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Card } from 'antd';
import MainContainer from './maincontainer';
import 'antd/lib/breadcrumb/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/card/style/css';

class Home extends React.Component {
  state = {
    titles: [],
    polls: []
  };

  componentWillMount() {
    fetch('/api/get').then(res => res.json())
      .then(result => {
        const arr = result.polls.map(d => d.title);
        this.setState({ titles: arr, polls: result.polls });
      });
  }


  render() {
    const votes = this.state.polls.map((item, id) => (
      <Col span={8} key={id} style={{ margin: '8px 0' }}>
        <Card title={`Voted ${item.votes} times`}
          extra={
            <span>
              <Link to={`/detail/${item.title}`}
                style={{ marginRight: '16px'}}>Details</Link>
              <Link to={`/aggregate/${item.title}`}>Results</Link>
            </span>}>{item.title}
        </Card>
      </Col>
    ));
    return (
      <MainContainer>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={16}>
          {votes}
        </Row>
      </MainContainer>
    );
  }
}

export default Home;