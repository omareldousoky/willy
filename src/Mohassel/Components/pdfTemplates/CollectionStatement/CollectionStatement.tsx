import React from "react";
import "./CollectionStatement.scss";
import { timeToArabicDate } from "../../../../Shared/Services/utils";
import Table from "react-bootstrap/Table";

const CollectionStatement = (props) => {
  const branches = props.data.data.branches;
  const total = props.data.data.total;
  const startDate = timeToArabicDate(props.data.startDate, false);
  const endDate = timeToArabicDate(props.data.endDate, false);

  const trimmedValue = (value: string) => {
    if (value.includes(".")) {
      const splitted = value.split(".", 2);
      splitted[1] = splitted[1].substring(0, 2);
      return splitted.join(".");
    } else {
      return value;
    }
  };

  const BranchComponent = ({ branch }) => {
    return (
      <>
        <tr>
          <th style={{ fontSize: 16 }}>{branch.branchCode}</th>
          <th style={{ fontSize: 16 }}>{branch.branchName}</th>
        </tr>
        <tr>
          <th>التاريخ</th>
          <th>رسوم</th>
          <th>أقساط _ أصل</th>
          <th>أقساط _ فائده</th>
          <th>أقساط _ إجمالي</th>
          <th>الغرامات</th>
          <th>ايرادات اخري</th>
          <th>إجمالي عام</th>
        </tr>
        {branch.rows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.truthDate.substring(0, 10)}</td>
            <td>{trimmedValue(row.fees)}</td>
            <td>{trimmedValue(row.installmentsPrincipal)}</td>
            <td>{trimmedValue(row.installmentsInterest)}</td>
            <td>{trimmedValue(row.installmentsTotal)}</td>
            <td>{trimmedValue(row.penalties)}</td>
            <td>{trimmedValue(row.otherIncome)}</td>
            <td>{trimmedValue(row.totalCollected)}</td>
          </tr>
        ))}
        <tr>
          <td>{branch.branchName}</td>
          <td>{trimmedValue(branch.fees)}</td>
          <td>{trimmedValue(branch.installmentsPrincipal)}</td>
          <td>{trimmedValue(branch.installmentsInterest)}</td>
          <td>{trimmedValue(branch.installmentsTotal)}</td>
          <td>{trimmedValue(branch.penalties)}</td>
          <td>{trimmedValue(branch.otherIncome)}</td>
          <td>{trimmedValue(branch.totalCollected)}</td>
        </tr>
      </>
    );
  };

  return (
    <div className="CollectionStatement">
      <table style={{ fontSize: "12px", margin: "10px 0px", textAlign: "center", width: '100%' }}>
        <tr style={{ height: "10px" }}></tr>
        <tr><th colSpan={1} style = {{backgroundColor:'white'}}><img style={{ width: "70px", height: "35px" }} src={require('../../../../Shared/Assets/Logo.svg')} /></th><th colSpan={6} style = {{backgroundColor:'white'}}>ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015</th></tr>
        <tr style={{ height: "10px" }}></tr>
      </table>
      <table style={{ width: "100%" }}>
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={2}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={5}>
              حركات السداد باليوم عن الفتره من {startDate} الي {endDate}
            </th>
          </tr>
        </thead>
      </table>
      <Table style={{ width: "100%" }} striped bordered hover>
        <tbody>
          {branches.map((branch, idx) => (
            <BranchComponent key={idx} branch={branch} />
          ))}
          <tr style={{ fontSize: 16 }}>
            <td>{"إجمالى عام"}</td>
            <td>{trimmedValue(total.fees)}</td>
            <td>{trimmedValue(total.installmentsPrincipal)}</td>
            <td>{trimmedValue(total.installmentsInterest)}</td>
            <td>{trimmedValue(total.installmentsTotal)}</td>
            <td>{trimmedValue(total.penalties)}</td>
            <td>{trimmedValue(total.otherIncome)}</td>
            <td>{trimmedValue(total.totalCollected)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default CollectionStatement;
