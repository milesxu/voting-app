import React from 'react';
import { Tabs, Button, message } from 'antd';
import UserLoginForm from './userlogin';
import 'antd/lib/tabs/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/message/style/css';
import './logintab.css';
import facebook from './facebook3.svg';
import github from './github.svg';
import google from './google-plus3.svg';
import linkedin from './linkedin.svg';
import twitter from './twitter3.svg';

class LoginTab extends React.Component {
  constructor(props) {
    super(props);
    this.social = ['Facebook', 'Github', 'Google', 'Linkedin', 'Twitter'];
    this.winLoop = null;
    this.result = null;
    this.winRef = null;
  }

  getPopupSize = provider => {
    switch (provider) {
      case "facebook":
        return {width: 580, height: 400};

      case "google":
        return {width: 452, height: 633};

      case "github":
        return {width: 1020, height: 618};

      case "linkedin":
        return {width: 527, height: 582};

      case "twitter":
        return {width: 495, height: 645};

      case "live":
        return {width: 500, height: 560};

      case "yahoo":
        return {width: 559, height: 519};

      default:
        return {width: 1020, height: 618};
    }
  };
  
  getResult = () => {
    if (this.winRef.closed)
      clearInterval(this.winLoop);
    const prefix = '/auth/social';
    const path = this.winRef.location.pathname;
    if (path.startsWith(prefix)) {
      clearInterval(this.winLoop);
      if (path.startsWith(prefix + '/fail')) {
        message.error(
          `Login by social account failed! Please try again later.`);
      } else if (path.startsWith(prefix + '/success')) {
        this.result = this.winRef.location.search.slice(1);
        const params = this.result.split('&');
        const token = decodeURIComponent(params[0].split('=')[1]);
        const name = decodeURIComponent(params[1].split('=')[1]);
        localStorage.setItem('token', token);
        this.props.Login(name);
      }
      this.winRef.close();
    }
  }

  handleClick(id) {
    const address = ['facebook', 'github', 'google', 'linkedin', 'twitter'];
    const url = '/auth/' + address[id];
    const name = `${this.social[id]} Login`;
    var settings = "scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no";
    this.winRef =
      window.open(url, name, `${settings},${this.getPopupSize(address[id])}`);
    this.winLoop = setInterval(this.getResult, 50);
  }

  render() {
    const icons = [facebook, github, google, linkedin, twitter];
    const btns = this.social.map((item, id) => (
      <Button type="primary" key={this.social[id]}
        style={{ margin: '5px auto' }}
        onClick={() => this.handleClick(id)}>
        <img src={icons[id]} alt={item} className="btn-icon" />
        <span className="btn-text">Login with {item}</span>
      </Button>
    ));
    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Login with Username and password" key="1">
          <UserLoginForm Login={this.props.Login} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Login with social media account" key="2">
          <div className="tabs">
            {btns}
          </div>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

export default LoginTab;