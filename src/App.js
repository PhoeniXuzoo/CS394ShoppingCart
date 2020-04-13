import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Container, Column, Card, Button, Content, Box, Title, Media, Image } from 'rbx';
//import CartSidebar from './components/CartSidebar';
import Sidebar from 'react-sidebar';
//import ShirtStore from './components/ShirtStore';

const shirtsize = ['S', 'M', 'L', 'XL'];


//  <Button key = {sz + "_" + product.sku} onClick = { () => state.setSz(sz)}>{sz}</Button>;
const SizeSlector = ({ product, inventoryList, state }) => {
  return (<Container>
    {/* {shirtsize.map(sz => (<Button key = {sz + "_" + product.sku} onClick = { () => state.setSz(sz)}>{sz}</Button>))} */}
    {shirtsize.map(sz => (<Button key = {sz + "_" + product.sku} disabled = {(inventoryList[sz]) ? "" : "disabled"} onClick = { () => state.setSz(sz)}>{sz}</Button>))}
    {/* <Button onClick = {() => alert(JSON.stringify(inventoryList))} >testhh</Button> */}
  </Container>);
}

const ShelfItem = ({ product, inventoryList, addItemToCart, openSidebar }) => {
  const [sz, setSz] = useState(null);
  //console.log(inventoryList);
  var invenInfo = {};
  for (let i = 0; i < inventoryList.length; ++i) {
    if (String(product.sku) === inventoryList[i].sku) 
      invenInfo = inventoryList[i];
  }
  //console.log(invenInfo);
  //console.log(product);
  if (invenInfo === {}) invenInfo = {"sku": product.sku, "S":0, "M":0, "L":0, "XL":0};

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
        <SizeSlector  product = { product } inventoryList = {invenInfo} state = {{sz, setSz}}></SizeSlector>
        {/* <Button.Group>
          <Button key = {"S_" + product.sku} onClick = { () => setSz('S')}>S</Button>
          <Button key = {"M_" + product.sku} onClick = { () => setSz('M')}>M</Button>
          <Button key = {"L_" + product.sku} onClick = { () => setSz('L')}>L</Button>
          <Button key = {"XL_" + product.sku} onClick = { () => setSz('XL')}>XL</Button>
        </Button.Group> */}
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

const ShelfContainer = ({ products, inventoryList, addItemToCart, openSidebar }) => (
  <Column.Group multiline>
    { products.map(product => <ShelfItem key = {product.sku} product = { product } inventoryList = {inventoryList} addItemToCart = {addItemToCart} openSidebar = {openSidebar}/>) }
  </Column.Group>
);

const Cart = ({ selectedItem, closeSidebar, addItemToCart, revItemFromCart, inventoryList, products } ) => {
  var amount = 0;
  for (var i = 0; i < selectedItem.length; ++i) {
    amount += (selectedItem[i].S + selectedItem[i].M + selectedItem[i].L + selectedItem[i].XL) * selectedItem[i].price;
  }
  amount = amount.toFixed(2);

  if (inventoryList.length === 0) {
    for (var i = 0; i < selectedItem.length; ++i) 
      inventoryList.push({"sku": selectedItem[i].sku, "S":0, "M":0, "L":0, "XL":0});
  }

  console.log(inventoryList);

  const controlButton = (sku, size, inventoryList) => {
    var unavailable = true;
    if (inventoryList === []) return "disabled";
    for (var i = 0; i < inventoryList.length; ++i) {
      if (inventoryList[i] !== null && inventoryList[i].sku === String(sku) && inventoryList[i][size] > 0)
        unavailable = false; 
    }

    if (unavailable) return "disabled";
    else return "";
  }

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
          <Button size = "small" onClick = {() => {revItemFromCart(item.sku, "S")}}>Minus One</Button>
          <Button size = "small" disabled = {controlButton(item.sku, "S", inventoryList)} onClick = {() => {addItemToCart(item.sku, "S", item.price, item.title)}}>Add One</Button>
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
          <Button size = "small" onClick = {() => {revItemFromCart(item.sku, "M")}}>Minus One</Button>
          <Button size = "small" disabled = {controlButton(item.sku, "M", inventoryList)} onClick = {() => {addItemToCart(item.sku, "M", item.price, item.title)}}>Add One</Button>
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
          <Button size = "small" onClick = {() => {revItemFromCart(item.sku, "L")}}>Minus One</Button>
          <Button size = "small" disabled = {controlButton(item.sku, "L", inventoryList)} onClick = {() => {addItemToCart(item.sku, "L", item.price, item.title)}}>Add One</Button>
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
          <Button size = "small" onClick = {() => {revItemFromCart(item.sku, "XL")}}>Minus One</Button>
          <Button size = "small" disabled = {controlButton(item.sku, "XL", inventoryList)} onClick = {() => {addItemToCart(item.sku, "XL", item.price, item.title)}}>Add One</Button>
        </Box> : null
      ))}
      <Title>Total:{amount}</Title>
      </Container>
      
    </React.Fragment>
  )
}

// const useSelection = () => {
//   const [selected, setSelected] = useState({"12064273040195392":{"sku":12064273040195392, "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":51498472915966370, "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
//   const addItemToCart = (sku, size, price, title) => {
//     var oldSelectedList = Object.values(selected);
//     var newSelectedList = [];
//     var alreadyIn = false;
//     for (var i = 0; i < oldSelectedList.length; ++i) {
//       var temp = oldSelectedList[i];
//       newSelectedList.push(temp);
//       if (oldSelectedList[i].sku === sku) {
//         alreadyIn = true;
//         if (size === "S") newSelectedList[i].S += 1;
//         if (size === "M") newSelectedList[i].M += 1;
//         if (size === "L") newSelectedList[i].L += 1;
//         if (size === "XL") newSelectedList[i].XL += 1;
//       }
//     }
//     if (!alreadyIn) {
//       newSelectedList.push({"sku": sku, "S":(size == "S") ? 1 : 0, "M":(size == "M") ? 1 : 0, "L":(size == "L") ? 1 : 0, "XL":(size == "XL") ? 1 : 0, "price":price, "title":title});
//     }
//     setSelected(newSelectedList);
//   }

