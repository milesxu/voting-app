import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import 'antd/lib/menu/style/css';
import 'antd/lib/icon/style/css';

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    switch (event.key) {
      case "login":
        this.props.Login();
        break;
      case 'logout':
        this.props.Logout();
        break;
      default:
        break;
    }
  }
  render() {
    return (
      <div
        style={{ display: 'flex', float: 'right', color: 'rgb(97%,97%,97%)' }}>
        <span>Welcome, {this.props.User || 'Guest'}!</span>
        <Menu mode="horizontal" theme="dark"
          style={{ border: 0, lineHeight: '64px' }} onClick={this.handleClick}>
          <Menu.Item>
            <Link to="/"><Icon type="home" />Home</Link>
          </Menu.Item>
          {!this.props.User &&
            <Menu.Item key="login">
              <Icon type="login" />Login
            </Menu.Item>
          }
          {!this.props.User &&
            <Menu.Item key="join">
              <Link to="/signup"><Icon type="user-add" />Join</Link>
            </Menu.Item>
          }
          {this.props.User &&
            <Menu.Item key="mine">
              <Link to="/mypoll"><Icon type="bars" />My Polls</Link>
            </Menu.Item>}
          {this.props.User &&
            <Menu.Item key="addnew">
              <Link to="/addpoll"><Icon type="file-add" />Add a new Poll</Link>
            </Menu.Item>}
          {this.props.User &&
            <Menu.Item key="logout">
              <Icon type="logout" />Logout</Menu.Item>
          }
        </Menu>
      </div>
    );
  }
}

export default HeaderMenu;