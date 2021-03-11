import React, { Component } from "react"
import { connect } from "react-redux"
import Swal from "sweetalert2"
import DynamicTable from "../../../Shared/Components/DynamicTable/dynamicTable"
import { Loader } from "../../../Shared/Components/Loader"
import * as local from "../../../Shared/Assets/ar.json"
import Can from "../../config/Can"
import Modal from "react-bootstrap/Modal"
import { search, searchFilters } from "../../../Shared/redux/search/actions"
import Search from "../../../Shared/Components/Search/search"
import { loading } from "../../../Shared/redux/loading/actions"
import HeaderWithCards, { Tab } from "../HeaderWithCards/headerWithCards"
import { antiTerrorismMoneyLaunderingArray } from "./terrorismMoneyLaunderingInitials"
import { Button, Card, Form, Row, Col } from "react-bootstrap"
import { getErrorMessage } from "../../../Shared/Services/utils"
import { Formik } from "formik"
import { uploadSuspectDocument } from "../../Services/APIs/Terrorism/terrorism"
import * as Yup from "yup"
import { SuspectResponse } from "../../../Shared/Services/interfaces"
interface Props {
	data: SuspectResponse[];
	error: string;
	totalCount: number;
	loading: boolean;
	searchFilters: object;
	search: (data) => Promise<void>;
	setSearchFilters: (data) => void;
	setLoading: (data) => void;
}
interface State {
	tabsToRender: Tab[];
	from: number;
	size: number;
	showModal: boolean;
}
interface FormikValues {
	terrorismLListFile: File;
}
interface Errors {
	terrorismLListFile?: string;
}
interface Touched {
	terrorismLListFile?: boolean;
}
const uploadSuspectDocumentValidation = Yup.object().shape({
	terrorismLListFile: Yup.mixed(),
})
class TerrorismList extends Component<Props, State> {
	mappers: {
		title: (() => void) | string;
		key: string;
		sortable?: boolean;
		render: (data: any) => void;
	}[]
	constructor(props: Props) {
		super(props)
		this.state = {
			tabsToRender: [],
			from: 0,
			size: 10,
			showModal: false,
		}
		this.mappers = [
			{
				title: local.name,
				key: "name",
				render: data => data.name
			},
			{
				title: local.nationality,
				key: "nationality",
				render: data => data.nationality
			},
			{
				title: local.nationalId,
				key: "nationalId",
				render: data => data.nationalId
			},
			{
				title: local.birthDate,
				key: 'birthDate',
				render: data => data.birthDate
			},
		]
	}
	componentDidMount() {
		this.getSuspects();
		this.setState({
			tabsToRender: antiTerrorismMoneyLaunderingArray()
		})
	}
	async getSuspects() {
		this.props.search({ ...this.props.searchFilters, size: this.state.size, from: this.state.from, url: 'suspect' })
		if (this.props.error) {
			Swal.fire('', getErrorMessage(this.props.error), "error")
		}
	}
	handleSubmit = async (values: FormikValues) => {
		this.props.setLoading(true)
		this.setState({ showModal: false })
		const formData = new FormData()
		formData.append("data", values.terrorismLListFile);
		const res = await uploadSuspectDocument(formData);
		if (res.status === "success") {
			Swal.fire('', local.uploadedSuccessfully, "success")
		} else {
			Swal.fire('', getErrorMessage(res.error.error), "error")
		}
		this.props.setLoading(false)

	}
	render() {
		return (
			<>
				<HeaderWithCards
					header={local.antiTerrorism}
					array={this.state.tabsToRender}
					active={this.state.tabsToRender.map(item => { return item.icon }).indexOf('users')}
				/>
				<Card className="main-card">
					<Loader type="fullscreen" open={this.props.loading} />
					<div className="custom-card-header">
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.terroristsList}</Card.Title>
							<span className="text-muted">{local.noOfTerrorists + ` (${this.props.totalCount ? this.props.totalCount : 0})`}</span>
						</div>
						<Can I="createSuspect" a="customer">
							<Button
								className="big-button"
								onClick={() => { this.setState({ showModal: true }) }}
							>{local.uploadSuspectsList}
							</Button></Can>
					</div>
					<hr className="dashed-line" />
					<Card.Body>
						<Search
							searchKeys={[
								"keyword",
								"dateFromTo",
							]}
							dropDownKeys={[
								"name",
							]}
							url="suspect"
							from={this.state.from}
							size={this.state.size}
						/>
						<DynamicTable
							from={this.state.from}
							size={this.state.size}
							url="suspect"
							totalCount={this.props.totalCount}
							pagination={true}
							data={this.props.data}
							mappers={this.mappers}
							changeNumber={(key: string, number: number) => {
								this.setState({ [key]: number } as any, () => this.getSuspects());
							}}
						/>
					</Card.Body>
				</Card>
				{this.state.showModal && <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
					<Formik
						initialValues={{ terrorismLListFile: new File([''], '') }}
						onSubmit={this.handleSubmit}
						validationSchema={uploadSuspectDocumentValidation}
						validateOnBlur
						validateOnChange

					>
						{(formikProps) =>
							<Form onSubmit={formikProps.handleSubmit}>
								<Modal.Header>
									<Modal.Title className={"m-auto"}>{local.uploadSuspectsList}</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<Form.Group className="d-flex justify-content-center" as={Row} controlId="terrorismListFile">
										<Form.File
											name="terrorismListFile"
											type="file"
											onChange={(e) => formikProps.setFieldValue('terrorismLListFile', e.target.files[0])}
											isInvalid={Boolean(formikProps.errors.terrorismLListFile) && Boolean(formikProps.touched.terrorismLListFile)}
											accept={".xlsx,.xls,.xlsm,.csv"}
										/>
										<Form.Control.Feedback type="invalid">
											{formikProps.errors.terrorismLListFile}</Form.Control.Feedback>
									</Form.Group>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={() => this.setState({ showModal: false })}>{local.cancel}</Button>
									<Button type="submit" variant="primary">{local.submit}</Button>
								</Modal.Footer>
							</Form>
						}
					</Formik>
				</Modal>
				}
			</>
		)
	}
	componentWillUnmount() {
		this.props.setSearchFilters({})
	}
}
const addSearchToProps = dispatch => {
	return {
		search: data => dispatch(search(data)),
		setSearchFilters: data => dispatch(searchFilters(data)),
		setLoading: data => dispatch(loading(data))
	};
};
const mapStateToProps = state => {
	return {
		data: state.search.data,
		error: state.search.error,
		totalCount: state.search.totalCount,
		loading: state.loading,
		searchFilters: state.searchFilters
	};
};

export default connect(mapStateToProps, addSearchToProps)(TerrorismList)