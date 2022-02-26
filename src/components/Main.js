import React, { Component } from 'react';
class Main extends Component {
  render() {
    return (
      <div id="content">
      <p>&nbsp;</p>
      <div id="lol">
      <img src="../ethereum.png" width="300" class="cen">
      </img>
      </div>
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const flavor = this.productFlavor.value
          const upc = this.productUpc.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, flavor, upc, price)

        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productFlavor"
              type="text"
              ref={(input) => { this.productFlavor = input }}
              className="form-control"
              placeholder="Product Flavor"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productUpc"
              type="text"
              ref={(input) => { this.productUpc = input }}
              className="form-control"
              placeholder="Product Upc"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <div align="center">
          <canvas id="canvas" />
        </div>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Flavor</th>
              <th scope="col">Upc</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  <td>{product.flavor}</td>
                  <td>{product.upc.toString()}</td>
                  <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>


    );
  }
}

export default Main;

