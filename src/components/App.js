import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });



class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      buffer: null,
    }
  }


  fileChanged = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    }

  }

  fileSubmitted = (e) => {
    e.preventDefault();
    ipfs.add(this.state.buffer, (err, result) => {
      //do stuffs here 
      if (err) {
        console.log("Error ", err);
        return;
      }

      console.log('resut of ipfs', result);

    });
  }



  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            IPFS Meme Saver in Blockchain
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Meme of the day.</h1>
                <form onSubmit={this.fileSubmitted}>
                  <input onChange={this.fileChanged} type='file' />
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
