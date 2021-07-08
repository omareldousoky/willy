import './createBranch.scss'

import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import * as local from '../../../Shared/Assets/ar.json'
import Governorates from '../Governorates/governorates'
import { Loader } from '../../../Shared/Components/Loader'
import Map from '../Map/map'
import { checkBranchNameDuplicates } from '../../Services/APIs/Branch/checkBranchNameDuplicates'

import {
  BasicErrors,
  BasicTouched,
  BasicValues,
} from './branchCreationInterfaces'
import { LtsIcon } from '../../../Shared/Components'

interface Props {
  values: BasicValues
  handleSubmit: any
  handleChange: any
  handleBlur: any
  setFieldValue: any
  cancel: any
  errors: BasicErrors
  touched: BasicTouched
}
const StepOneForm = (props: Props) => {
  const [mapState, openCloseMap] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <Form className="branch-data-form" onSubmit={props.handleSubmit}>
      {mapState && (
        <Map
          show={mapState}
          handleClose={() => openCloseMap(false)}
          save={(branchAddressLatLong: { lat: number; lng: number }) => {
            props.setFieldValue('branchAddressLatLong', branchAddressLatLong)
            openCloseMap(false)
          }}
          location={props.values.branchAddressLatLong}
          header={local.branchOnMap}
        />
      )}
      <Row>
        <Col>
          <Form.Group controlId="name">
            <Form.Label className="branch-data-label">
              {`${local.branchName}*`}
            </Form.Label>
            <Form.Control
              placeholder={local.branchName}
              type="text"
              name="name"
              data-qc="name"
              value={props.values.name}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                props.setFieldValue('name', event.currentTarget.value)
                setLoading(true)
                const res = await checkBranchNameDuplicates({
                  branchName: event.currentTarget.value,
                })

                if (res.status === 'success') {
                  setLoading(false)
                  props.setFieldValue('branchNameChecker', res.body.Exists)
                } else setLoading(false)
              }}
              onBlur={props.handleBlur}
              isInvalid={(props.errors.name && props.touched.name) as boolean}
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.name}
            </Form.Control.Feedback>
            <Col sm={1}>
              <Col sm={1}>
                <Loader type="inline" open={loading} />
              </Col>
            </Col>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="governorate">
            <Form.Label className="branch-data-label">
              {`${local.governorate}*`}
            </Form.Label>

            <Governorates values={props.values} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="branch-data-label">{`${local.branchOnMap}`}</div>
          <Button
            className="map-btn mb-3"
            name="branchAddressLatLong"
            data-qc="branchAddressLatLong"
            onClick={() => openCloseMap(true)}
          >
            <span>
              <LtsIcon name="active-location" color="#7dc255" />
              {local.branchOnMap}
            </span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="address">
            <Form.Label className="branch-data-label">
              {`${local.branchAddress}*`}
            </Form.Label>
            <Form.Control
              placeholder={local.branchAddress}
              type="text"
              name="address"
              data-qc="address"
              value={props.values.address}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.address && props.touched.address) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.address}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="postalCode">
            <Form.Label className="branch-data-label">
              {local.postalCode}
            </Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              placeholder={local.postalCode}
              data-qc="postalCode"
              value={props.values.postalCode as string}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.postalCode && props.touched.postalCode) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.postalCode}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="branch-data-label">
              {local.mobilePhoneNumber}
            </Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              placeholder={local.mobilePhoneNumber}
              data-qc="phoneNumber"
              value={props.values.phoneNumber}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.phoneNumber &&
                  props.touched.phoneNumber) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="branch-data-label">
              {local.faxNumber}
            </Form.Label>
            <Form.Control
              type="text"
              name="faxNumber"
              placeholder={local.faxNumber}
              data-qc="faxNumber"
              value={props.values.faxNumber}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.faxNumber && props.touched.faxNumber) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.faxNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label className="branch-data-label">
              {`${local.licenseNumber}*`}
            </Form.Label>
            <Form.Control
              type="text"
              name="licenseNumber"
              placeholder={local.licenseNumber}
              data-qc="licenseNumber"
              value={props.values.licenseNumber}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.licenseNumber &&
                  props.touched.licenseNumber) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.licenseNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label className="branch-data-label">
              {`${local.licenseDate}*`}
            </Form.Label>
            <Form.Control
              type="date"
              name="licenseDate"
              data-qc="licenseDate"
              value={props.values.licenseDate as string}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              isInvalid={
                (props.errors.licenseDate &&
                  props.touched.licenseDate) as boolean
              }
            />
            <Form.Control.Feedback type="invalid">
              {props.errors.licenseDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-between py-4">
        <Button
          variant="secondary"
          className="w-25"
          onClick={() => {
            props.cancel()
          }}
        >
          {local.cancel}
        </Button>
        <Button
          variant="primary"
          className="w-25"
          type="submit"
          data-qc="submit"
        >
          {local.submit}
        </Button>
      </div>
    </Form>
  )
}

export default StepOneForm
