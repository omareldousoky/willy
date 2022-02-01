import React from 'react'
import Select from 'react-select'
import Swal from 'sweetalert2'
import { theme } from '../../../Shared/theme'
import { Loader } from '../../../Shared/Components/Loader'
import { getErrorMessage } from '../../../Shared/Services/utils'
import { getGovernorates } from '../../../Shared/Services/APIs/config'
import local from '../../../Shared/Assets/ar.json'

interface State {
  governoratesOptions: any[]
  governorate: { label: string; value: number }
  loading: boolean
}
interface Props {
  values: { governorate: string }
}

export default class Governorates extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      governorate: { label: '', value: -1 },
      governoratesOptions: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.getGovernoratesService()
  }

  async getGovernoratesService() {
    this.setState({ loading: true })
    const resGov = await getGovernorates()

    if (resGov.status === 'success') {
      const { governorates } = resGov.body
      const options: any[] = []
      governorates.map((gov) => {
        if (gov.governorateName.ar === this.props.values.governorate) {
          this.setState({
            governorate: {
              label: gov.governorateName.ar,
              value: gov.governorateLegacyCode,
            },
          })
        }
        options.push({
          label: gov.governorateName.ar,
          value: gov.governorateLegacyCode,
        })
      })
      this.setState({ governoratesOptions: options })
    } else {
      this.setState(
        {
          governorate: { label: this.props.values.governorate, value: 0 },
        },
        () =>
          Swal.fire({
            title: local.errorTitle,
            confirmButtonText: local.confirmationText,
            text: getErrorMessage(resGov.error.error),
            icon: 'error',
          })
      )
    }
    this.setState({ loading: false })
  }

  render() {
    return (
      <>
        <Loader type="fullsection" open={this.state.loading} />
        <Select
          styles={theme.selectStyleWithBorder}
          theme={theme.selectTheme}
          options={this.state.governoratesOptions}
          value={this.state.governorate}
          onChange={(event) => {
            this.setState({ governorate: event })
            this.props.values.governorate = event.label
          }}
        />
      </>
    )
  }
}
