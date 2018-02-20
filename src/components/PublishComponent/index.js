import React, {Component} from 'react';
import { Row, Col, Collection, CollectionItem, Card, Button, Icon, Modal, Input } from 'react-materialize';
import SortableTree, { addNodeUnderParent, removeNodeAtPath, changeNodeAtPath } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-full-node-drag';
import './style.scss';

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
					title: 'Add a page name',
				  	id: 'pageName',
				  	expanded: true,
				  	canDrag: false
				}
			],
			dataProps: {},
			webPageName: 'Add a page name'
        };
	}

	addThisComponentToTree = (e, data, key, getNodeKey) => {
		this.setState(state => ({
			treeData: addNodeUnderParent({
			  treeData: state.treeData,
			  parentKey: 0,
			  expandParent: true,
			  getNodeKey,
			  newNode: {
				title: key,
			  },
			}).treeData,
		}));
		window.Materialize.toast(`${key} added!`, 4000);
	}

	sendComponentDetailsToModal = (node) => {
		const { id, title } = node;
		console.log(node);
		const { componentlist } = this.props;
		const dataProps = (id === 'pageName') ? {title} : componentlist[title].dataProps;
		this.setState({dataProps}, () => {
			$('#publishChoice').modal().modal('open');
		});
	}

	changeInputDetails = (e, key) => {
		console.log(key);
		const {value} = e.target;
		if(webPageName === key) {
			this.setState({
				webPageName: value
			});
		} else {
			
		}
	}

	changeComponentDetails = (node, path, getNodeKey) => {
		const { treeData, webPageName } = this.state;
		const { title } = node;
		this.setState(state => ({
			treeData: changeNodeAtPath({
			  treeData: state.treeData,
			  path,
			  getNodeKey,
			  newNode: { ...node, title: webPageName },
			}),
		}));
		$('#publishChoice').modal('close');
	}

	modalDetailsWithSelect = (data) => {
		const optionsForSelect = data.map((keys) => <option value={keys}>{keys.toString()}</option>);
		return optionsForSelect;
	}

	render () {
		const { props, state } = this;
		const { componentlist } = props;
		const { dataProps, treeData } = state;

		console.log(treeData);

		const modalDetailsArr = Object.keys(dataProps).map((key, index) => {
			return (
				<Row>
					{(typeof(dataProps[key]) === 'string') && <Input s={12} label={key} onChange={e => this.changeInputDetails(e, dataProps[key])} validate defaultValue={dataProps[key]} />}
					{(Array.isArray(dataProps[key])) && <Input s={12} type='select' label={key} defaultValue={dataProps[key][0]}>
						{this.modalDetailsWithSelect(dataProps[key])}
						</Input>
					}
				</Row>
			);
		});

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
									onClick={() => {this.sendComponentDetailsToModal(node)}}
								>
								Edit This
								<Icon right>mode edit</Icon>
								</Button>,
								<Modal
									header="Publish Data"
									id="publishChoice"
									fixedFooter
									key={`componentName-${0}`}
									actions={
										<div>
										<Button modal="close" waves="light">dismiss</Button>
										<Button waves="light" onClick={e => this.changeComponentDetails(node, path, getNodeKey)}>Submit</Button>
										</div>
									}
								>
								{modalDetailsArr}
								</Modal>,
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
			</Row>
		);
	}
}
