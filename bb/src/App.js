import React, { Component } from 'react';
import './App.css';
import GuestBook from './ListEnterer';


class Checkbox extends Component {

  render = () => (
      <input type="checkbox" onClick={this.props.statusUpdater} checked={this.props.checked} />
  );

}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      model: []
    };
    this.nodehostname = 'http://localhost:3000';
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
          const url = this.nodehostname + "/items/api/items/" + id;
          const [newitem] = newmodel.filter(item=> item._id === id);
          fetch(url, {
            headers: {"content-type" : "application/json; charset=UTF-8"},
            body: JSON.stringify(newitem),
            method: "PUT"
          }).then(res => console.log(res))
              .catch(error => console.log(error));

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
                  <span className={listitem.status ? "abbiamo" : "manca"}>{listitem.name}</span>
                </div>)
          }
        </div>
    )

  };

  componentDidMount() {
    fetch(this.nodehostname + '/items/api/items')
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
