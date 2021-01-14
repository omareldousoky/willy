import React, { Component } from "react";
import "./commissaryDueInstallmentsClientCard.scss";

const numbersToArabic = (input) => {
  if (input || input === 0) {
    const id = ["۰", "۱", "۲", "۳", "٤", "۵", "٦", "۷", "۸", "۹"];
    const inputStr = input.toString();
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number];
    });
  } else return "";
};
export default class CommissaryDueInstallmentsClientCard extends Component {
  renderHeader = () => {
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "darkgrey",
              border: "1px solid black",
              width: "50%",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            {"شركة تساهيل"}
          </div>
          <div
            style={{
              border: "1px solid black",
              width: "50%",
              textAlign: "center",
            }}
          >
            {"أسوان - ادفو"}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{"قائمة الإقساط المستحقة بالمندوب"}</p>
          <p style={{ margin: 0 }}>
            <span>{"من "}</span>
            <span>{"Date1 "}</span>
            <span>{"إلى "}</span>
            <span>{"Date2"}</span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{"1/1"}</p>
          <p style={{ margin: 0 }}>{"Today's Date"}</p>
        </div>
      </div>
    );
  };
  renderBranchNameDiv = (branchName = "") => (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0 }}>{"الفرع :"}</p>
          <div
            style={{
              backgroundColor: "darkgrey",
              border: "1px solid black",
              minWidth: 240,
              textAlign: "right",
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{"أسوان - ادفو"}</span>
            {/* <span>{branchName}</span> */}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
  renderCommissaryDetailsDiv = (CommissaryName = "") => (
    <div style={{ display: "flex", margin: "5px 0" }}>
      <div style={{ width: "60%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ margin: 0, marginRight: "15%" }}>{"أسم المندوب :"}</p>
          <div
            style={{
              backgroundColor: "darkgrey",
              border: "1px solid black",
              minWidth: 320,
              textAlign: "right",
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{"علياء عبده أحمد حسين"}</span>
            {/* <span>{CommissaryName}</span> */}
          </div>
          <div
            style={{
              border: "1px solid black",
              minWidth: 160,
              textAlign: "left",
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{"132124123"}</span>
          </div>
        </div>
      </div>
      <div style={{ width: "40%" }} />
    </div>
  );
  renderSummary = (type, name, count, amount) => {
    return (
      <div style={{ margin: "2px 0" }}>
        <div className="lineStroke" />
        <div style={{ display: "flex", margin: "4px 0" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <span style={{ marginLeft: 4 }}>{"إجمالي : "}</span>
            <span style={{ marginLeft: 4, minWidth: 90 }}>
              {type === "Commissary" ? "أسم المندوب : " : "الفرع : "}
            </span>
            <div
              style={{
                backgroundColor: "darkgrey",
                border: "1px solid black",
                minWidth: 320,
                textAlign: "right",
                paddingRight: 2,
                marginLeft: 4,
              }}
            >
              <span>{name}</span>
            </div>
            <div
              style={{
                border: "1px solid black",
                textAlign: "center",
                minWidth: 80,
                marginLeft: 4,
              }}
            >
              {count}
            </div>
            <div
              style={{
                border: "1px solid black",
                textAlign: "center",
                minWidth: 80,
              }}
            >
              {amount}
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>
        <div className="lineStroke" />
      </div>
    );
  };
  renderCommissaryData = () => {
    return (
      <div className="CommissaryDiv">
        {this.renderCommissaryDetailsDiv()}
        {this.renderTable()}
        {this.renderSummary("Commissary", "علياء عبده أحمد حسين", 50, 1500)}
      </div>
    );
  };

  renderBranchData = () => {
    return (
      <div className="branchDiv">
        {this.renderBranchNameDiv()}
        {this.renderCommissaryData()}
        {this.renderSummary("Branch", "أسوان - ادفو", 80, 2502323)}
      </div>
    );
  };
  renderData = () => {
    return (
      <div className="commissaryDueInstallmentsClientCard" dir="rtl" lang="ar">
        {this.renderHeader()}
        {this.renderBranchData()}
      </div>
    );
  };
  renderTable = () => {
    let data = [
      {
        clientName: "hamada",
        installmentNumber: 123,
        dueDate: 873498,
        lastPaymentDate: 9373737,
        lastInstallmentDate: 4357547,
        installmentStatus: "غير مسدد",
        installmentAmount: 120,
        dueAmount: 680,
        phoneNumber: "0233771332",
        businessNumber: "01273150005",
        creditSumAmount: { credit: 5434, sum: 12, amount: 0 },
        address: "alharam",
        businessDistrict: "Giza",
      },
      {
        clientName: "hamadaaaa222",
        installmentNumber: 123,
        dueDate: 873498,
        lastPaymentDate: 9373737,
        lastInstallmentDate: 4357547,
        installmentStatus: "غير مسدد",
        installmentAmount: 120,
        dueAmount: 680,
        phoneNumber: "0233771332",
        businessNumber: "01273150005",
        creditSumAmount: { credit: 5434, sum: 12, amount: 0 },
        address: "alharam",
        businessDistrict: "Giza",
      },
      {
        clientName: "hamadaaaaaaa333",
        installmentNumber: 123,
        dueDate: 873498,
        lastPaymentDate: 9373737,
        lastInstallmentDate: 4357547,
        installmentStatus: "غير مسدد",
        installmentAmount: 120,
        dueAmount: 680,
        phoneNumber: "0233771332",
        businessNumber: "01273150005",
        creditSumAmount: { credit: 5434, sum: 12, amount: 0 },
        address: "alharam",
        businessDistrict: "Giza",
      },
    ];
    return (
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>{"أسم العميل"}</th>
            <th>{"رقم القسط"}</th>
            <th>{"ت الإستحقاق"}</th>
            <th>{"ت أخر سداد"}</th>
            <th>{"ت أخر قسط"}</th>
            <th>{"حالة القسط"}</th>
            <th>{"قيمة القسط"}</th>
            <th>{"المستحق"}</th>
            <th>{"ت المنزل"}</th>
            <th>{"ت العمل"}</th>
            <th>{"رصيد مبلغ/عدد"}</th>
            <th>{"العنوان"}</th>
            <th>{"منطقة العمل"}</th>
          </tr>
        </thead>
        {this.renderTableBody(data)}
      </table>
    );
  };
  renderTableBody = (array) => {
    return (
      <tbody>
        {array.map((el, idx) => {
          return (
            <tr key={idx}>
              <td>{"ف"}</td>
              <td>{idx + 1}</td>
              <td>{el.clientName}</td>
              <td>{el.installmentNumber}</td>
              <td>{el.dueDate}</td>
              <td>{el.lastPaymentDate}</td>
              <td>{el.lastInstallmentDate}</td>
              <td>{el.installmentStatus}</td>
              <td>{numbersToArabic(el.installmentAmount)}</td>
              <td>{el.dueAmount}</td>
              <td>{numbersToArabic(el.phoneNumber)}</td>
              <td>{numbersToArabic(el.businessNumber)}</td>
              <td>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <span>{el.creditSumAmount.credit}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      flex: 1,
                    }}
                  >
                    <span style={{ backgroundColor: "darkgrey" }}>
                      {el.creditSumAmount.sum}
                    </span>
                    <span style={{ backgroundColor: "darkgrey" }}>
                      {el.creditSumAmount.amount}
                    </span>
                  </div>
                </div>
              </td>
              <td>{el.address}</td>
              <td>{el.businessDistrict}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };
  render() {
    return this.renderData();
  }
}