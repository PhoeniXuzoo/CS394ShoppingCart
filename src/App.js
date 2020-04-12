import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Container, Column, Card, Button, Content, Box, Title, Media, Image } from 'rbx';
//import CartSidebar from './components/CartSidebar';
import Sidebar from 'react-sidebar';
//import ShirtStore from './components/ShirtStore';

const shirtsize = ['S', 'M', 'L', 'XL'];

const SizeSlector = ({ product, state }) => (
  <Button.Group align="centered">
    {shirtsize.map(sz => <Button key = {sz + "_" + product.sku} onClick = { () => state.setSz(sz)}>{sz}</Button>)}
  </Button.Group>
);

const ShelfItem = ({ product, addItemToCart, openSidebar }) => {
  const [sz, setSz] = useState(null);
  return (
  <Column size = "one-quarter"> 
    <Card> 
      <Card.Header>
        <Card.Header.Title>{ product.title }</Card.Header.Title>
      </Card.Header>
      <Card.Image align="center">
        <img src = { "./data/products/" + product.sku + "_1.jpg" } alt = { "./data/products/" + product.sku + "_1.jpg" } width = "220px" height = "320px" />
      </Card.Image>
      <Card.Content>
        <Content size = "small">{ (product.description === "") ? "No description" : product.description }</Content>
        <Content size = "medium">Price: ${ product.price }</Content> 
        <SizeSlector  product = { product } state = {{sz, setSz}}></SizeSlector>
      </Card.Content>
      <Card.Footer>
        <Card.Footer.Item>
          <Button onClick = {() => {
            if (sz !== null) {
              addItemToCart(product.sku, sz, product.price, product.title);
              openSidebar();
            }
            else {
              alert("Please select size.");
            }
          }}>Add to Cart</Button>
        </Card.Footer.Item>
      </Card.Footer>
    </Card>
  </Column>);
};

const ShelfContainer = ({ products, addItemToCart, openSidebar }) => (
  <Column.Group multiline>
    { products.map(product => <ShelfItem key = {product.sku} product = { product } addItemToCart = {addItemToCart} openSidebar = {openSidebar}/>) }
  </Column.Group>
);

const Cart = ({ selectedItem, closeSidebar, addItemToCart } ) => {
  var amount = 0;
  for (var i = 0; i < selectedItem.length; ++i) {
    amount += (selectedItem[i].S + selectedItem[i].M + selectedItem[i].L + selectedItem[i].XL) * selectedItem[i].price;
  }
  amount = amount.toFixed(2);

  return (
    <React.Fragment>
      <Title align="center">Cart</Title>
      <Container>
        <Button onClick = {closeSidebar}>Close</Button>     
      
      { selectedItem.map(item => ( (item.S > 0) ?
        <Box key = {"S"+item.sku} >
          <Content>
          <img alt = "img" src = {"./data/products/" + item.sku + "_1.jpg"} width = "110px" height = "160px" />
          </Content>
          <Content size = "small">
            Title:{item.title}<br />Size:S<br />Quatity:{item.S}<br />Price:{item.S * item.price}
          </Content>
          <Button key = {"SM1" + item.sku} size = "small">Minus One</Button>
          <Button size = "small" onClick = {() => {addItemToCart(item.sku, "S", item.price, item.title);}}>Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.M > 0) ?
        <Box key = {"M"+item.sku} >
          <Content>
          <img alt = "img" src = {"./data/products/" + item.sku + "_1.jpg"} width = "110px" height = "160px" />
          </Content>
          <Content size = "small">
            Title:{item.title}<br />Size:M<br />Quatity:{item.M}<br />Price:{item.M * item.price}
          </Content>
          <Button key = {"MM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"MA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.L > 0) ?
        <Box key = {"L"+item.sku} >
          <Content>
          <img alt = "img" src = {"./data/products/" + item.sku + "_1.jpg"} width = "110px" height = "160px" />
          </Content>
          <Content size = "small">
            Title:{item.title}<br />Size:L<br />Quatity:{item.L}<br />Price:{item.L * item.price}
          </Content>
          <Button key = {"LM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"LA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.XL > 0) ?
        <Box key = {"XL"+item.sku} >
          <Content>
          <img alt = "img" src = {"./data/products/" + item.sku + "_1.jpg"} width = "110px" height = "160px" />
          </Content>
          <Content size = "small">
            Title:{item.title}<br />Size:XL<br />Quatity:{item.XL}<br />Price:{item.XL * item.price}
          </Content>
          <Button key = {"XLM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"XLA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      <Title>Total:{amount}</Title>
      </Container>
      
    </React.Fragment>
  )
}

const useSelection = () => {
  const [selected, setSelected] = useState({"12064273040195392":{"sku":"12064273040195392", "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":"51498472915966370", "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
  const addItemToCart = (sku, size, price, title) => {
    var oldSelectedList = Object.values(selected);
    var newSelectedList = [];
    var alreadyIn = false;
    for (var i = 0; i < oldSelectedList.length; ++i) {
      var temp = oldSelectedList[i];
      newSelectedList.push(temp)
      if (oldSelectedList[i].sku === sku) {
        alreadyIn = true;
        if (size === "S") newSelectedList[i].S += 1;
      }
    }
    if (!alreadyIn) {
      newSelectedList.push({"sku": sku, "S":(size == "S") ? 1 : 0, "M":(size == "M") ? 1 : 0, "L":(size == "L") ? 1 : 0, "XL":(size == "XL") ? 1 : 0, "price":price, "title":title});
    }
    setSelected(newSelectedList);
  }
  
  const revItemFromCart = (sku, size) => {
    var temp = selected;
    if (temp.hasOwnProperty(sku)) {
      if (temp[sku][size] > 0) {
        temp[sku][size] -= 1;
        if (temp[sku]["S"] === 0 && temp[sku]["M"] === 0 && temp[sku]["L"] ===0 && temp[sku]["XL"] === 0) {
          delete temp[sku];
        }
        setSelected(temp);
      }
    }
  }
  return [selected, addItemToCart, revItemFromCart, setSelected];
}

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  // const [selected, setSelected] = useState({"12064273040195392":{"sku":"12064273040195392", "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":"51498472915966370", "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
  const [selected, addItemToCart, revItemFromCart, setSelected] = useSelection();
  const selectedItem = Object.values(selected);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
      {/* <Navbar></Navbar> */}
      <Sidebar
        sidebar={<Cart selectedItem = { selectedItem } closeSidebar = {() => setSidebarOpen(false)} addItemToCart = {addItemToCart} />}
        open={sidebarOpen}
        onSetOpen={(open) => {setSidebarOpen(open)}}
        styles={{ sidebar: { width: 300, background: "white" } }}>
          <br /><br /><br />
        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
          Cart
        </Button>
      </Sidebar>
      <Button onClick = {() => {
        revItemFromCart(12064273040195392, "L");
      }}>test</Button>
      
      <Container>
        <br />
      <ShelfContainer products = {products} addItemToCart = {addItemToCart} openSidebar = {() => setSidebarOpen(true)}/>
      </Container>
      
      
    </React.Fragment>
    //<ShirtStore products = {products} />
  );
};

export default App;