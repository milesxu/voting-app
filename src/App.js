import React from 'react';
import { Layout, Modal } from 'antd';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HeaderMenu from './component/menu';
import LoginTab from './component/logintab';
import Home from './component/home';
import Signup from './component/signup';
import AddPoll from './component/addpoll';
import PollDetail from './component/polldetail';
import Aggregate from './component/aggregate';
import MyPoll from './component/mypoll';
import { userFetch } from './util';
import 'antd/lib/layout/style/css';
import 'antd/lib/modal/style/css';
import './App.css';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: '',
      visible: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  showModal() {
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  login(user) {
    this.setState({ user, visible: false });
  }

  logout() {
    //TODO: logout need to interact with server, tell it to explicityly 
    //expire the token.
    localStorage.clear();
    this.setState({ user: '' });
  }

  componentWillUnmount() {
    //localStorage.clear();
  }


  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      userFetch('/api/update/refresh', token)
        .then(res => res.status === 200 ? res.json() : null)
        .then(data => {
          if (data) {
            if (!data.notneed)
              localStorage.setItem('token', data.token);
            this.setState({ user: data.user });
          }
        }).catch(err => console.log('json token refresh failed.'));
    }
  }


  render() {
    return (
      <Router>
        <div>
          <Layout className="App">
            <Header>
              <h1 className="App-header">Free Code Camp Voting App</h1>
              <HeaderMenu User={this.state.user} Login={this.showModal}
                Logout={this.logout} />
            </Header>
            <Content>
              <Route exact path="/" component={Home} />
              <Route path="/signup" render={props =>
                <Signup {...props} Login={this.login}
                  User={this.state.user} />} />
              <Route path="/mypoll" render={props => <MyPoll {...props}
                User={this.state.user} />} />
              <Route path="/addpoll" component={AddPoll} />
              <Route path="/detail/:title"
                render={props => <PollDetail {...props}
                  User={this.state.user} />} />
              <Route path="/aggregate/:title" component={Aggregate} />
            </Content>
            <Footer className="App-footer">
              Made by
              <a href="https://github.com/milesxu" target="_blank"
                rel="noopener noreferrer"> Miles Xu</a>.
          </Footer>
          </Layout>
          <Modal
            visible={this.state.visible}
            onCancel={this.hideModal}
            width={640}
            footer={null}>
            <LoginTab Login={this.login} />
          </Modal>
        </div>
      </Router>
    );
  }
}



export default App;
