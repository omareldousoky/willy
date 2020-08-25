import React from "react";
import "./CollectionStatement.scss";
import { timeToDateyyymmdd } from "../../../Services/utils";

const CollectionStatement = (props) => {
  const branches = props.data.data.branches;
  const total = props.data.data.total;
  const startDate = timeToDateyyymmdd(props.data.startDate);
  const endDate = timeToDateyyymmdd(props.data.endDate);

  const trimmedValue = (string) => {
    const splitted = string.split(".", 2);
    splitted[1] = splitted[1].substring(0, 2);
    return splitted.join("");
  };

  const BranchComponent = ({ branch }) => {
    return (
      <>
        <tr>
          <th>{branch.branchCode}</th>
          <th>{branch.branchName}</th>
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
      <table style={{ width: "100%" }}>
        <tbody>
          {branches.map((branch, idx) => (
            <BranchComponent key={idx} branch={branch} />
          ))}
          <tr>
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
      </table>
    </div>
  );
};

export default CollectionStatement;
