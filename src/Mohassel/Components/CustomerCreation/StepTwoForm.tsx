import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Map from '../Map/map';
import { getGovernorates, getBusinessSectors } from '../../Services/APIs/configApis/config'
import * as local from '../../../Shared/Assets/ar.json';
import { Loader } from '../../../Shared/Components/Loader';
import Can from '../../config/Can';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../../Shared/Services/utils';

export interface Village {
    villageName: { ar: string };
    villageLegacyCode: number;
}
export interface District {
    districtName: { ar: string };
    districtLegacyCode: number;
    villages: Array<Village>;
}
export interface Governorate {
    governorateName: { ar: string };
    governorateLegacyCode: number;
    districts: Array<District>;
}
interface Specialty {
    businessSpecialtyName: { ar: string };
    legacyCode: number;
    active?: boolean;
}
interface Activities {
    i18n: { ar: string };
    legacyCode: number;
    specialties: Array<Specialty>;
    active?: boolean;
}
export interface BusinessSector {
    i18n: { ar: string };
    legacyCode: number;
    activities: Array<Activities>;
}
export const StepTwoForm = (props: any) => {
    const { values, handleSubmit, handleBlur, handleChange, errors, touched, setFieldValue, previousStep, isCompany } = props;
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
    async function getConfig() {
        setLoading(true);
        const resGov = await getGovernorates();
        if (resGov.status === "success") {
            setGovernorates(resGov.body.governorates)
        } else Swal.fire('Error !',getErrorMessage(resGov.error.error),'error');

        const resBS = await getBusinessSectors();
        if (resBS.status === "success") {
            setLoading(false);
            setBusinessSectors(resBS.body.sectors)
        } else {
            setLoading(false);
            Swal.fire('Error !', getErrorMessage(resBS.error.error),'error');
        }
    }
    useEffect(() => {
        getConfig();
    }, []);
    return (
        <Form onSubmit={handleSubmit}>
            <Loader open={loading} type="fullscreen" />
            {mapState && <Map show={mapState}
                handleClose={() => openCloseMap(false)}
                save={(businessAddressLatLong: { lat: number; lng: number }) => { setFieldValue('businessAddressLatLongNumber', businessAddressLatLong); openCloseMap(false) }}
                location={props.values.businessAddressLatLongNumber}
                header={local.customerWorkAddressLocationTitle}
            />}
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="businessName">
                        <Form.Label className="customer-form-label">{`${isCompany ? local.companyName : local.businessName}*`}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="businessAddress">
                        <Form.Label className="customer-form-label">{`${isCompany ? local.companyAddress : local.businessAddress}*`}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            {isCompany && <Row>
                <Col sm={12}>
                    <Form.Group controlId="businessCharacteristic">
                        <Form.Label className="customer-form-label">{`${local.businessCharacteristic}*`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="businessCharacteristic"
                            data-qc="businessCharacteristic"
                            value={values.businessCharacteristic}
                            onChange={handleChange}
                            isInvalid={errors.businessCharacteristic && touched.businessCharacteristic}
                            onBlur={handleBlur}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.businessCharacteristic}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>}
            {!isCompany && <>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="customerWorkAddressLocation">
                        <Form.Label className="customer-form-label">{local.customerWorkAddressLocationTitle}</Form.Label>
                        <Form.Control
                            type="text"
                            name="customerWorkAddressLocation"
                            data-qc="customerWorkAddressLocation"
                            style={{ cursor: 'pointer', color: '#7dc356', textDecoration: 'underline' }}
                            value={values.businessAddressLatLongNumber?.lat !== 0 && values.businessAddressLatLongNumber?.lng !== 0 ? local.addressChosen : local.chooseCustomerAddress}
                            onClick={() => openCloseMap(true)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="governorate">
                        <Form.Label className="customer-form-label">{local.governorate}</Form.Label>
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
                                    return <option key={index} value={governorate.governorateName.ar} >{governorate.governorateName.ar}</option>
                                })}
                            </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="district">
                        <Form.Label className="customer-form-label">{local.district}</Form.Label>
                            <Form.Control as="select"
                                type="select"
                                name="district"
                                data-qc="district"
                                value={values.district}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.district && touched.district}
                                disabled={!values.governorate}
                            >
                                <option value=""></option>
                                {governorates.find(gov => gov.governorateName.ar === values.governorate)?.districts.map((district, index) => {
                                    return <option key={index} value={district.districtName.ar} >{district.districtName.ar}</option>
                                })}
                            </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="village">
                        <Form.Label className="customer-form-label">{local.village}</Form.Label>
                            <Form.Control as="select"
                                type="select"
                                name="village"
                                data-qc="village"
                                value={values.village}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.village && touched.village}
                                disabled={!values.district}
                            >
                                <option value=""></option>
                                {governorates.find(gov => gov.governorateName.ar === values.governorate)?.districts
                                    .find(district => district.districtName.ar === values.district)?.villages?.map((village, index) => {
                                        return <option key={index} value={village.villageName.ar} >{village.villageName.ar}</option>
                                    })}
                            </Form.Control>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="ruralUrban">
                        <Form.Label className="customer-form-label">{local.ruralUrban}</Form.Label>
                        <div>
                                <Form.Check
																		className="d-inline-block pr-3"
                                    type="radio"
                                    data-qc="rural"
                                    checked={values.ruralUrban === "rural"}
                                    value="rural"
                                    label={local.rural}
                                    name="ruralUrban"
                                    id="rural"
                                    onClick={(e) => setFieldValue("ruralUrban", e.currentTarget.value)}
                                />
                                <Form.Check
																		className="d-inline-block"
                                    type="radio"
                                    data-qc="urban"
                                    checked={values.ruralUrban === "urban"}
                                    value="urban"
                                    label={local.urban}
                                    name="ruralUrban"
                                    id="urban"
                                    onClick={(e) => setFieldValue("ruralUrban", e.currentTarget.value)}
                                />
                        </div>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group controlId="businessPhoneNumber">
                        <Form.Label className="customer-form-label">{local.businessPhoneNumber}</Form.Label>
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
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="businessPostalCode">
                        <Form.Label className="customer-form-label">{local.businessPostalCode}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
            </>}
            <Row>
                <Col sm={isCompany ? 6 : 12}>
                    <Form.Group controlId="businessSector">
                        <Form.Label className="customer-form-label">{`${local.businessSector}*`}</Form.Label>
                        <Can I="updateCustomerHasLoan" a="customer" passThrough>
                            {allowed => <Form.Control as="select"
                                type="select"
                                name="businessSector"
                                data-qc="businessSector"
                                value={values.businessSector}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setFieldValue('businessSector', e.currentTarget.value);
                                    setFieldValue('businessActivity', '');
                                    setFieldValue('businessSpeciality', '');
                                }}
                                isInvalid={errors.businessSector && touched.businessSector}
                                disabled={(!allowed && props.edit && props.hasLoan)}
                            >
                                <option value="" disabled></option>
                                {businessSectors?.map((businessSector, index) => {
                                    return <option key={index} value={businessSector.i18n.ar} >{businessSector.i18n.ar}</option>
                                })}
                            </Form.Control>} 
                            </Can>
                    </Form.Group>
                </Col>
                {isCompany && <Col sm={6}>
                    <Form.Group controlId="businessActivityDetails">
                        <Form.Label className="customer-form-label">{local.businessActivityDetails}</Form.Label>
                        <Form.Control
                            type="text"
                            name="businessActivityDetails"
                            data-qc="businessActivityDetails"
                            value={values.businessActivityDetails}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            // maxLength={5}
                            isInvalid={errors.businessActivityDetails && touched.businessActivityDetails}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.businessActivityDetails}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>}
            </Row>
            {!isCompany && <Row>
                <Col sm={6}>
                    <Form.Group controlId="businessActivity">
                        <Form.Label className="customer-form-label">{`${local.businessActivity}*`}</Form.Label>
                        <Can I="updateCustomerHasLoan" a="customer" passThrough>
                            {allowed =><Form.Control as="select"
                                type="select"
                                name="businessActivity"
                                data-qc="businessActivity"
                                value={values.businessActivity}
                                // disabled={!values.businessSector}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setFieldValue('businessActivity', e.currentTarget.value);
                                    setFieldValue('businessSpeciality', '');
                                }}
                                isInvalid={errors.businessActivity && touched.businessActivity}
                                disabled={!values.businessSector || (!allowed && props.edit && props.hasLoan)}
                            >
                                <option value=""></option>
                                {businessSectors.find(businessSector => businessSector.i18n.ar === values.businessSector)?.activities
                                .filter(activity => activity.active)
                                    .map((activity, index) => {
                                        return <option key={index} value={activity.i18n.ar} >{activity.i18n.ar}</option>
                                    })}
                            </Form.Control>}
                            </Can>
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group controlId="businessSpeciality">
                        <Form.Label className="customer-form-label">{local.businessSpeciality}</Form.Label>
                        <Can I="updateCustomerHasLoan" a="customer" passThrough>
                            {allowed =><Form.Control as="select"
                                type="select"
                                name="businessSpeciality"
                                data-qc="businessSpeciality"
                                value={values.businessSpeciality}
                                // disabled={!values.businessActivity}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.businessSpeciality && touched.businessSpeciality}
                                disabled={!values.businessActivity || (!allowed && props.edit && props.hasLoan)}
                            >
                                <option value=""></option>
                                {businessSectors.find(businessSector => businessSector.i18n.ar === values.businessSector)?.activities
                                    .find(activity => activity.i18n.ar === values.businessActivity)?.specialties?.filter(speciality => speciality.active).map((speciality, index) => {
                                        return <option key={index} value={speciality.businessSpecialtyName.ar} >{speciality.businessSpecialtyName.ar}</option>
                                    })}
                            </Form.Control>}
                            </Can>
                    </Form.Group>
                </Col>
            </Row>}
            <Row>
                <Col sm={6}>
                        <Form.Group controlId="businessLicenseNumber">
                            <Form.Label className="customer-form-label">{local.businessLicenseNumber + (isCompany ? '*' : '')}</Form.Label>
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
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="commercialRegisterNumber">
                            <Form.Label className="customer-form-label">{local.commercialRegisterNumber + (isCompany ? '*' : '')}</Form.Label>
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
                        </Form.Group>
                    </Col>
                </Row>
                {isCompany && <Row>
                <Col sm={6}>
                <Form.Group controlId="legalStructure">
                    <Form.Label className="customer-form-label">{`${local.legalStructure} *`}</Form.Label>
                        <Form.Control
                            type="text"
                            name="legalStructure"
                            data-qc="legalStructure"
                            value={values.legalStructure}
                            onBlur={handleBlur}
                            maxLength={100}
                            onChange={handleChange}
                            isInvalid={errors.legalStructure && touched.legalStructure}
                        />
                    <Form.Control.Feedback type="invalid">
                        {errors.legalStructure}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col sm={6}>
                    <Form.Group controlId="commercialRegisterExpiryDate">
                        <Form.Label className="customer-form-label">{`${local.commercialRegisterExpiryDate} *`}</Form.Label>
                        <Form.Control
                                type="date"
                                name="commercialRegisterExpiryDate"
                                data-qc="commercialRegisterExpiryDate"
                                value={values.commercialRegisterExpiryDate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                isInvalid={errors.commercialRegisterExpiryDate && touched.commercialRegisterExpiryDate}
                            />
                        <Form.Control.Feedback type="invalid">
                            {errors.commercialRegisterExpiryDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>}
            <Row>
                <Col sm={isCompany ? 12 : 6}>
                    <Form.Group controlId="businessLicenseIssueDate">
                        <Form.Label className="customer-form-label">{local.businessLicenseIssueDate + (isCompany ? '*' : '')}</Form.Label>
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
                    </Form.Group>
                </Col>
                {!isCompany && <Col sm={6}>
                    <Form.Group controlId="businessLicenseIssuePlace">
                        <Form.Label className="customer-form-label">{local.businessLicenseIssuePlace}</Form.Label>
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
                    </Form.Group>
                </Col>}
            </Row>
            <Row>
                {!isCompany && <Col sm={6}>
                    <Form.Group controlId="industryRegisterNumber">
                        <Form.Label className="customer-form-label">{local.industryRegisterNumber + (isCompany ? '*' : '')}</Form.Label>
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
                    </Form.Group>
                </Col>}
                <Col sm={isCompany ? 12 : 6}>
                    <Form.Group controlId="taxCardNumber">
                        <Form.Label className="customer-form-label">{local.taxCardNumber + (isCompany ? '*' : '')}</Form.Label>
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
                    </Form.Group>
                </Col>
            </Row>
						<div className="d-flex justify-content-end">
							<Button className="mr-3" onClick={() => previousStep(values)} data-qc="previous" disabled={!previousStep}>{local.previous}</Button>
							<Button type="submit" data-qc="next">{local.next}</Button>
						</div>
        </Form >
    )
}