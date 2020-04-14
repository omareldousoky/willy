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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

// Create Document Component
export const ReviewedApplicationsDocument = (props: any) => {
    function getAge(DOB) {
        const today = new Date();
        const birthDate = new Date(DOB);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        return age;
    }

    const result = (props.pass) ? props.pass : 'no result';
    let total = 0;
    result.forEach(application => total += application.application.principal)
    return (
        <Document>
            {result && <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Reviewed applications export</Text>
                </View>
                <View style={styles.section}>
                    {/* <Text>Installments</Text> */}
                    <View>
                        <View style={styles.row}>
                            {/* <Text style={{ width: '10%' }}>code</Text> */}
                            <Text style={{ width: '20%' }}>name</Text>
                            <Text style={{ width: '10%' }}>age</Text>
                            {/* <Text style={{ width: '10%' }}>bussiness activity</Text> */}
                            <Text style={{ width: '30%' }}>national id</Text>
                            <Text style={{ width: '20%' }}>principal</Text>
                            <Text style={{ width: '20%' }}>installments</Text>
                        </View>
                        {result && result.map((application, i) => {
                            return (
                                <View key={i} style={styles.row}>
                                    {/* <Text style={{ width: '10%' }}>{application.Id}</Text> */}
                                    <Text style={{ width: '20%' }}>{application.Application.customer.customerInfo.customerName}</Text>
                                    <Text style={{ width: '10%' }}>{getAge(application.Application.customer.customerInfo.birthDate)}</Text>
                                    {/* <Text style={{ width: '10%' }}>{application.Application.customer.customerInfo.gender}</Text> */}
                                    <Text style={{ width: '30%' }}>{application.Application.customer.customerInfo.nationalId}</Text>
                                    <Text style={{ width: '20%' }}>{application.Application.principal}</Text>
                                    <Text style={{ width: '20%' }}>{application.Application.product.noOfInstallments}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={{ width: '50%' }}>Total amount in EGP</Text>
                        <Text style={{ width: '50%' }}>{total}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={{ width: '30%' }}>Revisor:</Text>
                        <Text style={{ width: '30%' }}>Branch Manager:</Text>
                        <Text style={{ width: '30%' }}>Area Manager:</Text>
                    </View>
                </View>
            </Page>}
        </Document>
    )
};