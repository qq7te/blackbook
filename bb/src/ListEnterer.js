import React, { Component } from 'react';
const axios = require('axios');

class ListEnterer extends Component {
    constructor(props) {
        super(props);
        this.handleName = this.handleName.bind(this);
        this.addToGuestBook = this.addToGuestBook.bind(this);
        this.url = props.url;

        this.state = {
            nameOfItem: "",
            stateOfItem: "",
        };
    }

    handleName(event) {
        this.setState({nameOfItem: event.target.value});
    }

    // all of this functionality should probably just go in the higher app

    addToGuestBook = (event) => {
        event.preventDefault();
        this.setState({
            nameOfItem: event.target.value,
            stateOfItem: 'manca',
        });

        const nome = this.state.nameOfItem;
        const oggetto = {
            name: nome,
            status: this.state.stateOfItem,
        };

        axios.post(this.url + '/items/api/items', oggetto)
            .then(response => {
                console.log(response, 'item added!');
            })
            .catch(err => {
                console.log(err, 'item not added, try again');
            });

        this.setState({
            SignatureOfGuest: "",
            MessageofGuest: "",
        });
    };

    render = () => {
        return (
            <div>
                <input
                    onChange={this.handleName}
                    name="nameOfItem"
                    className="NameinputForm"
                    value={this.state.nameOfItem}
                    placeholder="Enter item name"
                />
                <button
                    className="submitbuttonguestbook"
                    type="submit"
                    onClick={this.addToGuestBook}
                >
                    Send it!
                    <i className="GuestBookButton2" aria-hidden="true" />
                </button>
            </div>
        );
    }



}

export default ListEnterer;
