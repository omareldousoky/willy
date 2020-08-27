interface TextReport {
    name: string;
    func: (data) => string;
}
const getYearMonthDay = (dateTimeStamp: number) => {
    let date = new Date();
    if (dateTimeStamp) {
        date = new Date(dateTimeStamp)
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() + 1 < 10 ? `0${date.getDate()}` : date.getDate();
    return `${year}${month}${day}`
}
const getGender = (gender: string) => {
    if (gender === "male") return 'M';
    else return 'F';
}

const getTotalNumberOfLines = (textData) => {
    let total = 0;
    textData.forEach(application => {
        total = total + application.installmentsObject.output.length;
    });
    return total;
}
const getTotalPrincipals = (textData) => {
    let total = 0;
    textData.forEach(application => {
        if (application.principal)
            total = total + Number(application.principal);
    });
    return total;
}

const getBeneficiaryType = (type: string) => {
    if (type === "group") return 'T101';
    else return 'T102'
}

const numTo2Decimal = (num: number | string) => {
    if(typeof num === 'string') num = Number(num);
    return (Math.round(num * 100) / 100).toFixed(2);
}

const cusTxt = (textData) => {
    return (`H|${getYearMonthDay(0)}|${textData.length}|TDIS_CUS|\n` +
        textData.map(application => {
            return (
                `${getYearMonthDay(application.customer.created.at)}|${application.customer.key}    |N|D|${application.customer.customerName}|SINGLE|${getGender(application.customer.gender)}|${getYearMonthDay(application.customer.birthDate)}|${application.customer.nationalId}|National ID|EG||${application.customer.customerHomeAddress}|${getYearMonthDay(application.created.at)}|990|1| M5| 097|199|2|516|4100|||EG|||${application.customer.customerName}|${application.customer.customerHomeAddress}|29|15|9|1|5|1|other||\n`
            )
        })).split(',').join('')
}

const finText = (textData) => {
    return (`H|${getYearMonthDay(0)}|${getTotalPrincipals(textData)}|${textData.length}|TDIS_FIN|\n` +
        textData.map(application => {
            return (
                `D|${application.customer.key}          |N|${getYearMonthDay(application.issueDate)}|${application.principal ? numTo2Decimal(application.principal) : numTo2Decimal(0)}|${application.product.currency.toUpperCase()}|D|0||${application.product.interest ? (application.product.interest + ".0000000") : '0.0000000'}|${getYearMonthDay(application.installmentsObject.output[application.installmentsObject.output.length - 1].dateOfPayment)}|${application.installmentsObject.output.length}|${application.installmentsObject.output[0].principalInstallment ? numTo2Decimal(application.installmentsObject.output[0].principalInstallment) : numTo2Decimal(0)}|${application.installmentsObject.output[0].feesInstallment ? numTo2Decimal(application.installmentsObject.output[0].feesInstallment) : numTo2Decimal(0)}|M|${getYearMonthDay(application.installmentsObject.output[0].dateOfPayment)}|${application.loanApplicationKey}      |${getBeneficiaryType(application.product.beneficiaryType)}|\n`
            )
        })).split(',').join('')
}

const instText = (textData) => {
    return (`H|${getYearMonthDay(0)}||${getTotalNumberOfLines(textData)}|TDIS_INST|\n` +
        textData.map(application => {
            return application.installmentsObject.output.map(installment => {
                return (
                    `D|${application.loanApplicationKey}      |${installment.id}|${application.installmentsObject.output.length}|${getYearMonthDay(installment.dateOfPayment)}|${installment.principalInstallment ? numTo2Decimal(installment.principalInstallment) : numTo2Decimal(0)}|${installment.feesInstallment ? numTo2Decimal(installment.feesInstallment) : numTo2Decimal(0)}|${installment.installmentResponse ? numTo2Decimal(installment.installmentResponse) : numTo2Decimal(0)}|\n`
                )
            })
        })).split(',').join('')
}

const payText = (textData) => {
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalNoOfInstallments = 0;
    textData.forEach(application => {
        application.installmentsObject.output.forEach(installment => {
            if (installment.status === "paid") {
                totalNoOfInstallments += 1;
                totalPrincipal += (installment.principalInstallment? Number(installment.principalInstallment) : 0);
                totalInterest += (installment.feesInstallment? Number(installment.feesInstallment) : 0);
            }
        })
    });
    return (`H|${getYearMonthDay(0)}|${numTo2Decimal(totalPrincipal)}|${numTo2Decimal(totalInterest)}|${totalNoOfInstallments*3}|TPAY|\n` +
        textData.map(application => {
            let final = '';
            application.installmentsObject.output.map(installment => {
                if (installment.status === "paid") {
                    final = final + `D|${application.customer.key}      |I|${getYearMonthDay(application.issueDate)}|${installment.principalInstallment ? numTo2Decimal(installment.principalInstallment) : numTo2Decimal(0)}|EGP|C|0||||${installment.id}||||${getYearMonthDay(application.installmentsObject.output[0].dateOfPayment)}|${application.loanApplicationKey}    |${getBeneficiaryType(application.product.beneficiaryType)}|\n`
                }
            })
            application.installmentsObject.output.map(installment => {
                if (installment.status === "paid") {
                    final = final + `D|${application.customer.key}      |T|${getYearMonthDay(application.issueDate)}|${installment.feesInstallment ? numTo2Decimal((Number(installment.feesInstallment) * 0.40)) : numTo2Decimal(0)}|EGP|C|0||||${installment.id}||||${getYearMonthDay(application.installmentsObject.output[0].dateOfPayment)}|${application.loanApplicationKey}    |${getBeneficiaryType(application.product.beneficiaryType)}|\n`
                }
            })
            application.installmentsObject.output.map(installment => {
                if (installment.status === "paid") {
                    final = final + `D|${application.customer.key}      |R|${getYearMonthDay(application.issueDate)}|${installment.feesInstallment ? numTo2Decimal((Number(installment.feesInstallment) * 0.60)) : numTo2Decimal(0)}|EGP|C|0||||${installment.id}||||${getYearMonthDay(application.installmentsObject.output[0].dateOfPayment)}|${application.loanApplicationKey}    |${getBeneficiaryType(application.product.beneficiaryType)}|\n`
                }
            })
            return final;
        })).split(',').join('')
}

const trfText = (textData) => {
    const branchData = {};
    let total = 0;
    textData.forEach(application => {
        if (branchData[application.branchId]) {
            branchData[application.branchId] = branchData[application.branchId] + (application.principal ? Number(application.principal) : 0);
        } else branchData[application.branchId] = application.principal ? Number(application.principal) : 0;
        total = total + (application.principal ? Number(application.principal) : 0);
    });
    return (`H|${getYearMonthDay(0)}|${numTo2Decimal(total)}|${Object.keys(branchData).length}|TDIS_TRF|\n` +
        Object.keys(branchData).map(branch => {
            return `D|100005743642      |100005143076     |EGP|${numTo2Decimal(branchData[branch])}|${getYearMonthDay(0)}|0.00|\n`
        }) + 
        `T|${getYearMonthDay(0)}|${numTo2Decimal(total)}|${Object.keys(branchData).length}|TDIS_TRF|\n`
    )
}


export const downloadTxtFile = (textData) => {
    const filesArr: Array<TextReport> = [
        { name: 'TDIS_CUS', func: (textData) => cusTxt(textData) },
        { name: 'TDIS_FIN', func: (textData) => finText(textData) },
        { name: 'TDIS_INST', func: (textData) => instText(textData) },
        { name: 'TPAY', func: (textData) => payText(textData) },
        // { name: 'TDIS_TRF', func: (textData) => trfText(textData) }
    ];
    filesArr.forEach(item => {
        const element = document.createElement("a");
        const file = new Blob([item.func(textData)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${item.name}${getYearMonthDay(0)}`;
        document.body.appendChild(element);
        element.click();
    })
}