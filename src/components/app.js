import React, {Component} from 'react';
import firebase from 'firebase';
import {Navbar, NavItem} from 'react-materialize';

import AddComponent from './AddComponent/index';
import PublishComponent from './PublishComponent/index';

const styles = {
    app: {
      paddingTop: 40
    },
    button: {
        marginRight: 20
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
          index: 0,
          componentlist: []
        };
        const config = {
            apiKey: "AIzaSyD1H3he_wQ2UjFzXkZIiR0gN74EODAQ6vM",
            authDomain: "aemjs-faf0b.firebaseapp.com",
            databaseURL: "https://aemjs-faf0b.firebaseio.com",
            projectId: "aemjs-faf0b",
            storageBucket: "",
            messagingSenderId: "167803884230"
        };
        firebase.initializeApp(config);
    }

    componentWillMount() {
		this.getIndividualCompoenetDetails();
	}

	componentDidMount() {
		this.getIndividualCompoenetDetails();
	}

    getIndividualCompoenetDetails = () => {
		const app = firebase.database().ref('component');
		app.on('value', snapshot => {
			const componentlist = snapshot.val();
			this.setState({
				componentlist
			});
		});
	}

    _onComponent = (e) => {
        e.preventDefault();
        this.setState({index: 0});
    };
    _onPublishComponent = (e) => {
        e.preventDefault();
        this.setState({index: 1});
    };
	render () {
        const { index, componentlist } = this.state;
		return (
            <div>
                <Navbar brand='Component Manager' left>
                    <NavItem onClick={this._onComponent}>Components</NavItem>
                    <NavItem onClick={this._onPublishComponent}>Publish</NavItem>
                </Navbar>
                <div style={(index === 0) ? styles.app : null}>
                    {(index === 0) && <AddComponent db={firebase} componentlist={componentlist} />}
                    {(index === 1) && <PublishComponent db={firebase} componentlist ={componentlist} />}
                </div>
			</div>
		);
	}
}
