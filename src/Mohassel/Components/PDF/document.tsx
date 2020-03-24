import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    flexDirection: 'column'

  },
  box: {
    flexDirection: 'row',
    fontSize: 5
  },
  row:{
    flexDirection:'row',
    justifyContent: 'space-between'
  }
});

// Create Document Component
export const MyDocument = (props: any) => {
  const result = (props.pass) ? props.pass.result : 'no result';
  return (
    <Document>
      {result.sum && <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{(props.pass)?props.pass.formulaName:''}`s Test </Text>
        </View>
        <View style={styles.section}>
          <Text>Sum</Text>
          <View style={styles.row}>
            <Text>Installment Sum</Text>
            <Text>{result.sum.installmentSum}</Text>
          </View>
          <View style={styles.row}>
            <Text>Principal</Text>
            <Text>{result.sum.principal}</Text>
          </View>
          <View style={styles.row}>
            <Text>Fees Sum</Text>
            <Text>{result.sum.feesSum}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text>Installments</Text>
          <View>
          <View style={styles.row}>
                <Text style={{width:'10%'}}>id</Text>
                <Text style={{width:'20%'}}>installment</Text>
                <Text style={{width:'20%'}}>principal</Text>
                <Text style={{width:'20%'}}>fees</Text>
                <Text style={{width:'30%'}}>Payment Date</Text>
              </View>
          {result.output && result.output.map((installment, i) => {
            return (
              <View key={i} style={styles.row}>
                <Text style={{width:'10%'}}>{installment.id}</Text>
                <Text style={{width:'20%'}}>{installment.installmentResponse.toFixed(2)}</Text>
                <Text style={{width:'20%'}}>{installment.principalInstallment.toFixed(2)}</Text>
                <Text style={{width:'20%'}}>{installment.feesInstallment.toFixed(2)}</Text>
                <Text style={{width:'30%'}}>{new Date(installment.dateOfPayment).getDate()}-{new Date(installment.dateOfPayment).getMonth()+1}-{new Date(installment.dateOfPayment).getFullYear()}</Text>
              </View>
            )
          })}
          </View>
        </View>
      </Page>}
    </Document>
  )
};