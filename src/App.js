import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Container, Column, Card, Button, Content } from 'rbx';

const shirtsize = ['S', 'M', 'L', 'XL'];

const SizeSlector = ({ product }) => (
  <Button.Group align="centered">
    {shirtsize.map(sz => <Button key = {product.sku}>{sz}</Button>)}
  </Button.Group>
);

const ShelfItem = ({ product }) => (
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
        <SizeSlector key = { product.sku } product = { product } ></SizeSlector>
      </Card.Content>
      <Card.Footer>
        <Card.Footer.Item>
          <Button key = {product.sku} onClick = {() => alert(product.sku + " " + product.price)}>Add to Cart</Button>
        </Card.Footer.Item>
      </Card.Footer>
    </Card>
  </Column>
);

const ShelfContainer = ({ products }) => (
  <Column.Group multiline>
    { products.map(product => <ShelfItem key = { product.sku } product = { product } />) }
  </Column.Group>
);

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <Container>
      <ShelfContainer products = {products} />
      {/* {products.map(product => <li key={product.sku}>{product.title}</li>)} */}
    </Container>
  );
};

export default App;