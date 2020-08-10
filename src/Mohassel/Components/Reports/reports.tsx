import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Loader } from '../../../Shared/Components/Loader';
import ReportsModal from './reportsModal';
import * as local from '../../../Shared/Assets/ar.json';
import CustomerStatusDetails from '../pdfTemplates/customerStatusDetails/customerStatusDetails';
import { getCustomerDetails } from '../../Services/APIs/Reports/customerDetails';
import { getLoanDetails } from '../../Services/APIs/Reports/loanDetails';
import LoanApplicationDetails from '../pdfTemplates/loanApplicationDetails/loanApplicationDetails';
import BranchesLoanList from '../pdfTemplates/branchesLoanList/branchesLoanList';
import { getBranchLoanList } from '../../Services/APIs/Reports/branchLoanList';

export interface PDF {
  key?: string;
  local?: string;
  inputs?: Array<string>;
}

interface State {
  showModal?: boolean;
  print?: string;
  pdfsArray?: Array<PDF>;
  selectedPdf: PDF;
  data: any;
  loading: boolean;
}

class Reports extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      print: '',
      pdfsArray: [
        { key: 'customerDetails', local: 'حالة العميل التفصيليه', inputs: ['customerKey'] },
        { key: 'loanDetails', local: 'تفاصيل طلب القرض', inputs: ['customerKey'] },
        { key: 'branchLoanList', local: 'القروض المصدرة بالفرع', inputs: ['dateFromTo', 'branches'] },

      ],
      selectedPdf: {},
      data: {},
      loading: false,
    }
  }
  handlePrint(selectedPdf: PDF) {
    this.setState({ showModal: true, selectedPdf: selectedPdf })
  }
  handleSubmit(values) {
    switch (this.state.selectedPdf.key) {
      case 'customerDetails': return this.getCustomerDetails(values);
      case 'loanDetails': return this.getLoanDetails(values);
      case 'branchLoanList': return this.getBranchLoanList(values);
      default: return null;
    }
  }
  async getCustomerDetails(values) {
    this.setState({loading: true, showModal: false})
    const res = await getCustomerDetails(values.key);
    this.setState({
      data: {
        "Loans": [
          {
            "guarantors": [
              {
                "customerName": "0",
                "gender": "0",
                "nationalId": "0",
                "nationalIdIssueDate": "0",
                "homePhoneNumber": "0",
                "homePostalCode": "0",
                "customerHomeAddress": "0",
                "guarantorsIdx": "0"
              }
            ],
            "groupMembers": [
              {
                "key": "110470001563",
                "customerName": "نجوي مصطفي المتولي قاسم",
                "amount": "3000.0",
                "type": "member"
              },
              {
                "key": "110470001750",
                "customerName": "ايمان محمود السعيد زلط",
                "amount": "3000.0",
                "type": "member"
              },
              {
                "key": "110470001751",
                "customerName": "زنوبه حسن مسعد ابوشرمه",
                "amount": "3000.0",
                "type": "member"
              },
              {
                "key": "110470001752",
                "customerName": "فاتن عوض سليمان مصطفي",
                "amount": "4000.0",
                "type": "leader"
              },
              {
                "key": "110470001753",
                "customerName": "زينب عبدالكريم محمد عبدالكريم",
                "amount": "5000.0",
                "type": "member"
              },
              {
                "key": "110470001754",
                "customerName": "ام هاشم محمود محمد مصطفي",
                "amount": "3500.0",
                "type": "member"
              }
            ],
            "installments": [
              {
                "idx": "0",
                "dateOfPayment": "2016-12-08 00:00:00",
                "instTotal": "1097.0",
                "instFees": "417.0",
                "totalPaid": "1097.0",
                "feesPaid": "417.0",
                "status": "paid",
                "paidAt": "2016-11-29 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "1",
                "dateOfPayment": "2016-12-22 00:00:00",
                "instTotal": "1097.0",
                "instFees": "403.0",
                "totalPaid": "1097.0",
                "feesPaid": "403.0",
                "status": "paid",
                "paidAt": "2016-12-13 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "2",
                "dateOfPayment": "2017-01-05 00:00:00",
                "instTotal": "1097.0",
                "instFees": "390.0",
                "totalPaid": "1097.0",
                "feesPaid": "390.0",
                "status": "paid",
                "paidAt": "2016-12-28 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "3",
                "dateOfPayment": "2017-01-19 00:00:00",
                "instTotal": "1097.0",
                "instFees": "379.0",
                "totalPaid": "1097.0",
                "feesPaid": "379.0",
                "status": "paid",
                "paidAt": "2017-01-11 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "4",
                "dateOfPayment": "2017-02-02 00:00:00",
                "instTotal": "1097.0",
                "instFees": "366.0",
                "totalPaid": "1097.0",
                "feesPaid": "366.0",
                "status": "paid",
                "paidAt": "2017-01-24 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "5",
                "dateOfPayment": "2017-02-16 00:00:00",
                "instTotal": "1097.0",
                "instFees": "350.0",
                "totalPaid": "1097.0",
                "feesPaid": "350.0",
                "status": "paid",
                "paidAt": "2017-02-08 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "6",
                "dateOfPayment": "2017-03-02 00:00:00",
                "instTotal": "1097.0",
                "instFees": "336.0",
                "totalPaid": "1097.0",
                "feesPaid": "336.0",
                "status": "paid",
                "paidAt": "2017-02-21 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "7",
                "dateOfPayment": "2017-03-16 00:00:00",
                "instTotal": "1097.0",
                "instFees": "322.0",
                "totalPaid": "1097.0",
                "feesPaid": "322.0",
                "status": "paid",
                "paidAt": "2017-03-08 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "8",
                "dateOfPayment": "2017-03-30 00:00:00",
                "instTotal": "1097.0",
                "instFees": "304.0",
                "totalPaid": "1097.0",
                "feesPaid": "304.0",
                "status": "paid",
                "paidAt": "2017-03-22 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "9",
                "dateOfPayment": "2017-04-13 00:00:00",
                "instTotal": "1097.0",
                "instFees": "289.0",
                "totalPaid": "1097.0",
                "feesPaid": "289.0",
                "status": "paid",
                "paidAt": "2017-04-05 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "10",
                "dateOfPayment": "2017-04-27 00:00:00",
                "instTotal": "1097.0",
                "instFees": "274.0",
                "totalPaid": "1097.0",
                "feesPaid": "274.0",
                "status": "paid",
                "paidAt": "2017-04-18 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "11",
                "dateOfPayment": "2017-05-11 00:00:00",
                "instTotal": "1097.0",
                "instFees": "258.0",
                "totalPaid": "1097.0",
                "feesPaid": "258.0",
                "status": "paid",
                "paidAt": "2017-05-03 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "12",
                "dateOfPayment": "2017-05-25 00:00:00",
                "instTotal": "1097.0",
                "instFees": "243.0",
                "totalPaid": "1097.0",
                "feesPaid": "243.0",
                "status": "paid",
                "paidAt": "2017-05-17 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "13",
                "dateOfPayment": "2017-06-08 00:00:00",
                "instTotal": "1097.0",
                "instFees": "224.0",
                "totalPaid": "1097.0",
                "feesPaid": "224.0",
                "status": "paid",
                "paidAt": "2017-05-30 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "14",
                "dateOfPayment": "2017-06-22 00:00:00",
                "instTotal": "1097.0",
                "instFees": "208.0",
                "totalPaid": "1097.0",
                "feesPaid": "208.0",
                "status": "paid",
                "paidAt": "2017-06-13 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "15",
                "dateOfPayment": "2017-07-06 00:00:00",
                "instTotal": "1097.0",
                "instFees": "188.0",
                "totalPaid": "1097.0",
                "feesPaid": "188.0",
                "status": "paid",
                "paidAt": "2017-06-21 00:00:00",
                "delay": "-15"
              },
              {
                "idx": "16",
                "dateOfPayment": "2017-07-20 00:00:00",
                "instTotal": "1097.0",
                "instFees": "173.0",
                "totalPaid": "1097.0",
                "feesPaid": "173.0",
                "status": "paid",
                "paidAt": "2017-07-12 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "17",
                "dateOfPayment": "2017-08-03 00:00:00",
                "instTotal": "1097.0",
                "instFees": "154.0",
                "totalPaid": "1097.0",
                "feesPaid": "154.0",
                "status": "paid",
                "paidAt": "2017-07-26 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "18",
                "dateOfPayment": "2017-08-17 00:00:00",
                "instTotal": "1097.0",
                "instFees": "137.0",
                "totalPaid": "1097.0",
                "feesPaid": "137.0",
                "status": "paid",
                "paidAt": "2017-08-09 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "19",
                "dateOfPayment": "2017-08-31 00:00:00",
                "instTotal": "1097.0",
                "instFees": "118.0",
                "totalPaid": "1097.0",
                "feesPaid": "118.0",
                "status": "paid",
                "paidAt": "2017-08-23 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "20",
                "dateOfPayment": "2017-09-14 00:00:00",
                "instTotal": "1097.0",
                "instFees": "100.0",
                "totalPaid": "1097.0",
                "feesPaid": "100.0",
                "status": "paid",
                "paidAt": "2017-09-06 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "21",
                "dateOfPayment": "2017-09-28 00:00:00",
                "instTotal": "1097.0",
                "instFees": "80.0",
                "totalPaid": "1097.0",
                "feesPaid": "80.0",
                "status": "paid",
                "paidAt": "2017-09-20 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "22",
                "dateOfPayment": "2017-10-12 00:00:00",
                "instTotal": "1097.0",
                "instFees": "59.0",
                "totalPaid": "1097.0",
                "feesPaid": "59.0",
                "status": "paid",
                "paidAt": "2017-10-04 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "23",
                "dateOfPayment": "2017-10-26 00:00:00",
                "instTotal": "1097.0",
                "instFees": "38.0",
                "totalPaid": "1097.0",
                "feesPaid": "38.0",
                "status": "paid",
                "paidAt": "2017-10-18 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "24",
                "dateOfPayment": "2017-11-09 00:00:00",
                "instTotal": "1097.0",
                "instFees": "115.0",
                "totalPaid": "1097.0",
                "feesPaid": "115.0",
                "status": "paid",
                "paidAt": "2017-11-01 00:00:00",
                "delay": "-8"
              }
            ],
            "idx": "1",
            "creationDate": "2016-11-23",
            "principal": "21500.0",
            "currency": "egp",
            "stamps": "0.0",
            "applicationFees": "0.0",
            "numInst": "24",
            "periodType": "days",
            "periodLength": "14",
            "gracePeriod": "0",
            "representativeFees": "0.0",
            "representativeName": "امل عطا محمد السقا",
            "penaltiesCanceled": "0.0",
            "penaltiesPaid": "0.0",
            "rejectionReason": "",
            "totalPaid": "27425.0",
            "totalFeesPaid": "5925.0",
            "totalPrincipalPaid": "21500.0",
            "customerBalance": "0.0",
            "earlyDays": "214",
            "lateDays": "0",
            "status": "paid",
            "beneficiaryType": "group"
          },
          {
            "guarantors": [
              {
                "customerName": "0",
                "gender": "0",
                "nationalId": "0",
                "nationalIdIssueDate": "0",
                "homePhoneNumber": "0",
                "homePostalCode": "0",
                "customerHomeAddress": "0",
                "guarantorsIdx": "0"
              }
            ],
            "groupMembers": [
              {
                "key": "110470001563",
                "customerName": "نجوي مصطفي المتولي قاسم",
                "amount": "5000.0",
                "type": "member"
              },
              {
                "key": "110470008776",
                "customerName": "نبيله عوض سليمان مصطفي",
                "amount": "3500.0",
                "type": "leader"
              },
              {
                "key": "110470009054",
                "customerName": "غرام احمد محمد عسيلي",
                "amount": "3500.0",
                "type": "member"
              }
            ],
            "installments": [
              {
                "idx": "0",
                "dateOfPayment": "2017-11-30 00:00:00",
                "instTotal": "624.0",
                "instFees": "253.0",
                "totalPaid": "624.0",
                "feesPaid": "253.0",
                "status": "paid",
                "paidAt": "2017-11-20 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "1",
                "dateOfPayment": "2017-12-14 00:00:00",
                "instTotal": "624.0",
                "instFees": "244.0",
                "totalPaid": "624.0",
                "feesPaid": "244.0",
                "status": "paid",
                "paidAt": "2017-12-04 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "2",
                "dateOfPayment": "2017-12-28 00:00:00",
                "instTotal": "624.0",
                "instFees": "237.0",
                "totalPaid": "624.0",
                "feesPaid": "237.0",
                "status": "paid",
                "paidAt": "2017-12-18 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "3",
                "dateOfPayment": "2018-01-11 00:00:00",
                "instTotal": "624.0",
                "instFees": "229.0",
                "totalPaid": "624.0",
                "feesPaid": "229.0",
                "status": "paid",
                "paidAt": "2018-01-01 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "4",
                "dateOfPayment": "2018-01-25 00:00:00",
                "instTotal": "624.0",
                "instFees": "220.0",
                "totalPaid": "624.0",
                "feesPaid": "220.0",
                "status": "paid",
                "paidAt": "2018-01-15 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "5",
                "dateOfPayment": "2018-02-08 00:00:00",
                "instTotal": "624.0",
                "instFees": "212.0",
                "totalPaid": "624.0",
                "feesPaid": "212.0",
                "status": "paid",
                "paidAt": "2018-01-29 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "6",
                "dateOfPayment": "2018-02-22 00:00:00",
                "instTotal": "624.0",
                "instFees": "203.0",
                "totalPaid": "624.0",
                "feesPaid": "203.0",
                "status": "paid",
                "paidAt": "2018-02-12 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "7",
                "dateOfPayment": "2018-03-08 00:00:00",
                "instTotal": "624.0",
                "instFees": "195.0",
                "totalPaid": "624.0",
                "feesPaid": "195.0",
                "status": "paid",
                "paidAt": "2018-02-26 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "8",
                "dateOfPayment": "2018-03-22 00:00:00",
                "instTotal": "624.0",
                "instFees": "185.0",
                "totalPaid": "624.0",
                "feesPaid": "185.0",
                "status": "paid",
                "paidAt": "2018-03-12 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "9",
                "dateOfPayment": "2018-04-05 00:00:00",
                "instTotal": "624.0",
                "instFees": "176.0",
                "totalPaid": "624.0",
                "feesPaid": "176.0",
                "status": "paid",
                "paidAt": "2018-03-26 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "10",
                "dateOfPayment": "2018-04-19 00:00:00",
                "instTotal": "624.0",
                "instFees": "168.0",
                "totalPaid": "624.0",
                "feesPaid": "168.0",
                "status": "paid",
                "paidAt": "2018-04-10 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "11",
                "dateOfPayment": "2018-05-03 00:00:00",
                "instTotal": "624.0",
                "instFees": "158.0",
                "totalPaid": "624.0",
                "feesPaid": "158.0",
                "status": "paid",
                "paidAt": "2018-04-23 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "12",
                "dateOfPayment": "2018-05-17 00:00:00",
                "instTotal": "624.0",
                "instFees": "148.0",
                "totalPaid": "624.0",
                "feesPaid": "148.0",
                "status": "paid",
                "paidAt": "2018-05-07 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "13",
                "dateOfPayment": "2018-05-31 00:00:00",
                "instTotal": "624.0",
                "instFees": "137.0",
                "totalPaid": "624.0",
                "feesPaid": "137.0",
                "status": "paid",
                "paidAt": "2018-05-23 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "14",
                "dateOfPayment": "2018-06-14 00:00:00",
                "instTotal": "624.0",
                "instFees": "127.0",
                "totalPaid": "624.0",
                "feesPaid": "127.0",
                "status": "paid",
                "paidAt": "2018-06-06 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "15",
                "dateOfPayment": "2018-06-28 00:00:00",
                "instTotal": "624.0",
                "instFees": "117.0",
                "totalPaid": "624.0",
                "feesPaid": "117.0",
                "status": "paid",
                "paidAt": "2018-06-20 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "16",
                "dateOfPayment": "2018-07-12 00:00:00",
                "instTotal": "624.0",
                "instFees": "106.0",
                "totalPaid": "624.0",
                "feesPaid": "106.0",
                "status": "paid",
                "paidAt": "2018-07-03 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "17",
                "dateOfPayment": "2018-07-26 00:00:00",
                "instTotal": "624.0",
                "instFees": "96.0",
                "totalPaid": "624.0",
                "feesPaid": "96.0",
                "status": "paid",
                "paidAt": "2018-07-16 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "18",
                "dateOfPayment": "2018-08-09 00:00:00",
                "instTotal": "624.0",
                "instFees": "83.0",
                "totalPaid": "624.0",
                "feesPaid": "83.0",
                "status": "paid",
                "paidAt": "2018-07-30 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "19",
                "dateOfPayment": "2018-08-23 00:00:00",
                "instTotal": "624.0",
                "instFees": "72.0",
                "totalPaid": "624.0",
                "feesPaid": "72.0",
                "status": "paid",
                "paidAt": "2018-08-13 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "20",
                "dateOfPayment": "2018-09-06 00:00:00",
                "instTotal": "624.0",
                "instFees": "62.0",
                "totalPaid": "624.0",
                "feesPaid": "62.0",
                "status": "paid",
                "paidAt": "2018-08-29 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "21",
                "dateOfPayment": "2018-09-20 00:00:00",
                "instTotal": "624.0",
                "instFees": "49.0",
                "totalPaid": "624.0",
                "feesPaid": "49.0",
                "status": "paid",
                "paidAt": "2018-09-11 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "22",
                "dateOfPayment": "2018-10-04 00:00:00",
                "instTotal": "624.0",
                "instFees": "38.0",
                "totalPaid": "624.0",
                "feesPaid": "38.0",
                "status": "paid",
                "paidAt": "2018-09-25 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "23",
                "dateOfPayment": "2018-10-18 00:00:00",
                "instTotal": "624.0",
                "instFees": "25.0",
                "totalPaid": "624.0",
                "feesPaid": "25.0",
                "status": "paid",
                "paidAt": "2018-10-08 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "24",
                "dateOfPayment": "2018-11-01 00:00:00",
                "instTotal": "624.0",
                "instFees": "60.0",
                "totalPaid": "624.0",
                "feesPaid": "60.0",
                "status": "paid",
                "paidAt": "2018-10-22 00:00:00",
                "delay": "-10"
              }
            ],
            "idx": "2",
            "creationDate": "2017-11-16",
            "principal": "12000.0",
            "currency": "egp",
            "stamps": "0.0",
            "applicationFees": "0.0",
            "numInst": "24",
            "periodType": "days",
            "periodLength": "14",
            "gracePeriod": "0",
            "representativeFees": "0.0",
            "representativeName": "امل عطا محمد السقا",
            "penaltiesCanceled": "0.0",
            "penaltiesPaid": "0.0",
            "rejectionReason": "",
            "totalPaid": "15600.0",
            "totalFeesPaid": "3600.0",
            "totalPrincipalPaid": "12000.0",
            "customerBalance": "0.0",
            "earlyDays": "238",
            "lateDays": "0",
            "status": "paid",
            "beneficiaryType": "group"
          },
          {
            "guarantors": [
              {
                "customerName": "0",
                "gender": "0",
                "nationalId": "0",
                "nationalIdIssueDate": "0",
                "homePhoneNumber": "0",
                "homePostalCode": "0",
                "customerHomeAddress": "0",
                "guarantorsIdx": "0"
              }
            ],
            "groupMembers": [
              {
                "key": "110470001563",
                "customerName": "نجوي مصطفي المتولي قاسم",
                "amount": "6000.0",
                "type": "leader"
              },
              {
                "key": "110470003773",
                "customerName": "سميه محمد عبدالغفار عبدالكريم بحيري",
                "amount": "5000.0",
                "type": "member"
              },
              {
                "key": "110470014721",
                "customerName": "عبير جمال محمود السيد قنفد",
                "amount": "3000.0",
                "type": "member"
              }
            ],
            "installments": [
              {
                "idx": "0",
                "dateOfPayment": "2018-12-06 00:00:00",
                "instTotal": "727.0",
                "instFees": "294.0",
                "totalPaid": "727.0",
                "feesPaid": "294.0",
                "status": "paid",
                "paidAt": "2018-11-26 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "1",
                "dateOfPayment": "2018-12-20 00:00:00",
                "instTotal": "727.0",
                "instFees": "285.0",
                "totalPaid": "727.0",
                "feesPaid": "285.0",
                "status": "paid",
                "paidAt": "2018-12-10 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "2",
                "dateOfPayment": "2019-01-03 00:00:00",
                "instTotal": "727.0",
                "instFees": "276.0",
                "totalPaid": "727.0",
                "feesPaid": "276.0",
                "status": "paid",
                "paidAt": "2018-12-24 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "3",
                "dateOfPayment": "2019-01-17 00:00:00",
                "instTotal": "727.0",
                "instFees": "266.0",
                "totalPaid": "727.0",
                "feesPaid": "266.0",
                "status": "paid",
                "paidAt": "2019-01-07 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "4",
                "dateOfPayment": "2019-01-31 00:00:00",
                "instTotal": "727.0",
                "instFees": "257.0",
                "totalPaid": "727.0",
                "feesPaid": "257.0",
                "status": "paid",
                "paidAt": "2019-01-21 00:00:00",
                "delay": "-10"
              },
              {
                "idx": "5",
                "dateOfPayment": "2019-02-14 00:00:00",
                "instTotal": "727.0",
                "instFees": "246.0",
                "totalPaid": "727.0",
                "feesPaid": "246.0",
                "status": "paid",
                "paidAt": "2019-02-05 00:00:00",
                "delay": "-9"
              },
              {
                "idx": "6",
                "dateOfPayment": "2019-02-28 00:00:00",
                "instTotal": "727.0",
                "instFees": "237.0",
                "totalPaid": "727.0",
                "feesPaid": "237.0",
                "status": "paid",
                "paidAt": "2019-02-20 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "7",
                "dateOfPayment": "2019-03-14 00:00:00",
                "instTotal": "727.0",
                "instFees": "226.0",
                "totalPaid": "727.0",
                "feesPaid": "226.0",
                "status": "paid",
                "paidAt": "2019-03-06 00:00:00",
                "delay": "-8"
              },
              {
                "idx": "8",
                "dateOfPayment": "2019-03-28 00:00:00",
                "instTotal": "727.0",
                "instFees": "215.0",
                "totalPaid": "727.0",
                "feesPaid": "215.0",
                "status": "paid",
                "paidAt": "2019-03-24 00:00:00",
                "delay": "-4"
              },
              {
                "idx": "9",
                "dateOfPayment": "2019-04-11 00:00:00",
                "instTotal": "727.0",
                "instFees": "205.0",
                "totalPaid": "727.0",
                "feesPaid": "205.0",
                "status": "paid",
                "paidAt": "2019-04-04 00:00:00",
                "delay": "-7"
              },
              {
                "idx": "10",
                "dateOfPayment": "2019-04-25 00:00:00",
                "instTotal": "727.0",
                "instFees": "195.0",
                "totalPaid": "727.0",
                "feesPaid": "195.0",
                "status": "paid",
                "paidAt": "2019-04-21 00:00:00",
                "delay": "-4"
              },
              {
                "idx": "11",
                "dateOfPayment": "2019-05-09 00:00:00",
                "instTotal": "727.0",
                "instFees": "183.0",
                "totalPaid": "727.0",
                "feesPaid": "183.0",
                "status": "paid",
                "paidAt": "2019-05-07 00:00:00",
                "delay": "-2"
              },
              {
                "idx": "12",
                "dateOfPayment": "2019-05-23 00:00:00",
                "instTotal": "727.0",
                "instFees": "172.0",
                "totalPaid": "727.0",
                "feesPaid": "172.0",
                "status": "paid",
                "paidAt": "2019-05-16 00:00:00",
                "delay": "-7"
              },
              {
                "idx": "13",
                "dateOfPayment": "2019-06-06 00:00:00",
                "instTotal": "727.0",
                "instFees": "159.0",
                "totalPaid": "727.0",
                "feesPaid": "159.0",
                "status": "paid",
                "paidAt": "2019-06-09 00:00:00",
                "delay": "3"
              },
              {
                "idx": "14",
                "dateOfPayment": "2019-06-20 00:00:00",
                "instTotal": "727.0",
                "instFees": "148.0",
                "totalPaid": "727.0",
                "feesPaid": "148.0",
                "status": "paid",
                "paidAt": "2019-06-18 00:00:00",
                "delay": "-2"
              },
              {
                "idx": "15",
                "dateOfPayment": "2019-07-04 00:00:00",
                "instTotal": "727.0",
                "instFees": "136.0",
                "totalPaid": "727.0",
                "feesPaid": "136.0",
                "status": "paid",
                "paidAt": "2019-07-08 00:00:00",
                "delay": "4"
              },
              {
                "idx": "16",
                "dateOfPayment": "2019-07-18 00:00:00",
                "instTotal": "727.0",
                "instFees": "122.0",
                "totalPaid": "727.0",
                "feesPaid": "122.0",
                "status": "paid",
                "paidAt": "2019-07-21 00:00:00",
                "delay": "3"
              },
              {
                "idx": "17",
                "dateOfPayment": "2019-08-01 00:00:00",
                "instTotal": "727.0",
                "instFees": "111.0",
                "totalPaid": "727.0",
                "feesPaid": "111.0",
                "status": "paid",
                "paidAt": "2019-08-08 00:00:00",
                "delay": "7"
              },
              {
                "idx": "18",
                "dateOfPayment": "2019-08-15 00:00:00",
                "instTotal": "727.0",
                "instFees": "97.0",
                "totalPaid": "727.0",
                "feesPaid": "97.0",
                "status": "paid",
                "paidAt": "2019-09-01 00:00:00",
                "delay": "17"
              },
              {
                "idx": "19",
                "dateOfPayment": "2019-08-29 00:00:00",
                "instTotal": "727.0",
                "instFees": "84.0",
                "totalPaid": "727.0",
                "feesPaid": "84.0",
                "status": "paid",
                "paidAt": "2019-09-18 00:00:00",
                "delay": "20"
              },
              {
                "idx": "20",
                "dateOfPayment": "2019-09-12 00:00:00",
                "instTotal": "727.0",
                "instFees": "71.0",
                "totalPaid": "727.0",
                "feesPaid": "71.0",
                "status": "paid",
                "paidAt": "2019-10-22 00:00:00",
                "delay": "40"
              },
              {
                "idx": "21",
                "dateOfPayment": "2019-09-26 00:00:00",
                "instTotal": "727.0",
                "instFees": "57.0",
                "totalPaid": "727.0",
                "feesPaid": "57.0",
                "status": "paid",
                "paidAt": "2019-11-11 00:00:00",
                "delay": "46"
              },
              {
                "idx": "22",
                "dateOfPayment": "2019-10-10 00:00:00",
                "instTotal": "727.0",
                "instFees": "43.0",
                "totalPaid": "727.0",
                "feesPaid": "43.0",
                "status": "paid",
                "paidAt": "2019-11-17 00:00:00",
                "delay": "38"
              },
              {
                "idx": "23",
                "dateOfPayment": "2019-10-24 00:00:00",
                "instTotal": "727.0",
                "instFees": "29.0",
                "totalPaid": "727.0",
                "feesPaid": "29.0",
                "status": "paid",
                "paidAt": "2019-11-17 00:00:00",
                "delay": "24"
              },
              {
                "idx": "24",
                "dateOfPayment": "2019-11-07 00:00:00",
                "instTotal": "727.0",
                "instFees": "61.0",
                "totalPaid": "727.0",
                "feesPaid": "61.0",
                "status": "paid",
                "paidAt": "2019-11-17 00:00:00",
                "delay": "10"
              }
            ],
            "idx": "3",
            "creationDate": "2018-11-22",
            "principal": "14000.0",
            "currency": "egp",
            "stamps": "0.0",
            "applicationFees": "0.0",
            "numInst": "24",
            "periodType": "days",
            "periodLength": "14",
            "gracePeriod": "0",
            "representativeFees": "0.0",
            "representativeName": "امل عطا محمد السقا",
            "penaltiesCanceled": "0.0",
            "penaltiesPaid": "0.0",
            "rejectionReason": "",
            "totalPaid": "18175.0",
            "totalFeesPaid": "4175.0",
            "totalPrincipalPaid": "14000.0",
            "customerBalance": "0.0",
            "earlyDays": "101",
            "lateDays": "212",
            "status": "paid",
            "beneficiaryType": "group"
          },
          {
            "guarantors": [
              {
                "customerName": "0",
                "gender": "0",
                "nationalId": "0",
                "nationalIdIssueDate": "0",
                "homePhoneNumber": "0",
                "homePostalCode": "0",
                "customerHomeAddress": "0",
                "guarantorsIdx": "0"
              }
            ],
            "groupMembers": [
              {
                "key": "110470001563",
                "customerName": "نجوي مصطفي المتولي قاسم",
                "amount": "6000.0",
                "type": "leader"
              },
              {
                "key": "110470003773",
                "customerName": "سميه محمد عبدالغفار عبدالكريم بحيري",
                "amount": "5000.0",
                "type": "member"
              },
              {
                "key": "110470014720",
                "customerName": "مياده سامي حامد الدالي",
                "amount": "3000.0",
                "type": "member"
              },
              {
                "key": "110470014721",
                "customerName": "عبير جمال محمود السيد قنفد",
                "amount": "3000.0",
                "type": "member"
              }
            ],
            "installments": [
              {
                "idx": "0",
                "dateOfPayment": "2018-12-06 00:00:00",
                "instTotal": "883.0",
                "instFees": "357.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17871"
              },
              {
                "idx": "1",
                "dateOfPayment": "2018-12-20 00:00:00",
                "instTotal": "883.0",
                "instFees": "346.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17885"
              },
              {
                "idx": "2",
                "dateOfPayment": "2019-01-03 00:00:00",
                "instTotal": "883.0",
                "instFees": "335.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17899"
              },
              {
                "idx": "3",
                "dateOfPayment": "2019-01-17 00:00:00",
                "instTotal": "883.0",
                "instFees": "323.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17913"
              },
              {
                "idx": "4",
                "dateOfPayment": "2019-01-31 00:00:00",
                "instTotal": "883.0",
                "instFees": "312.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17927"
              },
              {
                "idx": "5",
                "dateOfPayment": "2019-02-14 00:00:00",
                "instTotal": "883.0",
                "instFees": "299.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17941"
              },
              {
                "idx": "6",
                "dateOfPayment": "2019-02-28 00:00:00",
                "instTotal": "883.0",
                "instFees": "288.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17955"
              },
              {
                "idx": "7",
                "dateOfPayment": "2019-03-14 00:00:00",
                "instTotal": "883.0",
                "instFees": "274.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17969"
              },
              {
                "idx": "8",
                "dateOfPayment": "2019-03-28 00:00:00",
                "instTotal": "883.0",
                "instFees": "261.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17983"
              },
              {
                "idx": "9",
                "dateOfPayment": "2019-04-11 00:00:00",
                "instTotal": "883.0",
                "instFees": "249.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-17997"
              },
              {
                "idx": "10",
                "dateOfPayment": "2019-04-25 00:00:00",
                "instTotal": "883.0",
                "instFees": "237.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18011"
              },
              {
                "idx": "11",
                "dateOfPayment": "2019-05-09 00:00:00",
                "instTotal": "883.0",
                "instFees": "222.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18025"
              },
              {
                "idx": "12",
                "dateOfPayment": "2019-05-23 00:00:00",
                "instTotal": "883.0",
                "instFees": "209.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18039"
              },
              {
                "idx": "13",
                "dateOfPayment": "2019-06-06 00:00:00",
                "instTotal": "883.0",
                "instFees": "193.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18053"
              },
              {
                "idx": "14",
                "dateOfPayment": "2019-06-20 00:00:00",
                "instTotal": "883.0",
                "instFees": "180.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18067"
              },
              {
                "idx": "15",
                "dateOfPayment": "2019-07-04 00:00:00",
                "instTotal": "883.0",
                "instFees": "165.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18081"
              },
              {
                "idx": "16",
                "dateOfPayment": "2019-07-18 00:00:00",
                "instTotal": "883.0",
                "instFees": "148.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18095"
              },
              {
                "idx": "17",
                "dateOfPayment": "2019-08-01 00:00:00",
                "instTotal": "883.0",
                "instFees": "135.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18109"
              },
              {
                "idx": "18",
                "dateOfPayment": "2019-08-15 00:00:00",
                "instTotal": "883.0",
                "instFees": "118.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18123"
              },
              {
                "idx": "19",
                "dateOfPayment": "2019-08-29 00:00:00",
                "instTotal": "883.0",
                "instFees": "102.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18137"
              },
              {
                "idx": "20",
                "dateOfPayment": "2019-09-12 00:00:00",
                "instTotal": "883.0",
                "instFees": "86.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18151"
              },
              {
                "idx": "21",
                "dateOfPayment": "2019-09-26 00:00:00",
                "instTotal": "883.0",
                "instFees": "69.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18165"
              },
              {
                "idx": "22",
                "dateOfPayment": "2019-10-10 00:00:00",
                "instTotal": "883.0",
                "instFees": "52.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18179"
              },
              {
                "idx": "23",
                "dateOfPayment": "2019-10-24 00:00:00",
                "instTotal": "883.0",
                "instFees": "35.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18193"
              },
              {
                "idx": "24",
                "dateOfPayment": "2019-11-07 00:00:00",
                "instTotal": "883.0",
                "instFees": "80.0",
                "totalPaid": "0.0",
                "feesPaid": "0.0",
                "status": "unpaid",
                "paidAt": "1970-01-01 00:00:00",
                "delay": "-18207"
              }
            ],
            "idx": "4",
            "creationDate": "2018-11-22",
            "principal": "17000.0",
            "currency": "egp",
            "stamps": "0.0",
            "applicationFees": "0.0",
            "numInst": "24",
            "periodType": "days",
            "periodLength": "14",
            "gracePeriod": "0",
            "representativeFees": "0.0",
            "representativeName": "امل عطا محمد السقا",
            "penaltiesCanceled": "0.0",
            "penaltiesPaid": "0.0",
            "rejectionReason": "5effe403818c7fb99ffe95e7",
            "totalPaid": "0.0",
            "totalFeesPaid": "0.0",
            "totalPrincipalPaid": "0.0",
            "customerBalance": "0.0",
            "earlyDays": "450975",
            "lateDays": "0",
            "status": "canceled",
            "beneficiaryType": "group"
          }
        ],
        "customerName": "نجوي مصطفي المتولي قاسم",
        "officerName": "امل عطا محمد السقا",
        "accountBranch": "دمياط - فارسكور",
        "birthDate": "",
        "nationalId": "26612271100624",
        "nationalIdIssueDate": ""
      }, showModal: false, print: 'customerDetails'
    }, () => window.print())
    // if(res.status === 'success') {
    //   this.setState({data: res.body, print: 'customerDetails'})
    // } else {
    //   this.setState({loading: false});
    //   console.log(res)
    // }
  }

  async getLoanDetails(values) {
    this.setState({loading: true, showModal: false})
    const res = await getLoanDetails(values.key);
    if (res.status === 'success') {
      this.setState({ loading: false, data: res.body, print: 'loanDetails' }, () => window.print())
    } else {
      this.setState({loading: false});
      console.log(res)
    }
  }
  async getBranchLoanList(values) {
    this.setState({loading: true, showModal: false})
    const obj = {
      startdate: values.fromDate,
      enddate: values.toDate,
      branches: values.branches.map((branch) => branch._id)
    }
    this.setState({
      data: {
        "result": [
          {
            "rows": [
              {
                "loanType": "group",
                "branchName": "Total",
                "approvedCount": 0,
                "approvedSum": 0,
                "createdCount": 0,
                "createdSum": 0,
                "issuedCount": 0,
                "issuedSum": 0,
                "reviewedCount": 0,
                "reviewedSum": 0,
                "totalReviewedApprovedCount": 0,
                "totalReviewedApprovedSum": 0,
                "totalCreatedIssuedCount": 0,
                "totalCreatedIssuedSum": 0,
                "totalAllCount": 0,
                "totalAllSum": 0
              },
              {
                "loanType": "group",
                "branchName": "المنيا - ابوقرقاص",
                "approvedCount": 0,
                "approvedSum": 0,
                "createdCount": 0,
                "createdSum": 0,
                "issuedCount": 0,
                "issuedSum": 0,
                "reviewedCount": 0,
                "reviewedSum": 0,
                "totalReviewedApprovedCount": 0,
                "totalReviewedApprovedSum": 0,
                "totalCreatedIssuedCount": 0,
                "totalCreatedIssuedSum": 0,
                "totalAllCount": 0,
                "totalAllSum": 0
              }
            ]
          },
          {
            "rows": [
              {
                "loanType": "individual",
                "branchName": "Total",
                "approvedCount": 0,
                "approvedSum": 0,
                "createdCount": 0,
                "createdSum": 0,
                "issuedCount": 134,
                "issuedSum": 2893000,
                "reviewedCount": 0,
                "reviewedSum": 0,
                "totalReviewedApprovedCount": 0,
                "totalReviewedApprovedSum": 0,
                "totalCreatedIssuedCount": 134,
                "totalCreatedIssuedSum": 2893000,
                "totalAllCount": 134,
                "totalAllSum": 2893000
              },
              {
                "loanType": "individual",
                "branchName": "المنيا - ابوقرقاص",
                "approvedCount": 0,
                "approvedSum": 0,
                "createdCount": 0,
                "createdSum": 0,
                "issuedCount": 134,
                "issuedSum": 2893000,
                "reviewedCount": 0,
                "reviewedSum": 0,
                "totalReviewedApprovedCount": 0,
                "totalReviewedApprovedSum": 0,
                "totalCreatedIssuedCount": 134,
                "totalCreatedIssuedSum": 2893000,
                "totalAllCount": 134,
                "totalAllSum": 2893000
              }
            ]
          },
          {
            "rows": [
              {
                "loanType": "total",
                "branchName": "total",
                "approvedCount": 0,
                "approvedSum": 0,
                "createdCount": 0,
                "createdSum": 0,
                "issuedCount": 134,
                "issuedSum": 2893000,
                "reviewedCount": 0,
                "reviewedSum": 0,
                "totalReviewedApprovedCount": 0,
                "totalReviewedApprovedSum": 0,
                "totalCreatedIssuedCount": 134,
                "totalCreatedIssuedSum": 2893000,
                "totalAllCount": 134,
                "totalAllSum": 2893000
              }
            ]
          }
        ]
      },
      showModal: false,
      print: 'branchLoanList'
    }, () => window.print())
    const res = await getBranchLoanList(obj);
    // if (res.status === 'success') {
    //   this.setState({ print: 'branchLoanList', data: res.body }, () => window.print())
    // }
    // else {
    //   this.setState({loading: false});
    //   console.log(res)
    // }
  }
  render() {
    return (
      <>
        <Card style={{ margin: '20px 50px' }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 0 }}>
            <div className="custom-card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>{local.paymentsReports}</Card.Title>
              </div>
            </div>
            {this.state.pdfsArray?.map((pdf, index) => {
              return (
                <Card key={index}>
                  <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px', fontWeight: 'bold', alignItems: 'center' }}>
                      <div>
                        <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                        <span>{pdf.local}</span>
                      </div>
                      <img style={{ cursor: 'pointer' }} alt="download" data-qc="download" src={require(`../../Assets/green-download.svg`)} onClick={() => this.handlePrint(pdf)} />
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
          </Card.Body>
        </Card>
        {this.state.showModal && <ReportsModal pdf={this.state.selectedPdf} show={this.state.showModal} hideModal={() => this.setState({ showModal: false })} submit={(values) => this.handleSubmit(values)} />}
        {this.state.print === "customerDetails" && <CustomerStatusDetails data={this.state.data} />}
        {this.state.print === "loanDetails" && <LoanApplicationDetails data={this.state.data} />}
        {this.state.print === "branchLoanList" && <BranchesLoanList data={this.state.data} />}
      </>
    )
  }
}

export default Reports;