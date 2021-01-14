import React, { Component, Fragment } from "react";
import "./installmentsDuePerOfficerCustomerCard.scss";

const numbersToArabic = (input) => {
  if (input || input === 0) {
    const id = ["۰", "۱", "۲", "۳", "٤", "۵", "٦", "۷", "۸", "۹"];
    const inputStr = input.toString();
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number];
    });
  } else return "";
};
interface InstallmentsDuePerOfficerCustomerCardProps {
  fromDate: string;
  toDate: string;
  data: any;
}

const InstallmentsDuePerOfficerCustomerCard = (
  props: InstallmentsDuePerOfficerCustomerCardProps
) => {
  const renderHeader = (fromDate, toDate) => {
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
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{"قائمة الإقساط المستحقة بالمندوب"}</p>
          <p style={{ margin: 0 }}>
            <span>{"من "}</span>
            <span>{fromDate}</span>
            <span>{"إلى "}</span>
            <span>{toDate}</span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{"1/1"}</p>
          <p style={{ margin: 0 }}>{new Date().toDateString()}</p>
        </div>
      </div>
    );
  };
  const renderBranchNameDiv = (branchName = "") => (
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
            <span>{branchName}</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
  const renderCommissaryDetailsDiv = (CommissaryName = "") => (
    <div style={{ display: "flex", margin: "5px 0" }}>
      <div style={{ width: "60%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ margin: 0, marginRight: "15%", minWidth: 90 }}>
            {"أسم المندوب :"}
          </p>
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
            <span>{CommissaryName}</span>
          </div>
          {/* <div
            style={{
              border: "1px solid black",
              minWidth: 160,
              textAlign: "left",
              paddingRight: 5,
              marginRight: 2,
            }}
          >
            <span>{"132124123"}</span>
          </div> */}
        </div>
      </div>
      <div style={{ width: "40%" }} />
    </div>
  );
  const renderSummary = (type, name = null, count, amount) => {
    return (
      <div style={{ margin: "2px 0" }}>
        <div className="lineStroke" />
        <div style={{ display: "flex", margin: "4px 0" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            {type === "Total" ? (
              <span style={{ marginLeft: 4, minWidth: 130 }}>
                {"الإجمالي العام : "}
              </span>
            ) : (
              <Fragment>
                <span style={{ marginLeft: 4, minWidth: 60 }}>
                  {"إجمالي : "}
                </span>
                <span style={{ marginLeft: 4, minWidth: 90 }}>
                  {type === "Commissary" ? "أسم المندوب : " : "الفرع : "}
                </span>
              </Fragment>
            )}

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
  const renderTableBody = (array) => {
    return (
      <tbody>
        {array.map((el, idx) => {
          return (
            <tr key={idx}>
              <td>{"ف"}</td>
              <td>{idx + 1}</td>
              <td>{el.customerName}</td>
              <td>{el.installmentNumber}</td>
              <td>{el.dateOfPayment}</td>
              <td>{el.lastPaymentDate}</td>
              <td>{el.lastInstallmentDate}</td>
              <td>{el.installmentStatus}</td>
              <td>{numbersToArabic(el.installmentAmount)}</td>
              <td>{el.amountDue}</td>
              <td>{numbersToArabic(el.phoneNumber)}</td>
              <td>{numbersToArabic(el.businessNumber)}</td>
              <td>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <span>{el.credit}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "darkgrey",
                        minWidth: 30,
                        marginLeft: 4,
                      }}
                    >
                      {el.sum}
                    </span>
                    <span style={{ backgroundColor: "darkgrey", minWidth: 30 }}>
                      {el.amount}
                    </span>
                  </div>
                </div>
              </td>
              <td>{el.address}</td>
              <td>{el.area}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };
  const renderTable = (_data) => {
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
        {renderTableBody(_data)}
      </table>
    );
  };
  const renderCommissaryData = (representative) => {
    return (
      <div className="CommissaryDiv">
        {renderCommissaryDetailsDiv(
          representative.name ? representative.name : "--"
        )}
        {renderTable(representative.customers)}
        {renderSummary(
          "Commissary",
          representative.name ? representative.name : "",
          representative.count,
          representative.amount
        )}
      </div>
    );
  };

  const renderBranchData = (branch) => {
    return (
      <div className="branchDiv">
        {renderBranchNameDiv(branch.name ? branch.name : "--")}
        {branch.representatives.map((representative) =>
          renderCommissaryData(representative)
        )}
        {renderSummary(
          "Branch",
          branch.name ? branch.name : "",
          branch.count,
          branch.amount
        )}
      </div>
    );
  };
  const renderData = ({ data, fromDate, toDate }) => {
    return (
      <div
        className="installmentsDuePerOfficerCustomerCard"
        dir="rtl"
        lang="ar"
      >
        {renderHeader(fromDate, toDate)}
        {data.branches.map((branch) => renderBranchData(branch))}
        {renderSummary("Total", null, data.count, data.amount)}
      </div>
    );
  };
  console.log("props", props);
  return renderData(props);
};

export default InstallmentsDuePerOfficerCustomerCard;
