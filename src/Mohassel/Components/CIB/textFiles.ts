const getYearMonthDay = (dateTimeStamp: number) => {
    let date = new Date();
    if (dateTimeStamp) {
        date = new Date(dateTimeStamp)
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() + 1 < 10 ? date.getDate() : `0${date.getDate()}`;
    return `${year}${month}${day}`
}
const getGender = (gender: string) => {
    if(gender === "male") return 'M';
    else return 'F';
}

const getTotalNumberOfLines = (textData) => {
    let total = 0;
    textData.forEach(application => {
        total = total + application.installmentsObject.output.length;
    });
    return total;
}

const cusTxt = (textData) => {
    return (`H|${getYearMonthDay(0)}|${textData.length}|TDIS_CUS|\n` +
    textData.map(application => {
        return (
            `${getYearMonthDay(application.customer.created.at)}|   ${application.customer.key}|N|D|${application.customer.customerName}|SINGLE|${getGender(application.customer.gender)}|${getYearMonthDay(application.customer.birthDate)}|${application.customer.nationalId}|NATIONAL ID| EG| |${application.customer.customerHomeAddress}|${getYearMonthDay(application.created.at)}|990|1| M5| 097|199|2|516|4100|           ||EG|||${application.customer.customerName}             |${application.customer.customerHomeAddress}        |29|15|9|1|5|1|other||\n`
        )
    })).replace(",","")
}

const finText = (textData) => {
    return (`H|${getYearMonthDay(0)}||${textData.length}|TDIS_FIN\n` +
    textData.map(application => {
        return (
            `D|${application.customer.key}          |N|${getYearMonthDay(0)}|${application.principal}|${application.product.currency.toUpperCase()}|D|0||SE3R EL FAYDA BETA3T EL KARD|${getYearMonthDay(application.installmentsObject.output[application.installmentsObject.output.length - 1].dateOfPayment)}|${application.installmentsObject.output.length}|${application.installmentsObject.output[0].principalInstallment}|${application.installmentsObject.output[0].feesInstallment}|M|${getYearMonthDay(application.installmentsObject.output[0].dateOfPayment)}|${application.loanApplicationKey? application.loanApplicationKey : application.applicationKey}|      T102|\n`
        )
    })).replace(",","")
}

const instText = (textData) => {
    return (`H|${getYearMonthDay(0)}||${getTotalNumberOfLines(textData)}|TDIS_INST\n` +
    textData.map(application =>{
        application.installmentsObject.output.map(installment => {
            return (
                `D|${application.loanApplicationKey? application.loanApplicationKey : application.applicationKey}|      ${installment.id}|${application.installmentsObject.output.length}|${getYearMonthDay(installment.dateOfPayment)}|${installment.principalInstallment}|${installment.feesInstallment}|${installment.installmentResponse}|\n`
            )
        })
    })).replace(",","")
}

const payText = (textData) => {
    return (`H|${getYearMonthDay(0)}||${getTotalNumberOfLines(textData)}|TDIS_INST\n` +
    textData.map(application =>{
        
    })).replace(",","")
}

export const downloadTxtFile = (textData) => {
    console.log(textData)
    const element = document.createElement("a");
    const file = new Blob([instText(textData)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "download.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

