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
        this.update_local_and_remote(
            item => item._id === id,  // modify if it matches the id
            item => { return {status: !item.status};}); // modify by flipping status
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
        // resetting the lookup-box
        document.getElementById("lookup-box").value = "";
        this.updateFilters("");
    }

    add_remote = (item, success, failure) => {
        axios.post(this.nodehostname + '/items/api/items', item)
            .then(response => {
                console.log(response, "added item " + response.data.name + " with id " + response.data._id);
                success && success(response);
            })
            .catch(err => {
                console.log(err, 'item not added, try again');
                failure && failure(err);
            });
    }

    update_remote = (id, modifier, success, failure) => {
        axios.put(this.nodehostname + '/items/api/items/' + id, modifier)
            .then(response => {
                console.log(response, "udated item " + response.data.name + " with id " + response.data._id + " with change: " + JSON.stringify(modifier) );
                success && success(response);
            })
            .catch(err => {
                console.log(err, 'item not modified, try again');
                failure && failure(err);
            });
    }

    update_local_and_remote = (item_predicate, item_modifier) => {
        this.setState(
            state => {
                const newmodel =
                    this.state.model.map(item => {
                        if (item_predicate(item)) {
                            const update = item_modifier(item);
                            this.update_remote(item._id, update);
                            return {...item, ...update};
                        }
                        return item;
                    });

                return {model: newmodel};
            });
    }

    adder = inputname => {
        const newname = inputname.trim();
        if (newname.length === 0) {
            console.log("empty name... ignoring");
            return;
        }
        const oggetto = {
            name: newname,
            status: false,
        };
        this.add_remote(oggetto,
            (response) => {
                // we reload the data so that we do have an id for the new item
                // otherwise we'd have no way of modifying its state later
                this.loadData();
            });
    };

    handleTyping = (event) => {
        const enteredText = event.target.value;
        let dotInSearchBar = enteredText.length > 1 && enteredText.slice(-1) === '.';
        if (dotInSearchBar) {
            const beforeTheDot = enteredText.slice(0, -1).toLowerCase();
            const matches_entered_name = item => item.name.toLowerCase().includes(beforeTheDot)
            this.update_local_and_remote(matches_entered_name, item => {return {status: false};});
            this.updateFilters("");
            event.target.value = "";
        } else {
            this.updateFilters(enteredText);
        }
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
                               onChange={this.handleTyping}/>
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
