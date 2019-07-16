import React, {Component} from 'react';
import * as ReactMaterialize from 'react-materialize';
import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-full-node-drag';
import Preview from 'react-component-preview';
import './style.scss';


const { Row, Col, Collection, CollectionItem, Card, Button, Icon, Modal, Input } = ReactMaterialize;

const styles = {
    scroll: {
      position: 'fixed',
	  height: '100%',
	  overflow: 'auto'
	},
	sortScroll: {
		position: 'fixed',
		height: '90%',
		overflow: 'auto',
		left: '30%',
		width: '100%'
	},
	button: {
		marginRight: '5px'
	}
};

export default class PublishComponent extends Component {
	constructor(props) {
        super(props);

        this.state = {
			treeData: [
				{
					title: 'Page Name',
					subtitle: "",
				  	id: 'pageName',
				  	expanded: true,
				  	canDrag: false
				}
			],
			node: {},
			path: [],
			dataProps: {},
			submitData: {},
			webPageName: 'Page Name',
			dataForFirebase: {}
        };
	}

	addThisComponentToTree = (e, data, key, getNodeKey) => {
		console.log(data)
		this.setState(state => ({
			treeData: addNodeUnderParent({
			  treeData: state.treeData,
			  parentKey: 0,
			  expandParent: true,
			  getNodeKey,
			  newNode: {
				title: key,
				data: data
			  },
			}).treeData,
		}));
		window.Materialize.toast(`${key} added!`, 4000);
	}

	sendComponentDetailsToModal = (node, path) => {
		const { id, title, subtitle } = node;
		const { componentlist } = this.props;
		const dataProps = (id === 'pageName') ? {webPageName: subtitle} : componentlist[title].dataProps;
		this.setState({dataProps, node, path}, () => {
			$('#publishChoice').modal().modal('open');
		});
	}

	changeInputDetails = (key) => (e) => {
		const { node, path, submitData } = this.state;
		const { title } = node;
		const {value} = e.target;
		const { webPageName } = this.state;
		if(title === 'Page Name') {
			this.setState({
				webPageName: value
			});
		}
		submitData[title] = Object.assign({}, submitData[title], { [key] : value});

		this.setState({ submitData });
	}

	submitNewPage = () => {
		const { state, props } = this;
		const { dataForFirebase, submitData } = state;
		const { webPageName } = submitData['Page Name'];
		window.Materialize.toast(`${webPageName} page added!`, 4000);
		$('#showComponents').modal('close');
		const dbCon = props.db.database().ref(`/pages/${webPageName}`);
		dbCon.set({
			dataForFirebase
		});
	}

	getallCompoennt = (children) => {
		const allCompoennt = [];
		for (let key of children) {
			const { data } = key;
			if (allCompoennt[key['title']]) {
				const firstDataToPush = {};
				Object.keys(data).forEach(item => {
					if(typeof(data[item]) === 'string') {
						firstDataToPush[item] = data[item];
					} else if (Array.isArray(data[item])) {
						firstDataToPush[item] = data[item][0];
					}
				});
				allCompoennt[key['title']].push(firstDataToPush);
			} else {
				const firstDataToPush = {};
				Object.keys(data).forEach(item => {
					if(typeof(data[item]) === 'string') {
						firstDataToPush[item] = data[item];
					} else if (Array.isArray(data[item])) {
						firstDataToPush[item] = data[item][0];
					}
				});
				allCompoennt[key['title']] = [firstDataToPush]
			}
		}
		return allCompoennt;
	}

	getAllDetails = () => {
		const { node, path, treeData, webPageName, submitData } = this.state;
		console.log(treeData);
		const allCompoennt = [];
		const dataForFirebase = Object.assign({}, {
			webPageName: treeData[0].subtitle,
			componentNames:  treeData[0].children ? this.getallCompoennt(treeData[0].children) : []
		});
		console.log(dataForFirebase);
		this.setState({dataForFirebase}, () => {
			$('#showComponents').modal().modal('open');
		});
	}

	changeComponentDetails = (getNodeKey) => {
		const { node, path, treeData, webPageName, submitData } = this.state;
		console.log(node, path, treeData, webPageName, submitData)
		const { title } = node;
		if (title === 'Page Name') {
			this.setState(state => ({
				treeData: changeNodeAtPath({
				  treeData: state.treeData,
				  path,
				  getNodeKey,
				  newNode: { ...node, subtitle: webPageName },
				}),
			}));
		} else {
			this.setState(state => ({
				treeData: changeNodeAtPath({
				  treeData: state.treeData,
				  path,
				  getNodeKey,
				  newNode: { ...node, data: Object.assign({}, node.data, submitData[title])},
				}),
			}));
		}
		$('#publishChoice').modal('close');
	}

