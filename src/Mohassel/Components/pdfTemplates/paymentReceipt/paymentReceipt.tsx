import React from 'react';
import './paymentReceipt.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic } from "../../../../Shared/Services/utils";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tafgeet from 'tafgeetjs'

const PaymentReceipt = (props) => {
    function getPurpose(installmentSerial: number) {
        switch (installmentSerial) {
            case 0: return local.stamps;
            case 1: return local.representativeFees;
            case 2: return local.applicationFee;
            default: return '';
        }
    }
    return (
        <>
            {props.receiptData.map((receiptData, index) => {
                return (

                    <div key={index} className="payment-receipt frame" dir="rtl" lang="ar">
                        <div className="receipt-container">
                        <div className="receipt-content">
                                <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                                    <tr style={{ height: "10px" }}></tr>
                                    <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                                    <tr style={{ height: "10px" }}></tr>
                                </table>
                            <div className="receipt-header">
                                <h5>{local.tasaheelName}</h5>
                                <h5>{local.paymentReceipt}</h5>
                            </div>
    
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.date}</Form.Label>
                                    <Form.Label column sm={6} className="info">{timeToArabicDate(receiptData.date, false)}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.receiptNumber}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.receiptNumber)}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.customerName}</Form.Label>
                                    <Form.Label column sm={6} className="info">{receiptData.customerName}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{props.fromLoanIssuance ? local.value : local.installmentType}</Form.Label>
                                    <Form.Label column sm={6} className="info"><span style={{ direction: 'ltr' }}>{numbersToArabic(receiptData.installmentAmount)}</span></Form.Label>
                                </Form.Group>
                                {props.fromLoanIssuance ? null : <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.paidFrom}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.previouslyPaid)}</Form.Label>
                                </Form.Group>}
                                {props.fromLoanIssuance ? null : <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.currentPayment}</Form.Label>
                                    <Form.Label column sm={6} className="info"><span style={{ direction: 'ltr' }}>{numbersToArabic(receiptData.paidNow)}</span>{receiptData.paidNow ? ` = (${new Tafgeet(receiptData.paidNow, 'EGP').parse()})` : null}</Form.Label>
                                </Form.Group>}
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.purpose}</Form.Label>
                                    {props.fromLoanIssuance ?
                                        <Form.Label column sm={6} className="info">{getPurpose(receiptData.installmentSerial)}</Form.Label>
                                        : <Form.Label column sm={6} className="info">{'سداد قسط رقم : ' + numbersToArabic(props.data.applicationKey) + "/" + numbersToArabic(receiptData.installmentSerial)}</Form.Label>
                                    }
                                </Form.Group>
                                {props.fromLoanIssuance ? null : <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.remaining}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.remaining)}</Form.Label>
                                </Form.Group>
                                }
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.recipientSignature}</Form.Label>
                                    <Form.Label column sm={6} className="dots">........................................................</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.revisedAndIssued}</Form.Label>
                                    <Form.Label column sm={6} className="dots">........................................................</Form.Label>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default PaymentReceipt;