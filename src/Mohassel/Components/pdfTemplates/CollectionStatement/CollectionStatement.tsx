import React from "react";
import "./CollectionStatement.scss";

const CollectionStatement = (props) => {
  console.log("props", props);
  const branches = props.data.data.branches;
  const total = props.data.data.total;
  const startDate = props.data.startDate;
  const endDate = props.data.endDate;

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
            <td>{row.fees}</td>
            <td>{row.installmentsPrincipal}</td>
            <td>{row.installmentsInterest}</td>
            <td>{row.installmentsTotal}</td>
            <td>{row.penalties}</td>
            <td>{row.otherIncome}</td>
            <td>{row.totalCollected}</td>
          </tr>
        ))}
        <tr>
          <td>{branch.branchName}</td>
          <td>{branch.fees}</td>
          <td>{branch.installmentsPrincipal}</td>
          <td>{branch.installmentsInterest}</td>
          <td>{branch.installmentsTotal}</td>
          <td>{branch.penalties}</td>
          <td>{branch.otherIncome}</td>
          <td>{branch.totalCollected}</td>
        </tr>
      </>
    );
  };

  return (
    <div className="CollectionStatement">
      <table>
        <thead className="report-header">
          <tr className="headtitle">
            <th colSpan={2}>شركة تساهيل للتمويل متناهي الصغر</th>
            <th colSpan={5}>
              حركات السداد باليوم عن الفتره من {startDate} الي {endDate}
            </th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch, idx) => (
            <BranchComponent key={idx} branch={branch} />
          ))}
          <tr>
            <td>{'إجمالى عام'}</td>
            <td>{total.fees}</td>
            <td>{total.installmentsPrincipal}</td>
            <td>{total.installmentsInterest}</td>
            <td>{total.installmentsTotal}</td>
            <td>{total.penalties}</td>
            <td>{total.otherIncome}</td>
            <td>{total.totalCollected}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CollectionStatement;
