import React from 'react';
import './paymentReceipt.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const PaymentReceipt = (props) => {
    return (
        <>
            {props.receiptData.map((receiptData, index) => {
                return (
                    <div key={index} className="payment-receipt frame" dir="rtl" lang="ar">
                        <div key={index} className="receipt-container">
                            <div className="receipt-header">
                                <h5>{local.tasaheelName}</h5>
                                <h5>{local.paymentReceipt}</h5>
                            </div>
                            <div className="receipt-content">
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
                                    <Form.Label column sm={3} className="title">{local.installmentType}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.installmentAmount)}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.paidFrom}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.previouslyPaid)}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.currentPayment}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.paidNow)}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.purpose}</Form.Label>
                                    <Form.Label column sm={6} className="info">{''}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.remaining}</Form.Label>
                                    <Form.Label column sm={6} className="info">{numbersToArabic(receiptData.remaining)}</Form.Label>
                                </Form.Group>
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