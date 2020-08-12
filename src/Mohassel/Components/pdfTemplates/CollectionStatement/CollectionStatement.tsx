import React from "react";
import "./CollectionStatement.scss";

const CollectionStatement = (props) => {
  console.log("props", props);
  const data = props.data.data;
  const startDate = props.data.startDate;
  const endDate = props.data.endDate;
  const trimmedValue = (string) => {
    const splitted = string.split(".", 2);
    splitted[1] = splitted[1].substring(0, 2);
    return splitted.join("");
  };
  return (
    <div className="CollectionStatement">
      <table>
        <thead className="report-header">
          <tr className="headtitle">
            <th>شركة تساهيل للتمويل متناهي الصغر</th>
            <th>
              {`   حركات السداد باليوم عن الفتره من ${startDate} الي ${endDate}`}
            </th>
          </tr>
        </thead>
      </table>
      <table>
        <thead className="report-header">
          <tr>
            <th className="styled">التاريخ</th>
            <th className="styled">كود الفرع</th>
            <th className="styled">إسم الفرع</th>
            <th className="styled">رسوم</th>
            <th className="styled">أقساط _ أصل</th>
            <th className="styled">أقساط _ فائده</th>
            <th className="styled">أقساط _ إجمالي</th>
            <th className="styled">الغرامات</th>
            <th className="styled">ايرادات اخري</th>
            <th className="styled">إجمالي عام</th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <th>التاريخ</th>
            <th>كود الفرع</th>
            <th>إسم الفرع</th>
            <th>رسوم</th>
            <th>أقساط _ أصل</th>
            <th>أقساط _ فائده</th>
            <th>أقساط _ إجمالي</th>
            <th>الغرامات</th>
            <th>ايرادات اخري</th>
            <th>إجمالي عام</th>
          </tr> */}
          {data.map((element, idx) => (
            <tr key={idx}>
              <td>{element.truthDate.substring(0, 10)}</td>
              <td>{element.branchCode}</td>
              <td>{element.branchName}</td>
              <td>{trimmedValue(element.fees)}</td>
              <td>{trimmedValue(element.installmentsPrincipal)}</td>
              <td>{trimmedValue(element.installmentsInterest)}</td>
              <td>{trimmedValue(element.installmentsTotal)}</td>
              <td>{trimmedValue(element.penalties)}</td>
              <td>{trimmedValue(element.otherIncome)}</td>
              <td>{trimmedValue(element.totalCollected)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionStatement;
