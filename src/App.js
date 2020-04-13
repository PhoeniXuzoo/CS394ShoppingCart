import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Container, Column, Card, Button, Content, Box, Title, Message, Image } from 'rbx';
import Sidebar from 'react-sidebar';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const shirtsize = ['S', 'M', 'L', 'XL'];

const firebaseConfig = {
  apiKey: "AIzaSyAixa1tDz1euYCj6MaQL0RFKEZJF4cSE3g",
  authDomain: "cs394shoppingcart.firebaseapp.com",
  databaseURL: "https://cs394shoppingcart.firebaseio.com",
  projectId: "cs394shoppingcart",
  storageBucket: "cs394shoppingcart.appspot.com",
  messagingSenderId: "234645288479",
  appId: "1:234645288479:web:ddcb25275bc4736b75872a",
  measurementId: "G-V19DNEPG0J"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

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
  var invenInfo = {};
  for (let i = 0; i < inventoryList.length; ++i) {
    if (String(product.sku) === inventoryList[i].sku) 
      invenInfo = inventoryList[i];
  }
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
          <Button disabled = {(invenInfo["S"] + invenInfo["M"] + invenInfo["L"] + invenInfo["XL"] <= 0) ? "disabled" : ""} onClick = {() => {
            if (sz !== null) {
              addItemToCart(product.sku, sz, product.price, product.title);
              openSidebar();
            }
            else {
              alert("Please select size.");
            }
          }}>{(invenInfo["S"] + invenInfo["M"] + invenInfo["L"] + invenInfo["XL"] <= 0) ? "Out of Stock" : "Add to cart"}</Button>
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
    for (var j = 0; j < selectedItem.length; ++j) 
      inventoryList.push({"sku": selectedItem[j].sku, "S":0, "M":0, "L":0, "XL":0});
  }

  //console.log(inventoryList);

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

const Banner = ({ title, user }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  //const [selected, setSelected] = useState({"12064273040195392":{"sku":12064273040195392, "S":0, "M":0, "L":3, "XL":1, "price":10.9, "title":"Cat Tee Black T-Shirt"}, "51498472915966370": {"sku":51498472915966370, "S":1, "M":2, "L":0, "XL":0, "price":29.45, "title":"Dark Thug Blue-Navy T-Shirt"}});
  //const [selected, addItemToCart, revItemFromCart, setSelected] = useSelection(inventory);
  const [selected, setSelected] = useState({});
  const selectedItem = Object.values(selected);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventory, setInventory] = useState({});
  const [user, setUser] = useState(null);
  
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
      newSelectedList.push({"sku": sku, "S":(size === "S") ? 1 : 0, "M":(size === "M") ? 1 : 0, "L":(size === "L") ? 1 : 0, "XL":(size === "XL") ? 1 : 0, "price":price, "title":title});
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
      //const inventoryResponse = await fetch('./data/inventory.json');
      const json = await response.json();
      //const inventoryjson = await inventoryResponse.json();
      setData(json);
      //setInventory(inventoryjson);
    };
    fetchProducts();
    const handleData = snap => {if (snap.val()){ setInventory(snap.val()); }};
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <React.Fragment>
      {/* <Navbar></Navbar> */}
      <Sidebar
        sidebar={<Cart selectedItem = { selectedItem } closeSidebar = {() => setSidebarOpen(false)} addItemToCart = {addItemToCart} revItemFromCart = {revItemFromCart} inventoryList = {inve} products = {products}/>}
        open={sidebarOpen}
        onSetOpen={(open) => {setSidebarOpen(open)}}
        styles={{ sidebar: { width: 300, background: "white" } }}>
        
        <Banner title = {"Shirt Store"} user = {user} />
          <br /><br /><br />
        <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
          Cart
        </Button>

        <Container>
        <br />
      <ShelfContainer products = {products} inventoryList = {inve} addItemToCart = {addItemToCart} openSidebar = {() => setSidebarOpen(true)}/>
      </Container>
      </Sidebar>
      {/* <Button onClick = {() => {
        alert(JSON.stringify(inve));
      }}>test</Button>
      <Button onClick = {() => {
        alert(JSON.stringify(products));
      }}>test1</Button> */}
      
      
      
      
    </React.Fragment>
    //<ShirtStore products = {products} />
  );
};

export default App;


