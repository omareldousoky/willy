import React, { Component } from 'react'
import axios from 'axios';

interface Props {

}
interface State {
  name: string;
  password: string;
}
class Login extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      password: ''
    };
  }
  handleChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value } as any, () => { console.log(this.state) })
  }
  submit() {
    console.log(this.state, 'To login')
    const data = {
      username: this.state.name,
      password: this.state.password
    }
    axios({
      url: `${process.env.REACT_APP_BASE_URL}/auth/login`,
      method: "post",
      data: data

    }).then(succ => {
      console.log('OnSuccess', succ);
      this.setCookie(succ.data.token);
      window.location.href = process.env.REACT_APP_MOHASSEL_URL
    }, err => {
      console.log('OnError', err)
    })
  }
  getCookie(cname: string) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  setCookie(cvalue: string) {
    console.log('Here', cvalue)
    document.cookie = "token=" + cvalue + ";path=/;";
  }
  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '50vw', height: '50vh', backgroundColor: 'blue', margin: 'auto' }}>
        <input style={{ width: '50%', height: 30, margin: 15 }} type='text' name='name' placeholder='Username' onChange={(e) => this.handleChange(e)} />
        <input style={{ width: '50%', height: 30, margin: 15 }} type='password' name='password' placeholder='Password' onChange={(e) => this.handleChange(e)} />
        <button style={{ width: '40%', height: 30, margin: 15 }} onClick={() => this.submit()}>Log In</button>
      </div>
    )
  }
}
export default Login;
