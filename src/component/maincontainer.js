import React from 'react';
import { Row, Col } from 'antd';
import 'antd/lib/row/style/css';
import 'antd/lib/col/style/css';
import './maincontainer.css';

const MainContainer = props => (
  <Row className="main-block">
    <Col span={18} offset={3} >
      {props.children}
    </Col>
  </Row>
);

export default MainContainer;