	modalDetailsWithSelect = (data) => {
		const optionsForSelect = data.map((keys) => <option value={keys}>{keys.toString()}</option>);
		return optionsForSelect;
	}

	/* getAllChildren = (children) => Array.isArray(children) ? children.map( item => {
		const componentName = Object.keys(item)[0];
		const ComponentToRender = ReactMaterialize[componentName];
		console.log(ComponentToRender);

	}) : children; */

	render () {
		const { props, state } = this;
		const { componentlist } = props;
		const { dataProps, treeData, submitData, dataForFirebase } = state;
		const { webPageName, componentNames } = dataForFirebase;

		const cardDetailsArr = Object.keys(componentlist).map((key, index) => {
			const componentName = key;
			const data = componentlist[key].dataProps;
			return (
				<CollectionItem>
					<Card className='blue-grey darken-1'
						textClassName='white-text' title={componentName}
						actions={[<Button onClick={e => this.addThisComponentToTree(e, data, key, getNodeKey)} waves="light">Add This component <Icon right>add</Icon></Button>]}>
					</Card>
				</CollectionItem>
			);
		});

		const componentlistNames = componentNames ?  Object.keys(componentNames).map((key, index) => {
			const ComponentToRender = ReactMaterialize[key];
			return componentNames[key].map(all => {
				return (
					<div>
						<ComponentToRender {...all}>{all.children}</ComponentToRender>
					</div>
				)
			})
		}) : '';

		const modalDetailsArr = Object.keys(dataProps).map((key, index) => {
			const { title } = state.node;
			return (
				<Row>
					{(typeof(dataProps[key]) === 'string') && <Input s={12} label={key} onChange={this.changeInputDetails(key)} validate value={submitData[title] ? submitData[title].key : ''} />}
					{(Array.isArray(dataProps[key])) && <Input s={12} type='select' onChange={this.changeInputDetails(key)} label={key} defaultValue='{dataProps[key][0]}'>
						{this.modalDetailsWithSelect(dataProps[key])}
						</Input>
					}
				</Row>
			);
		});

		const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
			if (prevPath.indexOf('pageName') === 0 && nextPath.indexOf('pageName') >= 0) {
				return false;
			}
			if (!nextParent) {
			  return false;
			}

			return true;
		};
		const getNodeKey = ({ treeIndex }) => treeIndex;

		return (
			<Row>
				<Col l={3} m={6} s={12} style={styles.scroll}>
					<Collection>
						{cardDetailsArr}
					</Collection>
				</Col>
				<Col l={3} m={6} s={12} style={styles.sortScroll}>
					<SortableTree
						canDrop={canDrop}
						treeData={treeData}
						onChange={treeData => this.setState({ treeData })}
						theme={FileExplorerTheme}
						generateNodeProps={({ node, path }) => ({
							buttons: [
								<Button
									waves='light'
									style={styles.button}
									onClick={() => {this.sendComponentDetailsToModal(node, path)}}
								>
								Edit This
								<Icon right>mode edit</Icon>
								</Button>,
								<Button
									waves='light'
									onClick={() => {
										this.setState(state => ({
										  treeData: removeNodeAtPath({
											treeData: state.treeData,
											path,
											getNodeKey,
										  }),
										}));
									}
									}
								>
									Remove
									<Icon right>delete</Icon>
								</Button>
							]
						})}
					/>
				</Col>
				<Modal
					header="Publish Data"
					id="publishChoice"
					fixedFooter
					key={`componentName-${0}`}
					actions={
						<div>
						<Button modal="close" waves="light">dismiss</Button>
						<Button waves="light" onClick={e => this.changeComponentDetails(getNodeKey)}>Submit</Button>
						</div>
					}
				>
				{modalDetailsArr}
				</Modal>
				<Modal
					id='showComponents'
					header='Page'
					actions={
						<div>
						<Button modal="close" waves="light">Dismiss</Button>
						<Button waves="light" onClick={this.submitNewPage}>Submit</Button>
						</div>
					}
				>
				<div>
					{componentlistNames}
				</div>
				</Modal>
				<Button waves='light' onClick={this.getAllDetails} large style={{bottom: '45px', right: '0', position: 'fixed'}}>PreView<Icon left>assessment</Icon></Button>
			</Row>
		);
	}
}
