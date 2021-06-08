import React, { CSSProperties } from 'react'
import Table from 'react-bootstrap/Table'
import * as local from '../../../Shared/Assets/ar.json'
import { theme } from '../../../Shared/theme'
import { UserDateValues } from './userDetailsInterfaces'
import { timeToDate, timeToDateyyymmdd } from '../../../Shared/Services/utils'
import Labels from '../Labels/labels'

interface Props {
  data: UserDateValues
}
const header: CSSProperties = {
  textAlign: 'right',
  fontSize: '14px',
  width: '15%',
  color: theme.colors.lightGrayText,
}
const cell: CSSProperties = {
  textAlign: 'right',
  padding: '10px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.colors.blackText,
}
const UserDetailsView = (props: Props) => {
  const { data } = props
  return (
    <>
      <div style={{ margin: '0 1rem 2rem 0', float: 'right' }}>
        <img alt="backButton" src={require('../../Assets/usersBasic.svg')} />
        <span style={{ marginRight: '1rem' }}> {local.userBasicData} </span>
      </div>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td style={header}>{local.creationDate}*</td>
            <td style={cell}>{timeToDate(data.created.at)}</td>
          </tr>
          <tr>
            <td style={header}>{local.userRole}*</td>
            <td style={cell}>
              <Labels
                labelsTextArr={data.roles?.map((role) => {
                  return role.roleName
                })}
              />
            </td>
          </tr>
          <tr>
            <td style={header}>{local.name}*</td>
            <td style={cell}>{data.name}</td>
          </tr>
          <tr>
            <td style={header}>{local.nationalId}*</td>
            <td style={cell}>{data.nationalId}</td>
          </tr>
          <tr>
            <td style={header}>{local.birthDate}*</td>
            <td style={cell}>{timeToDateyyymmdd(data.birthDate)}</td>
          </tr>
          <tr>
            <td style={header}>{local.gender}*</td>
            <td style={cell}>{data.gender}</td>
          </tr>
          <tr>
            <td style={header}>{local.nationalIdIssueDate}*</td>
            <td style={cell}>{timeToDate(data.nationalIdIssueDate)}</td>
          </tr>
          <tr>
            <td style={header}>{local.mobilePhoneNumber}</td>
            <td style={cell}>{data.mobilePhoneNumber}</td>
          </tr>
          <tr>
            <td style={header}>{local.hrCode}*</td>
            <td style={cell}>{data.hrCode}</td>
          </tr>
          <tr>
            <td style={header}>{local.dateOfHire}*</td>
            <td style={cell}>{timeToDate(data.hiringDate)}</td>
          </tr>
          <tr>
            <td style={header}>{local.username}*</td>
            <td style={cell}>{data.username}</td>
          </tr>
          <tr>
            <td style={header}>{local.secretNumber}*</td>
            <td style={cell}>
              <h3>.....</h3>
            </td>
          </tr>
          <tr>
            <td style={header}>{local.branches}</td>
            <td style={cell}>
              {data.branches && <Labels labelsTextArr={data.branches} />}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default UserDetailsView
