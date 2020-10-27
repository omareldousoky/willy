import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import DynamicTable from '../../../Shared/Components/DynamicTable/dynamicTable';
import { Loader } from '../../../Shared/Components/Loader';
import * as local from '../../../Shared/Assets/ar.json';
import Can from '../../config/Can';
import HeaderWithCards from '../HeaderWithCards/headerWithCards';
import Form from 'react-bootstrap/Form';
import { getDetailedProducts } from '../../Services/APIs/loanProduct/getProduct';
import { getMaxPrinciples, setMaxPrinciples } from '../../Services/APIs/configApis/config';
import { Formik } from 'formik';
import BackButton from '../BackButton/back-button';
import * as Yup from "yup";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

interface Props {
    history: any;

};
interface Principals {
    maxIndividualPrincipal: number;
    maxGroupIndividualPrincipal: number;
    maxGroupPrincipal: number;
}
interface State {
    loading: boolean;
    principals: Principals;
}

class PrincipleThreshold extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            principals: {
                maxIndividualPrincipal: 0,
                maxGroupIndividualPrincipal: 0,
                maxGroupPrincipal: 0,
            }
        }
    }
    componentDidMount() {
        this.getMaxPrinciples()
    }
    async getMaxPrinciples() {
        this.setState({ loading: true });
        const princples = await getMaxPrinciples();
        if (princples.status === 'success') {
            const principals = {
                maxIndividualPrincipal: princples.body.maxIndividualPrincipal,
                maxGroupIndividualPrincipal: princples.body.maxGroupIndividualPrincipal,
                maxGroupPrincipal: princples.body.maxGroupPrincipal,
            }
            this.setState({
                loading: false,
                principals
            })
        } else {
            Swal.fire('', local.searchError, 'error');
            this.setState({ loading: false });
        }
    }
    update = (values) => {
        Swal.fire({
            title: local.areYouSure,
            text: `${local.principalMaxWillChange}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: local.edit,
            cancelButtonText: local.cancel
        }).then(async (result) => {
            if (result.value) {
                this.setState({ loading: true });
                const res = await setMaxPrinciples(values);
                if (res.status === "success") {
                    this.setState({ loading: false })
                    Swal.fire('', local.principalMaxChangeSuccess, 'success').then(() => window.location.reload());
                } else {
                    this.setState({ loading: false })
                    Swal.fire('', local.principalMaxChangeError, 'error');
                }
            }
        })
    }
    render() {
        return (
            <>
                <BackButton title={local.principalRange} />
                <Loader type="fullscreen" open={this.state.loading} />
                <Card>
                    <Formik
                        initialValues={this.state.principals}
                        onSubmit={this.update}
                        validationSchema={Yup.object().shape({
                            maxIndividualPrincipal: Yup.number().integer().required(local.required),
                            maxGroupIndividualPrincipal: Yup.number().lessThan(Yup.ref('maxGroupPrincipal'),local.individualInGroupPrincipalMustBeLessThanGroupPrincipal).integer().required(local.required),
                            maxGroupPrincipal: Yup.number().integer().required(local.required)
                        })}
                        validateOnBlur
                        validateOnChange
                        enableReinitialize
                    >
                        {(formikProps) =>

                            <Form onSubmit={formikProps.handleSubmit} className="data-form">
                                <Form.Group className="data-group" controlId="maxIndividualPrincipal">
                                    <Form.Label className="data-label" style={{ textAlign: 'right' }} column sm={3}>{`${local.maxIndividualPrincipal}*`}</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="number"
                                            name="maxIndividualPrincipal"
                                            data-qc="maxIndividualPrincipal"
                                            value={formikProps.values.maxIndividualPrincipal}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.maxIndividualPrincipal) && Boolean(formikProps.touched.maxIndividualPrincipal)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.maxIndividualPrincipal}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group className="data-group" controlId="maxGroupIndividualPrincipal">
                                    <Form.Label className="data-label" style={{ textAlign: 'right' }} column sm={3}>{`${local.maxGroupIndividualPrincipal}*`}</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="number"
                                            name="maxGroupIndividualPrincipal"
                                            data-qc="maxGroupIndividualPrincipal"
                                            value={formikProps.values.maxGroupIndividualPrincipal}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.maxGroupIndividualPrincipal) && Boolean(formikProps.touched.maxGroupIndividualPrincipal)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.maxGroupIndividualPrincipal}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group className="data-group" controlId="maxGroupPrincipal">
                                    <Form.Label className="data-label" style={{ textAlign: 'right' }} column sm={3}>{`${local.maxGroupPrincipal}*`}</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="number"
                                            name="maxGroupPrincipal"
                                            data-qc="maxGroupPrincipal"
                                            value={formikProps.values.maxGroupPrincipal}
                                            onBlur={formikProps.handleBlur}
                                            onChange={formikProps.handleChange}
                                            isInvalid={Boolean(formikProps.errors.maxGroupPrincipal) && Boolean(formikProps.touched.maxGroupPrincipal)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formikProps.errors.maxGroupPrincipal}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <div className="d-flex justify-content-center" style={{ margin: '5px 0' }}>
                                    <Button type="submit" variant="primary">{local.submit}</Button>
                                </div>
                            </Form>
                        }
                    </Formik>
                </Card>
            </>
        )
    }
}



export default withRouter(PrincipleThreshold);