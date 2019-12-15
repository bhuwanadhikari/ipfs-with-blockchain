import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';


const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });



class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      account: '',
      buffer: null,
      memeHash: '',
    }
  }


  componentDidMount() {
    (async () => {
      await this.loadWeb3();
      await this.loadBlockchainData();
    })();

  }



  //get the account
  //get the network
  //get the smart contract
  //get abi
  //get address
  //get the memehash

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(accounts);
    const networkId = await web3.eth.net.getId();
    const networkData = Meme.networks[networkId];
    if (networkData) {
      const abi = Meme.abi;
      const address = networkData.address;
      const contract = web3.eth.Contract(abi, address);
      this.setState({ contract });
      console.log('contract is', contract);
      const memeHash = await contract.methods.get().call();
      this.setState({ memeHash });
    } else {
      window.alert("Smart contract not deployed to detected network yet");
    }
    console.log("netid is", networkId);
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Please use metamask to test the file');
    }
  }

  //QmVGDoQXEjLdcQqPCK5XWcPCbvZkKMJA8e86r9WhaAxv15
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
    console.log("Submitteing");
    ipfs.add(this.state.buffer, (err, result) => {
      //do stuffs here 
      if (err) {
        console.log("Error ", err);
        return;
      }
      const memeHash = result[0].hash;
      console.log('resut of ipfs', result);
      // store the file on blockchain

      this.state.contract.methods.set(memeHash).send({ from: this.state.account }, (error, transactionHash) => {
        console.log("Meme set in blockchain");
        this.setState({ memeHash });
      })

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
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
              <small className='text-white'>{this.state.account}</small>
            </li>
          </ul>
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
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="App-logo" style={{ height: '300px' }} alt="logo" />
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
