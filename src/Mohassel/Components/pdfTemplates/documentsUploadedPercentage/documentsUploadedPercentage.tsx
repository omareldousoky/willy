import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './documentsUploadedPercentage.scss';

const DocumentsUploadedPercentage = (props) => {
    const bigArr: any = [];
    for (let index = 0; index < 200; index++) {
        bigArr.push({ name: 'cairo-shobra', number1: 25, number2: 25, percentage: '100%' })
    }
    const parentArr: any = [];
    const splitNUmber = 50;
    let start = 0;
    while (start < bigArr.length) {
        parentArr.push(bigArr.slice(start, start + splitNUmber));
        start = start + 50;
    }
    return (
            <div className="documents-uploaded-percentage" lang="ar">
            <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
                <tr style={{ height: "10px" }}></tr>
                <tr style={{width:'100%',display:'flex',flexDirection:'row' , justifyContent:'space-between'}}><th colSpan={6}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
                <tr style={{ height: "10px" }}></tr>
            </table>
                <Row>
                    {parentArr.map((arr, index) => {
                        return (
                            <Col key={index} sm={6}>
                                <table key={index}>
                                    <thead>
                                        <tr>
                                            <th className="frame" colSpan={100}>نسب المسح الضوئى عن الفترة من 26-6-2020 2 الي 25-6-2020</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arr.map((el, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="frame" colSpan={1}>{(key + 1) + (index * 50)}</td>
                                                    <td className="frame" colSpan={4}>{el.name}</td>
                                                    <td className="frame" colSpan={4}>{el.number1}</td>
                                                    <td className="frame" colSpan={4}>{el.number2}</td>
                                                    <td className="frame yellow" colSpan={4}>{el.percentage}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </Col>
                        )
                    })}
                </Row>
            </div>
    )
}

export default DocumentsUploadedPercentage;