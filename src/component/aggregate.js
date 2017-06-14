import React from 'react';
import { findDOMNode } from 'react-dom';
import * as d3 from 'd3-selection';
import { extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import { Breadcrumb } from 'antd';
import MainContainer from './maincontainer';
import 'antd/lib/breadcrumb/style/css';
import './aggregate.css';

class Axes extends React.Component {
  componentDidMount() {
    //this.renderAxis();
  }

  componentDidUpdate(prevProps, prevState) {
    const node = findDOMNode(this);
    d3.select(node).selectAll("*").remove();
    this.renderAxis();
  }


  renderAxis() {
    const node = findDOMNode(this);
    const { xLow = 0, xTop = 100, yLow = 0, yTop = 100 } =
      this.props.Dimension;
    let { xMin = 0, xMax = 10 } = this.props.DomainData;
    if (xMax === 0) xMax = 1;
    const scaleY = scaleBand().range([yLow, yTop]);
    const scaleX = scaleLinear().domain([xMin, xMax]).range([xLow, xTop]);

    const axisY = axisLeft(scaleY);
    const axisX = axisBottom(scaleX);
    if (xMax <= 10)
      axisX.ticks(xMax);

    d3.select(node).append('g')
      .attr("transform", `translate(${xLow}, 0)`).call(axisY);
    d3.select(node).append('g')
      .attr("transform", `translate(0, ${yTop})`).call(axisX);
  }
  render() {
    return <g></g>
  }
}

const Bars = props => {
  const unitHeight = props.Height / props.Records.length;
  const centerOffset = unitHeight / 2 - 5;
  const maxVote = Math.max(...props.Records);
  const bars = props.Records.map((item, id) => (
    <rect key={id} x={props.Padding}
      y={id * unitHeight + centerOffset} height={10}
      width={item ? (item / maxVote) * (props.Width - props.Padding) : 5}
      fill={item ? "#0277BD" : "#919191"}></rect>
  ));
  const texts = props.Options.map((item, id) => (
    <text key={id} x={props.Padding + 5}
      y={id * unitHeight + centerOffset - 3}>
      {item}, totally voted {props.Records[id]} times</text>
  ))
  return (<g>{bars}{texts}</g>);
};

class Aggregate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      options: [],
      record: []
    };
  }

  componentWillMount() {
    const title = this.props.match.params.title;
    const url = '/api/get/aggregate?title=' + encodeURIComponent(title);
    fetch(url).then(res => res.json()).then(data => {
      this.setState({
        title: data.title,
        options: data.options,
        record: data.record
      });
    }).catch(err => console.log(err));
  }

  render() {
    const [xmin, xmax] = extent(this.state.record);
    const [height, width, padding] = [300, 500, 30];
    const dimension = {
      xLow: padding >> 1,
      xTop: width - padding,
      yLow: 0,
      yTop: height - padding,
    };
    const domainData = {
      xMin: xmin,
      xMax: xmax
    };
    return (
      <MainContainer>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Aggregate Results</Breadcrumb.Item>
        </Breadcrumb>
        <h3 style={{ textAlign: 'center' }}>{this.state.title}</h3>
        <svg>
          <Axes Dimension={dimension}
            DomainData={domainData}></Axes>
          <Bars Records={this.state.record} Height={height - padding}
            Width={width - padding} Options={this.state.options}
            Padding={dimension.xLow} />
        </svg>
      </MainContainer>
    );
  }
}

export default Aggregate;