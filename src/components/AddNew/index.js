import React, {Component} from 'react';

export default class AddNew extends Component {

    constructor(props) {
        super(props);

        this.state = {
            onEdit: false,
            onSave: false,
            value: 'Random Value',
            errorState: flase
        };
    }

    changeInputValue = (e) => {
        const {value} = e.target;
        this.setState({
            value
        });
    }

    changeValue = () => {
        this.setState({
            onEdit: true
        });
    }

    sendToErrorState = () => {
        this.setState({
            onSave: true
        });
        setTimeout(() => {
            this.setState({
                onSave: false,
                errorState: true
            });
        }, 2000);
    }

    changeErrorState = () => {
        this.setState({
            errorState: false
        });
    }

	render () {
        const { onEdit, value } = this.state;
		return (
            <div>
                {!onSave && <div>
                    {onEdit && <div>
                            <input value={value} onChange={this.changeInputValue} onFocus={this.changeErrorState} />
                            {errorState && <span>Sopmething went wrong</span>}
                            <button onClick={this.sendToErrorState}>Save</button>
                        </div>}
                    {!onEdit && <div>
                            <span>{value}</span>
                            <button onClick={this.changeValue}>Edit</button>
                        </div>}
                    </div>}
                {onSave && <div>Processing...</div>}
			</div>
		);
	}
}
