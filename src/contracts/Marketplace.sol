pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    // structure of product
    struct Product {
        uint id;
        string name;
        string flavor;
        uint upc;
        uint price;
        address payable owner;
        bool purchased;
    }

    // event product created
    event ProductCreated(
        uint id,
        string name,
        string flavor,
        uint upc,
        uint price,
        address payable owner,
        bool purchased
    );

    // event product purchased
    event ProductPurchased(
        uint id,
        string name,
        string flavor,
        uint upc,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Vending MAchine";
    }

    // function to create product
    function createProduct(string memory _name, string memory _flavor, uint _upc, uint _price) public {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productCount ++;
        products[productCount] = Product(productCount, _name, _flavor, _upc, _price, msg.sender, false);
        emit ProductCreated(productCount, _name, _flavor, _upc, _price, msg.sender, false);
    }

    // function to purchase product
    function purchaseProduct(uint _id) public payable {
        
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        require(_product.id > 0 && _product.id <= productCount);
        require(msg.value >= _product.price);
        require(!_product.purchased);
        require(_seller != msg.sender);
        _product.owner = msg.sender;
        _product.purchased = true;
        products[_id] = _product;
        address(_seller).transfer(msg.value);
        emit ProductPurchased( _product.id, _product.name, _product.flavor, _product.upc, _product.price, msg.sender, true);
    }

    // function to verify a valid QR code
    function verifyOwnership(uint _id) public view returns (bool ){
        Product memory _product = products[_id];
        if( _product.purchased ==true && msg.sender == _product.owner){
            return true;
        }else{
            return false;
        }

    }
}





