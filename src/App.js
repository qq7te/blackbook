import React, { Component } from 'react';
import './App.css';
import GuestBook from './ListEnterer';


const Checkbox = props => (
  <input type="checkbox" {...props} />
);

class Item extends Component {
  render() {
    return (
        <div className={"listitem"}>
          <Checkbox/>
          {this.props.value.name}
        </div>
    );
  }
}

class Items extends Component {
  render = () => {
    var some = this.props.list || [];
    return  some.map((listitem) =>
        <Item value={listitem}/>)
    ;
  }

}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }


  render = () =>
      <div className="App">
          <GuestBook/>
        <Items list={this.state.list}/>
      </div>

  componentDidMount() {
    fetch('http://localhost:3000/items/api/items')
        .then(response => response.json(),
            reason => console.log(reason))
        .then(data => this.setState({list: data}))
        .catch(e => {
    console.log(e);
    return e;
  });
  }
}

export default App;