//   const revItemFromCart = (sku, size) => {
//     var oldSelectedList = Object.values(selected);
//     var newSelectedList = [];
//     for (var i = 0; i < oldSelectedList.length; ++i) {
//       var temp = oldSelectedList[i];
//       if(temp.sku === sku) {
//         if ("S" === size) temp.S -= 1;
//         if ("M" === size) temp.M -= 1;
//         if ("L" === size) temp.L -= 1;
//         if ("XL" === size) temp.XL -= 1;
//         if (temp.S === 0 && temp.M === 0 && temp.L === 0 && temp.XL ===0) continue;
//         else newSelectedList.push(temp);
//       }
//       else newSelectedList.push(temp);
//     }
//     setSelected(newSelectedList);
//   }
//   return [selected, addItemToCart, revItemFromCart, setSelected];
// }

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  //const [selected, setSelected] = useState({"12064273040195392":{"sku":12064273040195392, "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":51498472915966370, "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
  //const [selected, addItemToCart, revItemFromCart, setSelected] = useSelection(inventory);
  const [selected, setSelected] = useState({});
  const selectedItem = Object.values(selected);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState({});
  
  var inventoryTemp = {};
  for (var key in inventory) {
    inventoryTemp[key] = {"sku":key, ...inventory[key]};
  }
  const inve = Object.values(inventoryTemp);

  const addItemToCart = (sku, size, price, title) => {

    var oldSelectedList = Object.values(selected);
    var newSelectedList = [];
    var alreadyIn = false;
    for (var i = 0; i < oldSelectedList.length; ++i) {
      var temp = oldSelectedList[i];
      newSelectedList.push(temp);
      if (oldSelectedList[i].sku === sku) {
        alreadyIn = true;
        if (size === "S") newSelectedList[i].S += 1;
        if (size === "M") newSelectedList[i].M += 1;
        if (size === "L") newSelectedList[i].L += 1;
        if (size === "XL") newSelectedList[i].XL += 1;
      }
    }
    if (!alreadyIn) {
      newSelectedList.push({"sku": sku, "S":(size == "S") ? 1 : 0, "M":(size == "M") ? 1 : 0, "L":(size == "L") ? 1 : 0, "XL":(size == "XL") ? 1 : 0, "price":price, "title":title});
    }

    var oldInventory = inventory;
    var newInventory = {};

    for (var key in oldInventory) {
      if (key !== String(sku)) newInventory[key] = oldInventory[key];
      else {
        newInventory[key] = oldInventory[key];
        newInventory[key][size] -= 1;
      }
    }    
    setSelected(newSelectedList);
    setInventory(newInventory);
  }

  const revItemFromCart = (sku, size) => {
    var oldSelectedList = Object.values(selected);
    var newSelectedList = [];
    for (var i = 0; i < oldSelectedList.length; ++i) {
      var temp = oldSelectedList[i];
      if(temp.sku === sku) {
        if ("S" === size) temp.S -= 1;
        if ("M" === size) temp.M -= 1;
        if ("L" === size) temp.L -= 1;
        if ("XL" === size) temp.XL -= 1;
        if (temp.S === 0 && temp.M === 0 && temp.L === 0 && temp.XL ===0) continue;
        else newSelectedList.push(temp);
      }
      else newSelectedList.push(temp);
    }

    var oldInventory = inventory;
    var newInventory = {};

    for (var key in oldInventory) {
      if (key !== String(sku)) newInventory[key] = oldInventory[key];
      else {
        newInventory[key] = oldInventory[key];
        newInventory[key][size] += 1;
      }
    }    
    setSelected(newSelectedList);
    setInventory(newInventory);
  }


  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const inventoryResponse = await fetch('./data/inventory.json');
      const json = await response.json();
      const inventoryjson = await inventoryResponse.json();
      setData(json);
      // const inventoryResponse = await fetch('./data/inventory.json');
      // const inventoryjson = await inventoryResponse.json();
      setInventory(inventoryjson);
    };
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
      {/* <Navbar></Navbar> */}
      <Sidebar
        sidebar={<Cart selectedItem = { selectedItem } closeSidebar = {() => setSidebarOpen(false)} addItemToCart = {addItemToCart} revItemFromCart = {revItemFromCart} inventoryList = {inve} products = {products}/>}
        open={sidebarOpen}
        onSetOpen={(open) => {setSidebarOpen(open)}}
        styles={{ sidebar: { width: 300, background: "white" } }}>
          <br /><br /><br />
        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
          Cart
        </Button>
      </Sidebar>
      <Button onClick = {() => {
        alert(JSON.stringify(inve));
      }}>test</Button>
      <Button onClick = {() => {
        alert(JSON.stringify(products));
      }}>test1</Button>
      
      <Container>
        <br />
      <ShelfContainer products = {products} inventoryList = {inve} addItemToCart = {addItemToCart} openSidebar = {() => setSidebarOpen(true)}/>
      </Container>
      
      
    </React.Fragment>
    //<ShirtStore products = {products} />
  );
};

export default App;


