import React, {Component} from 'react';

const axios = require('axios');

class ListEnterer extends Component {
    constructor(props) {
        super(props);
        this.addHandler = props.addHandler;
        // this.addToGuestBook = this.addToGuestBook.bind(this);
        this.url = props.url;
        // this.callback = props.callback;

        this.state = {
            nameOfItem: "",
            stateOfItem: "",
        };
    }

    handleName(event) {
        this.setState({nameOfItem: event.target.value});
    }

    // all of this functionality should probably just go in the higher app
    //
    // addToGuestBook = (event) => {
    //     event.preventDefault();
    //     this.setState({
    //         nameOfItem: event.target.value,
    //         stateOfItem: false,
    //     });
    //
    //     const nome = this.state.nameOfItem;
    //     const oggetto = {
    //         name: nome,
    //         status: this.state.stateOfItem,
    //     };
    //
    //     axios.post(this.url + '/items/api/items', oggetto)
    //         .then(response => {
    //             console.log(response, 'item added!');
    //             this.callback();
    //         })
    //         .catch(err => {
    //             console.log(err, 'item not added, try again');
    //         });
    //
    //     this.setState({
    //         SignatureOfGuest: "",
    //         MessageofGuest: "",
    //     });
    // };

    render = () => {
        return (
            <div className="input-group">
                <input type="text"
                       onChange={this.handleName}
                       name="nameOfItem"
                       className="form-control"
                       value={this.state.nameOfItem}
                       placeholder="Enter item name"
                />
                <button
                    className="btn btn-outline"
                    type="button"
                    onClick={this.addToGuestBook}
                >
                    Add it!
                </button>
            </div>
        );
    }


}

export default ListEnterer;
