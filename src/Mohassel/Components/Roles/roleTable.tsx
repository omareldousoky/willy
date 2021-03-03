import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import * as local from '../../../Shared/Assets/ar.json'

interface SectionAction {
  i18n: any
  create?: number
  get?: number
  update?: number
  delete?: number
}
interface Section {
  _id: string
  key: string
  i18n: any
  actions: Array<any>
}

interface Props {
  sections: Array<Section>
  updatePerms?: Function
  permissions?: any
}
interface State {
  permissions: any
  sections: Array<Section>
}
class RoleTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      permissions: {},
      sections: [],
    }
  }

  static getDerivedStateFromProps(props) {
    return { sections: props.sections, permissions: props.permissions }
  }

  check(e, parent, val) {
    const perms = { ...this.state.permissions }
    const newPerms = this.objectHandler(perms, e, parent, val)
    this.setState({
      permissions: newPerms,
    })
    this.props.updatePerms && this.props.updatePerms(newPerms)
  }

  checkAll(e, parent, action) {
    const { sections } = this.state
    const section = sections.find((sec) => sec.key === parent)
    const actionsInRelation = section?.actions.filter((obj) =>
      Object.keys(obj).includes(action)
    )
    let perms = { ...this.state.permissions }
    actionsInRelation?.forEach((elem) => {
      const newPerms = this.objectHandler(perms, e, parent, elem[action])
      perms = newPerms
    })
    this.setState({
      permissions: perms,
    })
    this.props.updatePerms && this.props.updatePerms(perms)
  }

  objectHandler(perms, e, parent, action) {
    if (e) {
      if (!Object.keys(perms).includes(parent)) {
        perms[parent] = []
      }
      if (!perms[parent].includes(action)) {
        perms[parent].push(action)
      }
    } else {
      const index = perms[parent].indexOf(action)
      if (index > -1) {
        perms[parent].splice(index, 1)
        if (perms[parent].length === 0) {
          delete perms[parent]
        }
      }
    }
    return perms
  }

  isChecked(objectKey, actionVal, fieldKey, action) {
    const section = this.state.sections.find((obj) => obj.key === objectKey)
    const actionValue: SectionAction = section?.actions.find(
      (act) => act.i18n.en === fieldKey
    )
    // Manual Select
    if (
      this.props.updatePerms &&
      this.state.permissions[objectKey] &&
      this.state.permissions[objectKey].includes(actionVal)
    ) {
      return true
    }
    if (!this.props.updatePerms) {
      if (
        this.props.permissions &&
        Object.keys(this.props.permissions).length > 0 &&
        this.props.permissions[objectKey] &&
        actionValue[action] &&
        (
          BigInt(this.props.permissions[objectKey]) &
          BigInt(actionValue[action])
        ).toString() === BigInt(actionValue[action]).toString()
      ) {
        return true
      }
    } else {
      return false
    }
  }

  render() {
    const tableHead = {
      backgroundColor: 'white',
    }
    const lowerTableHead = {
      backgroundColor: '#fafafa',
    }
    return (
      <div>
        <Table style={{ textAlign: 'right', margin: 0 }}>
          <thead style={tableHead}>
            <tr style={{}}>
              <th
                style={{
                  width: '30%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              >
                {local.permissions}
              </th>
              <th
                style={{
                  width: '10%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              >
                {local.create}
              </th>
              <th
                style={{
                  width: '10%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              >
                {local.read}
              </th>
              <th
                style={{
                  width: '10%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              >
                {local.edit}
              </th>
              <th
                style={{
                  width: '10%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              >
                {local.delete}
              </th>
              <th
                style={{
                  width: '30%',
                  borderBottom: 'none',
                  fontSize: 12,
                  color: '#6e6e6e',
                }}
              />
            </tr>
          </thead>
        </Table>
        {this.state.sections.map((obj, i) => (
          <Table key={i} style={{ textAlign: 'right', margin: 0 }}>
            <thead style={lowerTableHead}>
              <tr>
                <th
                  style={{ width: '30%', borderBottom: 'none', fontSize: 14 }}
                >
                  {obj.i18n.ar}
                </th>
                <th style={{ width: '10%', borderBottom: 'none' }}>
                  {this.props.updatePerms &&
                    obj.actions.find((action) => action.create) && (
                      <Form.Check
                        type="checkbox"
                        onClick={(e) =>
                          this.checkAll(
                            e.currentTarget.checked,
                            obj.key,
                            'create'
                          )
                        }
                        disabled={!this.props.updatePerms}
                      />
                    )}
                </th>
                <th style={{ width: '10%', borderBottom: 'none' }}>
                  {this.props.updatePerms &&
                    obj.actions.find((action) => action.get) && (
                      <Form.Check
                        type="checkbox"
                        onClick={(e) =>
                          this.checkAll(e.currentTarget.checked, obj.key, 'get')
                        }
                        disabled={!this.props.updatePerms}
                      />
                    )}
                </th>
                <th style={{ width: '10%', borderBottom: 'none' }}>
                  {this.props.updatePerms &&
                    obj.actions.find((action) => action.update) && (
                      <Form.Check
                        type="checkbox"
                        onClick={(e) =>
                          this.checkAll(
                            e.currentTarget.checked,
                            obj.key,
                            'update'
                          )
                        }
                        disabled={!this.props.updatePerms}
                      />
                    )}
                </th>
                <th style={{ width: '10%', borderBottom: 'none' }}>
                  {this.props.updatePerms &&
                    obj.actions.find((action) => action.delete) && (
                      <Form.Check
                        type="checkbox"
                        onClick={(e) =>
                          this.checkAll(
                            e.currentTarget.checked,
                            obj.key,
                            'delete'
                          )
                        }
                        disabled={!this.props.updatePerms}
                      />
                    )}
                </th>
                <th style={{ width: '30%', borderBottom: 'none' }} />
              </tr>
            </thead>
            <tbody>
              {obj.actions.map((action, i) => {
                return (
                  <tr key={i}>
                    <td style={{ width: '30%', fontSize: 12 }}>
                      {action.i18n.ar}
                    </td>
                    <td style={{ width: '10%' }}>
                      {action.create ? (
                        <Form.Check
                          type="checkbox"
                          checked={this.isChecked(
                            obj.key,
                            action.create,
                            action.i18n.en,
                            'create'
                          )}
                          onChange={(e) =>
                            this.check(
                              e.currentTarget.checked,
                              obj.key,
                              action.create
                            )
                          }
                          disabled={!this.props.updatePerms}
                        />
                      ) : (
                        ''
                      )}
                    </td>
                    <td style={{ width: '10%' }}>
                      {action.get ? (
                        <Form.Check
                          type="checkbox"
                          checked={this.isChecked(
                            obj.key,
                            action.get,
                            action.i18n.en,
                            'get'
                          )}
                          onChange={(e) =>
                            this.check(
                              e.currentTarget.checked,
                              obj.key,
                              action.get
                            )
                          }
                          disabled={!this.props.updatePerms}
                        />
                      ) : (
                        ''
                      )}
                    </td>
                    <td style={{ width: '10%' }}>
                      {action.update ? (
                        <Form.Check
                          type="checkbox"
                          checked={this.isChecked(
                            obj.key,
                            action.update,
                            action.i18n.en,
                            'update'
                          )}
                          onChange={(e) =>
                            this.check(
                              e.currentTarget.checked,
                              obj.key,
                              action.update
                            )
                          }
                          disabled={!this.props.updatePerms}
                        />
                      ) : (
                        ''
                      )}
                    </td>
                    <td style={{ width: '10%' }}>
                      {action.delete ? (
                        <Form.Check
                          type="checkbox"
                          checked={this.isChecked(
                            obj.key,
                            action.delete,
                            action.i18n.en,
                            'delete'
                          )}
                          onChange={(e) =>
                            this.check(
                              e.currentTarget.checked,
                              obj.key,
                              action.delete
                            )
                          }
                          disabled={!this.props.updatePerms}
                        />
                      ) : (
                        ''
                      )}
                    </td>
                    <td style={{ width: '30%' }} />
                  </tr>
                )
              })}
            </tbody>
          </Table>
        ))}
      </div>
    )
  }
}
export default RoleTable
