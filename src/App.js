import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


var items = ['frutta', 'verdura', 'latte di soya'];


const Checkbox = props => (
  <input type="checkbox" {...props} />
);

class Item extends Component {
  render() {
    return (
        <div class={"listitem"}>
          <Checkbox/>
          {this.props.value}
        </div>
    );
  }
}

class Items extends Component {
  render = () =>
    this.props.list.map((listitem) =>
        <Item value={listitem}/>
    )

}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Items list={items}/>
      </div>
    );
  }
}

export default App;
