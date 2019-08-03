import React, { Component } from 'react';
import './App.css';
import ListEnterer from './ListEnterer';
import checkbox_outline from './checkbox-outline.png';
import checkbox_filled from './checkbox-filled.png';


class Checkbox extends Component {

  render = () => (

      <img width={40} src={this.props.checked ? checkbox_filled: checkbox_outline} onClick={this.props.statusUpdater} />
  )
}

var sortMissingFirst = (a, b) => {
    if (a.status && !b.status) return 1;
    if (!a.status && b.status) return -1;
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
};

var nofilter = (item) => true;
var onlyMissing = (item) => !item.status;



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      model: [],
        filter: nofilter

    };
    this.nodehostname = '';
  };

    toggleFilter= () => {
        console.log("clicked");
        var newfilter = nofilter;
        if (this.state.filter === nofilter) {
            newfilter = onlyMissing;

}
        this.setState({filter: newfilter});
    };

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
      var processed = some.filter(this.state.filter).sort(sortMissingFirst);

    return (
        <div className="App">
            <div className="collapse" id="collapseExample">
                <ListEnterer url={this.nodehostname}/>
            </div>
          <div className={"lalista"}>
          {
            processed.map((listitem) =>
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
            <footer>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary"
                                type="button"
                                id="button-addon1"
                                onClick={this.toggleFilter}>
                            {this.state.filter === nofilter ? "Hide" : "Show"}
                        </button>
                    </div>
                    <input type="text" aria-label="lookup" placeholder="start typing to lookup..."
                           className="form-control"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" data-toggle="collapse"
                                data-target="#collapseExample"
                                aria-expanded="false" aria-controls="collapseExample" id="hide-complete">+
                        </button>
                    </div>
                </div>
            </footer>
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
