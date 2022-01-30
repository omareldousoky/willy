import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { Formik } from 'formik'
import * as Yup from 'yup'
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable'
import { Loader } from '../../../Shared/Components/Loader'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../../Shared/config/Can'
import { search, searchFilters } from '../../../Shared/redux/search/actions'
import Search from '../../../Shared/Components/Search/search'
import { loading } from '../../../Shared/redux/loading/actions'
import HeaderWithCards, {
  Tab,
} from '../../../Shared/Components/HeaderWithCards/headerWithCards'
import { antiTerrorismArray, fullEnglishDate } from './terrorismInitials'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { uploadTerroristUnDocument } from '../../../Shared/Services/APIs/Terrorism/terrorism'
import { TerroristResponse } from '../../../Shared/Services/interfaces'

interface Props {
  data: TerroristResponse[]
  error: string
  totalCount: number
  loading: boolean
  searchFilters: object
  search: (data) => Promise<void>
  setSearchFilters: (data) => void
  setLoading: (data) => void
}
interface State {
  tabsToRender: Tab[]
  from: number
  size: number
  showModal: boolean
}
interface FormikValues {
  terrorismLListFile: File
}
interface Errors {
  terrorismLListFile?: string
}
interface Touched {
  terrorismLListFile?: boolean
}
const uploadTerroristDocumentValidation = Yup.object().shape({
  terrorismLListFile: Yup.mixed(),
})
class TerrorismUnList extends Component<Props, State> {
  mappers: {
    title: (() => void) | string
    key: string
    sortable?: boolean
    render: (data: TerroristResponse) => void
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
        key: 'name',
        render: (data) => (
          <p className="small-text">
            {data.name !== 'na' ? data.name : local.na}
          </p>
        ),
      },
      {
        title: local.nationality,
        key: 'nationality',
        render: (data) => (
          <p className="small-text">
            {data.nationality !== 'na' ? data.nationality : local.na}
          </p>
        ),
      },
      {
        title: local.nationalId,
        key: 'nationalId',
        render: (data) => (
          <p className="small-text" dir="ltr">
            {data.nationalId !== 'na' ? data.nationalId : local.na}
          </p>
        ),
      },
      {
        title: local.birthDate,
        key: 'birthDate',
        render: (data) => (
          <p className="small-text">
            {data.birthDate !== 'na' ? data.birthDate : local.na}
          </p>
        ),
      },
      {
        title: local.creationDate,
        key: 'createAt',
        render: (data) => (
          <p className="small-text">
            {data?.created?.at ? fullEnglishDate(data.created.at) : local.na}
          </p>
        ),
      },
    ]
  }

  componentDidMount() {
    this.props.search({
      size: this.state.size,
      from: this.state.from,
      url: 'terroristUn',
    })
    this.setState({
      tabsToRender: antiTerrorismArray(),
    })
  }

  componentWillUnmount() {
    this.props.setSearchFilters({})
    this.props.search({ url: 'clearData' })
  }

  async getTerrorists() {
    this.props.search({
      ...this.props.searchFilters,
      size: this.state.size,
      from: this.state.from,
      url: 'terroristUn',
    })
    if (this.props.error) {
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(this.props.error),
        icon: 'error',
      })
    }
  }

  handleSubmit = async (values: FormikValues) => {
    this.props.setLoading(true)
    this.setState({ showModal: false })
    const formData = new FormData()
    formData.append('data', values.terrorismLListFile)
    const res = await uploadTerroristUnDocument(formData)
    if (res.status === 'success') {
      Swal.fire({
        text: local.uploadedSuccessfully,
        icon: 'success',
        confirmButtonText: local.confirmationText,
      }).then(() => window.location.reload())
    } else {
      Swal.fire({
        confirmButtonText: local.confirmationText,
        text: getErrorMessage(res.error.error),
        icon: 'error',
      })
    }
    this.props.setLoading(false)
  }

  render() {
    return (
      <>
        <HeaderWithCards
          header={local.antiTerrorism}
          array={this.state.tabsToRender}
          active={this.state.tabsToRender
            .map((item) => {
              return item.stringKey
            })
            .indexOf('antiTerrorismUn')}
        />
        <Card className="main-card">
          <Loader type="fullscreen" open={this.props.loading} />
          <div className="custom-card-header">
            <div className="d-flex align-items-center p-0">
              <Card.Title className="ml-2 mb-0">
                {local.terroristsListUn}
              </Card.Title>
              <span className="text-muted">
                {local.noOfTerrorists +
                  ` (${this.props.totalCount ? this.props.totalCount : 0})`}
              </span>
            </div>
            <div>
              <Can I="createTerrorist" a="customer">
                <Button
                  className="big-button mx-2"
                  onClick={() => {
                    this.setState({ showModal: true })
                  }}
                >
                  {local.uploadTerroristsList}
                </Button>
              </Can>
            </div>
          </div>
          <hr className="dashed-line" />
          <Card.Body>
            <Search
              searchKeys={['keyword', 'dateFromTo']}
              dropDownKeys={['name']}
              url="terroristUn"
              from={this.state.from}
              size={this.state.size}
            />
            <DynamicTable
              from={this.state.from}
              size={this.state.size}
              url="terroristUn"
              totalCount={this.props.totalCount}
              pagination
              data={this.props.data}
              mappers={this.mappers}
              changeNumber={(key: string, number: number) => {
                this.setState(
                  ({ [key]: number } as unknown) as Pick<State, keyof State>,
                  () => this.getTerrorists()
                )
              }}
            />
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <Formik
              initialValues={{ terrorismLListFile: new File([''], '') }}
              onSubmit={this.handleSubmit}
              validationSchema={uploadTerroristDocumentValidation}
              validateOnBlur
              validateOnChange
            >
              {(formikProps) => (
                <Form onSubmit={formikProps.handleSubmit}>
                  <Modal.Header>
                    <Modal.Title className="m-auto">
                      {local.uploadTerroristsList}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group
                      className="d-flex justify-content-center"
                      as={Row}
                      controlId="terrorismUnListFile"
                    >
                      <Form.File
                        name="terrorismUnListFile"
                        type="file"
                        onChange={(e) =>
                          formikProps.setFieldValue(
                            'terrorismLListFile',
                            e.target.files[0]
                          )
                        }
                        isInvalid={
                          Boolean(formikProps.errors.terrorismLListFile) &&
                          Boolean(formikProps.touched.terrorismLListFile)
                        }
                        accept=".xlsx,.xls,.xlsm,.csv"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikProps.errors.terrorismLListFile}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => this.setState({ showModal: false })}
                    >
                      {local.cancel}
                    </Button>
                    <Button type="submit" variant="primary">
                      {local.submit}
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
      </>
    )
  }
}
const addSearchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(search(data)),
    setSearchFilters: (data) => dispatch(searchFilters(data)),
    setLoading: (data) => dispatch(loading(data)),
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.search.data,
    error: state.search.error,
    totalCount: state.search.totalCount,
    loading: state.loading,
    searchFilters: state.searchFilters,
  }
}

export default connect(mapStateToProps, addSearchToProps)(TerrorismUnList)
