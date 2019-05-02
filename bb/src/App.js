import React, { Component } from 'react';
import './App.css';
import ListEnterer from './ListEnterer';


class Checkbox extends Component {

  render = () => (
      <input className={"checked"} type="checkbox" onClick={this.props.statusUpdater} checked={this.props.checked} />
  );

}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      model: []
    };
    this.nodehostname = 'http://localhost:5000';
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

  deleter = (id) => {
      const url = this.nodehostname + "/items/api/items/" + id;
      fetch(url, {
          method: 'delete',
          headers: {
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify({
          //     'name': 'Darth Vader'
          // })
      })
          .then(res => {
              if (res.ok) return res.json()
          })
          .then(data => {
              console.log(data)
              window.location.reload()
          })
  };

  render = () => {

      var some = this.state.model || [];
      // this is where we filter and sort
      var sortMissingFirst = (a, b) => {
          if (a.status && !b.status) return 1;
          if (!a.status && b.status) return -1;
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
      };
    return (
        <div className="App">
            <div className="collapse" id="collapseExample">
          <ListEnterer url={this.nodehostname}/>
            </div>
          <div className={"lalista"}>
          {
            some.sort(sortMissingFirst).map((listitem) =>
                <div className={"listitem"}>
                    <span><Checkbox checked={listitem.status}
                            statusUpdater={this.toggleItem.bind(this, listitem._id)}/>
                  <span className={listitem.status ? "abbiamo" : "manca"}>{listitem.name}</span></span>
                    <button type="button" onClick={this.deleter.bind(this, listitem._id)} className="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
                  {/*<button className={"deleteme"} onClick={this.deleter.bind(this, listitem._id)}>x</button>*/}
                </div>)
          }
          </div>
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
