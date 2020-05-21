import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Map from '../Map/map';
import { getGovernorates, getBusinessSectors } from '../../Services/APIs/configApis/config'
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';

interface Village {
    villageName: { ar: string };
    villageLegacyCode: number;
}
interface District {
    districtName: { ar: string };
    districtLegacyCode: number;
    villages: Array<Village>
}
interface Governorate {
    governorateName: { ar: string };
    governorateLegacyCode: number;
    districts: Array<District>;
}
interface Specialty {
    businessSpecialtyName: { ar: string };
    legacyCode: number;
}
interface Activities {
    i18n: { ar: string };
    legacyCode: number;
    specialties: Array<Specialty>
}
interface BusinessSector {
    i18n: { ar: string };
    legacyCode: number;
    activities: Array<Activities>
}
export const StepTwoForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep } = props;
    const [mapState, openCloseMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [businessSectors, setBusinessSectors] = useState<Array<BusinessSector>>([{
        i18n: { ar: '' }, legacyCode: 0,
        activities: [{
            i18n: { ar: '' }, legacyCode: 0,
            specialties: [{ businessSpecialtyName: { ar: '' }, legacyCode: 0 }]
        }
        ]
    }]);
    const [governorates, setGovernorates] = useState<Array<Governorate>>([{
        governorateName: { ar: '' }, governorateLegacyCode: 0,
        districts: [{
            districtName: { ar: '' }, districtLegacyCode: 0,
            villages: [{ villageName: { ar: '' }, villageLegacyCode: 0 }]
        }
        ]
    }]);
    useEffect(() => {
        getConfig();
    }, []);
    async function getConfig() {
        setLoading(true);
        const resGov = await getGovernorates();
        if (resGov.status === "success") {
            setGovernorates(resGov.body.governorates)
        } else console.log(resGov.error)

        const resBS = await getBusinessSectors();
        if (resBS.status === "success") {
            setLoading(false);
            setBusinessSectors(resBS.body.sectors)
        } else setLoading(false);
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Loader open={loading} type="fullscreen" />
            {mapState && <Map show={mapState}
                handleClose={() => openCloseMap(false)}
                save={(businessAddressLatLong: { lat: number; lng: number }) => { setFieldValue('businessAddressLatLongNumber', businessAddressLatLong); openCloseMap(false) }}
                location={props.values.businessAddressLatLongNumber}
                header={local.customerWorkAddressLocationTitle}
            />}
            <Form.Group as={Row} controlId="businessName">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.businessName}*`}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessName"
                        data-qc="businessName"
                        value={values.businessName}
                        onChange={handleChange}
                        isInvalid={errors.businessName && touched.businessName}
                        onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessName}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessAddress">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.businessAddress}*`}</Form.Label>
                <Col sm={5}>
                    <Form.Control
                        type="text"
                        name="businessAddress"
                        data-qc="businessAddress"
                        value={values.businessAddress}
                        onChange={handleChange}
                        isInvalid={errors.businessAddress && touched.businessAddress}
                        onBlur={handleBlur}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessAddress}
                    </Form.Control.Feedback>
                </Col>
                <Col sm={3}>
                    <Button onClick={() => openCloseMap(true)}>{local.customerWorkAddressLocationTitle}</Button>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="governorate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.governorate}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="governorate"
                        data-qc="governorate"
                        value={values.governorate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.governorate && touched.governorate}
                    >
                        <option value="" disabled></option>
                        {governorates.map((governorate, index) => {
                            return <option key={index} value={governorate.governorateLegacyCode} >{governorate.governorateName.ar}</option>
                        })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="district">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.district}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="district"
                        data-qc="district"
                        value={values.district}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!values.governorate}
                        isInvalid={errors.district && touched.district}
                    >
                        <option value="" disabled></option>
                        {governorates.find(gov => gov.governorateLegacyCode === Number(values.governorate))?.districts.map((district, index) => {
                            return <option key={index} value={district.districtLegacyCode} >{district.districtName.ar}</option>
                        })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="village">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.village}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="village"
                        data-qc="village"
                        value={values.village}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!values.district}
                        isInvalid={errors.village && touched.village}
                    >
                        <option value="" disabled></option>
                        {governorates.find(gov => gov.governorateLegacyCode === Number(values.governorate))?.districts
                            .find(district => district.districtLegacyCode === Number(values.district))?.villages
                            .map((village, index) => {
                                return <option key={index} value={village.villageLegacyCode} >{village.villageName.ar}</option>
                            })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="ruralUrban">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.ruralUrban}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="ruralUrban"
                        data-qc="ruralUrban"
                        value={values.ruralUrban}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.ruralUrban && touched.ruralUrban}
                    >
                        <option value="" disabled></option>
                        <option value="rural">{local.rural}</option>
                        <option value="urban">{local.urban}</option>
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessPostalCode">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessPostalCode}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessPostalCode"
                        data-qc="businessPostalCode"
                        value={values.businessPostalCode}
                        onBlur={handleBlur}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('businessPostalCode', event.currentTarget.value)
                            }
                        }}
                        maxLength={5}
                        isInvalid={errors.businessPostalCode && touched.businessPostalCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessPostalCode}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessPhoneNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessPhoneNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessPhoneNumber"
                        data-qc="businessPhoneNumber"
                        value={values.businessPhoneNumber}
                        onBlur={handleBlur}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('businessPhoneNumber', event.currentTarget.value)
                            }
                        }}
                        maxLength={11}
                        isInvalid={errors.businessPhoneNumber && touched.businessPhoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessPhoneNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessSector">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.businessSector}*`}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="businessSector"
                        data-qc="businessSector"
                        value={values.businessSector}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessSector && touched.businessSector}
                    >
                        <option value="" disabled></option>
                        {businessSectors?.map((businessSector, index) => {
                            return <option key={index} value={businessSector.legacyCode} >{businessSector.i18n.ar}</option>
                        })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessActivity">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{`${local.businessActivity}*`}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="businessActivity"
                        data-qc="businessActivity"
                        value={values.businessActivity}
                        disabled={!values.businessSector}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessActivity && touched.businessActivity}
                    >
                        <option value="" disabled></option>
                        {businessSectors.find(businessSector => businessSector.legacyCode === Number(values.businessSector))?.activities
                            .map((activity, index) => {
                                return <option key={index} value={activity.legacyCode} >{activity.i18n.ar}</option>
                            })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessSpeciality">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessSpeciality}</Form.Label>
                <Col sm={6}>
                    <Form.Control as="select"
                        type="select"
                        name="businessSpeciality"
                        data-qc="businessSpeciality"
                        value={values.businessSpeciality}
                        disabled={!values.businessActivity}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessSpeciality && touched.businessSpeciality}
                    >
                        <option value="" disabled></option>
                        {businessSectors.find(businessSector => businessSector.legacyCode === Number(values.businessSector))?.activities
                            .find(activity => activity.legacyCode === Number(values.businessActivity))?.specialties
                            .map((speciality, index) => {
                                return <option key={index} value={speciality.legacyCode} >{speciality.businessSpecialtyName.ar}</option>
                            })}
                    </Form.Control>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessLicenseNumber"
                        data-qc="businessLicenseNumber"
                        value={values.businessLicenseNumber}
                        onBlur={handleBlur}
                        maxLength={100}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('businessLicenseNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.businessLicenseNumber && touched.businessLicenseNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessLicenseNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseIssuePlace">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseIssuePlace}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="businessLicenseIssuePlace"
                        data-qc="businessLicenseIssuePlace"
                        value={values.businessLicenseIssuePlace}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        maxLength={100}
                        isInvalid={errors.businessLicenseIssuePlace && touched.businessLicenseIssuePlace}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessLicenseIssuePlace}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="businessLicenseIssueDate">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.businessLicenseIssueDate}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="date"
                        name="businessLicenseIssueDate"
                        data-qc="businessLicenseIssueDate"
                        value={values.businessLicenseIssueDate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={errors.businessLicenseIssueDate && touched.businessLicenseIssueDate}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.businessLicenseIssueDate}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="commercialRegisterNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.commercialRegisterNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="commercialRegisterNumber"
                        data-qc="commercialRegisterNumber"
                        value={values.commercialRegisterNumber}
                        onBlur={handleBlur}
                        maxLength={100}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('commercialRegisterNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.commercialRegisterNumber && touched.commercialRegisterNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.commercialRegisterNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="industryRegisterNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.industryRegisterNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="industryRegisterNumber"
                        data-qc="industryRegisterNumber"
                        value={values.industryRegisterNumber}
                        onBlur={handleBlur}
                        maxLength={100}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('industryRegisterNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.industryRegisterNumber && touched.industryRegisterNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.industryRegisterNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="taxCardNumber">
                <Form.Label style={{ textAlign: 'right' }} column sm={2}>{local.taxCardNumber}</Form.Label>
                <Col sm={6}>
                    <Form.Control
                        type="text"
                        name="taxCardNumber"
                        data-qc="taxCardNumber"
                        value={values.taxCardNumber}
                        onBlur={handleBlur}
                        maxLength={100}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const re = /^\d*$/;
                            if (event.currentTarget.value === '' || re.test(event.currentTarget.value)) {
                                setFieldValue('taxCardNumber', event.currentTarget.value)
                            }
                        }}
                        isInvalid={errors.taxCardNumber && touched.taxCardNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.taxCardNumber}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Button style={{ float: 'right' }} onClick={() => previousStep(values)} data-qc="previous">{local.previous}</Button>
            <Button type="submit" data-qc="next">{local.next}</Button>
        </Form>
    )
}