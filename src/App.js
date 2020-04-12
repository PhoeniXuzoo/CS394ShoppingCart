import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Container, Column, Card, Button, Content, Box, Title } from 'rbx';
//import CartSidebar from './components/CartSidebar';
import Sidebar from 'react-sidebar';
//import ShirtStore from './components/ShirtStore';

const shirtsize = ['S', 'M', 'L', 'XL'];

const SizeSlector = ({ product, state }) => (
  <Button.Group align="centered">
    {shirtsize.map(sz => <Button key = {sz + "_" + product.sku} onClick = { () => state.setSz(sz)}>{sz}</Button>)}
  </Button.Group>
);

const ShelfItem = ({ product, modifySelected }) => {
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
          <Button>Add to Cart</Button>
        </Card.Footer.Item>
      </Card.Footer>
    </Card>
  </Column>);
};

const ShelfContainer = ({ products, modifySelected }) => (
  <Column.Group multiline>
    { products.map(product => <ShelfItem key = {product.sku} product = { product } modifySelected = {modifySelected}/>) }
  </Column.Group>
);

const Cart = ({ selectedItem } ) => {
  var amount = 0;
  for (var i = 0; i < selectedItem.length; ++i) {
    amount += (selectedItem[i].S + selectedItem[i].M + selectedItem[i].L + selectedItem[i].XL) * selectedItem[i].price;
  }

  return (
    <React.Fragment>
      <Title align="center">Cart</Title>
      
      { selectedItem.map(item => ( (item.S > 0) ?
        <Box key = {"S"+item.sku} >
          <Content size = "small">
            Title:{item.title}<br />Size:S<br />Quatity:{item.S}<br />Price:{item.S * item.price}
          </Content>
          <Button key = {"SM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"SA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.M > 0) ?
        <Box key = {"M"+item.sku} >
          <Content size = "small">
            Title:{item.title}<br />Size:M<br />Quatity:{item.M}<br />Price:{item.M * item.price}
          </Content>
          <Button key = {"MM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"MA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.L > 0) ?
        <Box key = {"L"+item.sku} >
          <Content size = "small">
            Title:{item.title}<br />Size:L<br />Quatity:{item.L}<br />Price:{item.L * item.price}
          </Content>
          <Button key = {"LM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"LA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      { selectedItem.map(item => ( (item.XL > 0) ?
        <Box key = {"XL"+item.sku} >
          <Content size = "small">
            Title:{item.title}<br />Size:XL<br />Quatity:{item.XL}<br />Price:{item.XL * item.price}
          </Content>
          <Button key = {"XLM1" + item.sku} size = "small">Minus One</Button>
          <Button key = {"XLA1" + item.sku} size = "small">Add One</Button>
        </Box> : null
      ))}
      <Title>Total:{amount}</Title>
      
      
    </React.Fragment>
  )
}

function initialSelected(products) {
  var js = {}
  for (let i = 0; i < products.length; ++i) {
    js[products[i].sku] = {"S":0};
  }
  return js;
}

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  const [selected, setSelected] = useState({"12064273040195392":{"sku":"12064273040195392", "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":"51498472915966370", "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
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
        sidebar={<Cart selectedItem = { selectedItem }/>}
        open={sidebarOpen}
        onSetOpen={(open) => {setSidebarOpen(open)}}
        styles={{ sidebar: { width: 300, background: "white" } }}>
          <br /><br /><br />
        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
          Cart
        </Button>
      </Sidebar>
      
      <Container>
        <br />
      <ShelfContainer products = {products} />
      </Container>
      
      
    </React.Fragment>
    //<ShirtStore products = {products} />
  );
};

export default App;