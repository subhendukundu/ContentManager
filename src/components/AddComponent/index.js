import React, {Component} from 'react';
import {Row, Col, Card, Modal, Button, Icon, Input, Toast} from 'react-materialize';
import JSONTree from 'react-json-tree';
import ReactJson from 'react-json-view';
import AceEditor from 'react-ace';

import './style.scss';

/* addAComponent = () => {
	const dbCon = this.props.db.database().ref('/component');
	const {name} = this.state;
	dbCon.push({
		message: trim(e.target.value)
	});
	this.setState({
	message: ''
	});
} */


export default class AddComponent extends Component {

	constructor(props) {
        super(props);

        this.state = {
			code: `{
				"key": "This is some text"
			}`,
			name: '',
			componentlist: [],
			src: {
			},
			validName: void 0
        };
	}

	/* componentWillMount() {
		this.getIndividualCompoenetDetails();
	}

	componentDidMount() {
		this.getIndividualCompoenetDetails();
	} */

	updateCode = (newCode) => {
		this.setState({
			code: newCode
		});
	}

	/* getIndividualCompoenetDetails = () => {
		const { props } = this;
		const app = props.db.database().ref('component');
		app.on('value', snapshot => {
			const componentlist = snapshot.val();
			this.setState({
				componentlist
			});
		});
	} */

	updateComponentName = (e) => {
		const { value } = e.target;
		this.setState({
			name: value
		});
	}

	submitNewComponent = () => {
		const { state, props } = this;
		const { code, name } = state;
		if (name.length > 2) {
			this.setState({
				validName: true
			});
			window.Materialize.toast('Component added!', 4000);
			$('#addNewComponent').modal('close');
			const dbCon = props.db.database().ref(`/component/${name}`);
			dbCon.set({
				dataProps: JSON.parse(code)
			});
		} else {
			window.Materialize.toast('Please add a component name!', 4000);
			this.setState({
				validName: false
			});
		}
	}

	render () {
		const options = {
			lineNumbers: true,
			readOnly: false,
			mode: 'markdown'
		};
		const { state, props } = this;
		const { src, name, validName } = state;
		const { componentlist } = props;

		const cardDetailsArr = Object.keys(componentlist).map((key, index) => {
			const componentName = key;
			const data = componentlist[key].dataProps;
			console.log(data);
			return (
				<Col l={3} m={6} s={12}>
					<Card className='blue-grey darken-1'
						textClassName='white-text' title={componentName}
						actions={[
							<Modal
								header={componentName}
								fixedFooter
								key={`componentName-${index}`}
								trigger={<Button>Edit this Component</Button>}
								actions={
									<div>
									<Button modal="close" waves="light">dismiss</Button>
									<Button waves="light">Submit</Button>
									</div>
								}
							>
								<div>
								<ReactJson
									name={false}
									collapsed={false}
									src={data}
									collapseStringsAfterLength={15}
									onEdit={e => {
												console.log(e)
												this.setState({ src: e.updated_src })
											}
									}
									onDelete={e => {
												console.log(e)
												this.setState({ src: e.updated_src })
											}
									}
									onAdd={e => {
												console.log(e)
												this.setState({ src: e.updated_src })
											}
									}
									displayObjectSize={true}
									enableClipboard={true}
									indentWidth={4}
									displayDataTypes={true}
									iconStyle="triangle"
								/>
								</div>
							</Modal>
						]}>
					</Card>
				</Col>
			);
		});
		console.log(componentlist);
		return (
			<div className="edit-modal-component">
				<Row>
					{cardDetailsArr}
				</Row>
				<Modal
					id='addNewComponent'
					header='New component'
					actions={
						<div>
						<Button modal="close" waves="light">Dismiss</Button>
						<Button waves="light" onClick={this.submitNewComponent}>Submit</Button>
						</div>
					}
					trigger={<Button waves='light' large style={{bottom: '45px', right: '0', position: 'fixed'}}>Add a new Component<Icon left>add</Icon></Button>}
				>
				<div>
					<Row>
						<Input onChange={this.updateComponentName} s={8}
							label="Component Name"
							error={name.length > 2 ? null : "Please enter a vaild name"}
							defaultValue={name} value={name}
						/>
					</Row>
					<AceEditor
						mode="java"
						theme="monokai"
						value={this.state.code}
						onChange={this.updateCode}
						name="UNIQUE_ID_OF_DIV"
						editorProps={{$blockScrolling: true}}
					/>
				</div>
				</Modal>
			</div>
		);
	}
}
