import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
import QRCode from 'qrcode'

class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    if(networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
      console.log('marketplace:',marketplace)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.generateQR = this.generateQR.bind(this)
  }

  createProduct(name, flavor, upc, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, flavor, upc, price).send({ from: this.state.account },function (e, contract){

        if(e){
          console.log('Failed!');
          return;
        }else{
          console.log('Contract created!');
          console.log(contract)

        }})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct(id, price) {
    this.setState({ loading: true })
    
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      console.log(receipt)
      this.setState({ loading:false })
      var ind = receipt.events.ProductPurchased.returnValues[0]
      var hash = receipt.blockHash
      var acc = this.state.account
      var ups = receipt.events.ProductPurchased.returnValues[3]
      var idk = [acc , ind , ups , hash]
      this.generateQR(idk.join(', '))
    })
  }



   generateQR(str) {
    
     QRCode.toCanvas(document.getElementById('canvas'), str,                  
      function(error) {
          if (error) console.error(error)
          var nameArr = str.split(', ');
          console.log(nameArr[0])
          console.log(nameArr[1])
          console.log(nameArr[2])

     })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                  generateQR={this.generateQR}/>
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
