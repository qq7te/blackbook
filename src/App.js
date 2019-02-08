import React, { Component } from 'react';
import './App.css';


const Checkbox = props => (
  <input type="checkbox" {...props} />
);

class Item extends Component {
  render() {
    return (
        <div className={"listitem"}>
          <Checkbox/>
          {this.props.value}
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
        <Items list={this.state.list}/>
      </div>

  componentDidMount() {
    fetch('/lista.json')
        .then(response => response.json(),
            reason => console.log(reason))
        .then(data => this.setState(data));
  }
}

export default App;
