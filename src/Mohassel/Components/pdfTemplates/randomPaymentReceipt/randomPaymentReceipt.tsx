import React from 'react';
import './randomPaymentReceipt.scss';
import * as local from '../../../../Shared/Assets/ar.json';
import { timeToArabicDate, numbersToArabic } from '../../../Services/utils';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tafgeet from 'tafgeetjs'

const randomPaymentReceipt = (props) => {
    function getPurpose(installmentSerial: number) {
        switch (installmentSerial) {
            case 0: return local.stamps;
            case 1: return local.representativeFees;
            case 2: return local.applicationFee;
            default: return '';
        }
    }
    const getValueFromLocalizationFileByKey = (key) => {
        if (key === 'collectionCommission') return local.collectionCommission
        else if (key === 'reissuingFees') return local.reissuingFees
        else if (key === 'legalFees') return local.legalFees
        else if (key === 'clearanceFees') return local.clearanceFees
        else if (key === 'toktokStamp') return local.toktokStamp
        else if (key === 'tricycleStamp') return local.tricycleStamp
    }
    return (
        <div className="random-payment-receipt">
            {props.receiptData.map((receiptData, index) => {
                return (

                    <div key={index} className="random-payment-receipt frame" dir="rtl" lang="ar">
                        <div className="receipt-container">
                            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                                <tr style={{ height: "10px" }}></tr>
                                <tr><th colSpan={1}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                                <tr style={{ height: "10px" }}></tr>
                            </table>
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
                                    <Form.Label column sm={3} className="title">{local.value}</Form.Label>
                                    <Form.Label column sm={6} className="info"><span style={{ direction: 'ltr' }}>{numbersToArabic(receiptData.installmentAmount)}</span> {receiptData.installmentAmount ? ` = (${new Tafgeet(receiptData.installmentAmount, 'EGP').parse()})` : null}</Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={3} className="title">{local.purpose}</Form.Label>
                                    <Form.Label column sm={6} className="info">
                                        {receiptData.type === 'penalty' ? local.payPenalty : receiptData.type === 'randomPayment' ? getValueFromLocalizationFileByKey(receiptData.randomPaymentType) : ''}
                                    </Form.Label>
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
        </div>
    )
}

export default randomPaymentReceipt;