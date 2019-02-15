import React, { Component } from 'react';
import './App.css';
import GuestBook from './ListEnterer';
//
// class model {
//
//   constructor(data)
//   {
//     this.data = data;
//   }
//
// }


class Checkbox extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     checked: this.props.checked
  //   };
  //   this.handleCheckbox = this.handleCheckbox.bind(this);
  // }
  render = () => (
      <input type="checkbox" onClick={this.props.statusUpdater} checked={this.props.checked} />
  );

  // handleCheckbox = () => {
  //   console.log("clicked. was: " + this.state.checked);
  //   this.setState(state => ({checked: !state.checked}));
  //   // console.log("clicked. now: " + this.state.checked);
  // };

}
//
// class Item extends Component {
//
//   statusUpdater = () => {
//     this.setState((state) => ({status: !state.status}))
//   };
//
//   render() {
//     return (
//         <div className={"listitem"}>
//           <Checkbox checked={this.props.item.status === "abbiamo"}
//           statusUpdater={this.statusUpdater}/>
//           {this.props.item.name}
//         </div>
//     );
//   }
// }
//
// class Items extends Component {
//   render = () => {
//     var some = this.props.list || [];
//     return  some.map((listitem) =>
//         <Item item={listitem}/>)
//     ;
//   }
//
// }

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      model: []
    };
  }


  toggleItem = (id) => {
    this.setState(
        state => {
          const newmodel =
              state.model.map(item => {
                if (item._id === id)
                  return {_id: item._id, name: item.name, status: !item.status};
                return item;
              });

          return {model: newmodel};
        }
    )
  };


  render = () => {

    var some = this.state.model || [];

    return (
        <div className="App">
          <GuestBook/>
          {
            some.map((listitem) =>
                <div className={"listitem"}>
                  <Checkbox checked={listitem.status}
                            statusUpdater={this.toggleItem.bind(this, listitem._id)}/>
                  {listitem.name}
                </div>)
          }
        </div>
    )

  };

  componentDidMount() {
    fetch('http://localhost:3000/items/api/items')
        .then(response => response.json(),
            reason => console.log(reason))
        .then(data => this.setState({model: data}))
        .catch(e => {
    console.log(e);
    return e;
  });
  }
}

export default App;
