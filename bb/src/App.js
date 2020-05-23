import React, {Component} from 'react';
import './App.css';
import checkbox_outline from './images/checkbox-outline.png';
import checkbox_filled from './images/checkbox-filled.png';
import x_button from './X.png';

const axios = require('axios');

const DisplayMode = {
    SHOW_ALL: {filter: (item) => true, name: "Show"},
    HIDE_COMPLETED: {filter: (item) => !item.status, name: "Hide"},
    SEARCHING: {}
}


// returns the first ASCII character in the string.
function findFirstChar(str) {
    let count = 0;
    for (const c of str) {
        if (c >= 'a' && c <= 'z') {
            return c + "";
        } else count++;
    }
    return count;
}

class Checkbox extends Component {

    render = () => (

        <img alt={this.props.checked ? "checked" : "unchecked"} width={40}
             src={this.props.checked ? checkbox_filled : checkbox_outline} onClick={this.props.statusUpdater}/>
    )
}

var sortMissingFirst = (a, b) => {
    if (a.status && !b.status) return 1;
    if (!a.status && b.status) return -1;
    // make lowercase
    const la = a.name.toLowerCase();
    const lb = b.name.toLowerCase();
    // take out all non-ascii letters at the beginning
    const comp_a = la.substring(la.indexOf(findFirstChar(la)));
    const comp_b = lb.substring(lb.indexOf(findFirstChar(lb)));
    // compare lexicographically
    if (comp_a > comp_b) return 1;
    if (comp_a < comp_b) return -1;
    return 0;
};

var nofilter = (item) => true;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: [],
            filter: nofilter,
            currentDisplayMode: DisplayMode.SHOW_ALL,
            previousDisplayMode: DisplayMode.HIDE_COMPLETED,
            searchText: ""
        };
        this.nodehostname = '';
        this.loadData = this.loadData.bind(this);

    };

    toggleFilter = () => {
        this.setState(
            {filter: this.state.previousDisplayMode.filter,
                previousDisplayMode: this.state.currentDisplayMode,
                currentDisplayMode: this.state.previousDisplayMode
            });
    };

    updateFilters = (text_temp) => {
        const text = text_temp.trim();
        let nextfilter = {};

        if (text.length === 0) {
            nextfilter = this.state.currentDisplayMode.filter;
        }
        else {
            nextfilter = item => item.name.toLowerCase().includes(text.toLowerCase());
        }
        this.setState({
            filter: nextfilter,
            searchText: text.toLowerCase()
        });
}

    toggleItem = (id) => {
        this.setState(
            state => {
                const newmodel =
                    state.model.map(item => {
                        if (item._id === id)
                            return { ...item, status: !item.status};
                        return item;
                    });
                const url = this.nodehostname + "/items/api/items/" + id;
                const [newitem] = newmodel.filter(item => item._id === id);
                fetch(url, {
                    headers: {"content-type": "application/json; charset=UTF-8"},
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
                console.log(data, 'item deleted!');
                this.loadData();
            })
    };

    handlePlusButton = (event) => {
        const newname = this.state.searchText;
        // adding to the database
        this.adder(newname);
        // reloading to be sure
        this.loadData();
        // resetting the lookup-box
        document.getElementById("lookup-box").value = "";
        this.updateFilters("");
    }

    adder = (inputname) => {
        const newname = inputname.trim();
        if (newname.length === 0) {
            console.log("empty name... ignoring");
            return;
        }
        console.log("adding " + newname + " to " + this.nodehostname);
        const oggetto = {
            name: newname,
            status: false,
        };
        axios.post(this.nodehostname + '/items/api/items', oggetto)
            .then(response => {
                console.log(response, 'item added!');
                // this.callback();
            })
            .catch(err => {
                console.log(err, 'item not added, try again');
            });
    };

    updateList = (event) => {
        this.updateFilters(event.target.value);
    };


    render = () => {

        var some = this.state.model || [];
        // this is where we filter and sort
        var processed = some.filter(this.state.filter).sort(sortMissingFirst);

        return (
            <div className="App">
                <div className={"lalista"}>
                    {
                        processed.map((listitem) =>
                            <div className={"listitem"} key={listitem._id}>
                    <span><Checkbox checked={listitem.status}
                                    statusUpdater={this.toggleItem.bind(this, listitem._id)}/>
                  <span className={listitem.status ? "abbiamo" : "manca"}>{listitem.name}</span></span>
                                <img width={40} src={x_button} onClick={this.deleter.bind(this, listitem._id)}
                                     alt={"delete"}/>
                            </div>)
                    }
                </div>
                <div className="footer">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon1"
                                    onClick={this.toggleFilter}>
                                {this.state.previousDisplayMode.name}
                            </button>
                        </div>
                        <input autoFocus id="lookup-box"
                               type="text"
                               placeholder="start typing to lookup..."
                               className="form-control"
                               onChange={this.updateList}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button"
                                    onClick={this.handlePlusButton}>+
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    loadData() {
        fetch(this.nodehostname + '/items/api/items')
            .then(response => response.json(),
                reason => console.log(reason))
            .then(data => { console.log("setting state") ; this.setState({model: data});})
            .catch(e => {
                console.log(e);
                return e;
            });
    };

    componentDidMount() {
        this.loadData();
    }
}

export default App;
