import React from "react";
import store from "../../../../Shared/redux/store";
import {
  getCurrentTime,
  numbersToArabic,
  timeToArabicDate,
} from "../../../../Shared/Services/utils";
import "./partialPayment.scss";

interface PartialPaymentProps {
  fromDate: string;
  toDate: string;
  data: any;
}

const PartialPayment = (props: PartialPaymentProps) => {
  const { fromDate, toDate, data } = props;
  return (
    <div className="partial-payment" lang="ar">
      <div className="header-wrapper">
        <span className="logo-print" role="img" />
        <p style={{ margin: "0" }}>
          ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
        </p>
      </div>
      <div className="header-wrapper">
        <p style={{ marginRight: "10px" }}>
          شركة تساهيل للتمويل متناهي الصغر
        </p>
        <p>{store.getState().auth.name}</p>
        <p>{getCurrentTime()}</p>
      </div>
      <div className="d-flex flex-column mx-3">
        <p className="report-title">
          ملخص الاقساط المستحقة عن فترة من : &nbsp;
          {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى : &nbsp;
          {timeToArabicDate(new Date(toDate).valueOf(), false)}
        </p>
        <hr className="horizontal-line" />
      </div>
      <table className="body">
        <thead>
          <tr>
            <th colSpan={2} className="border-0 bg-white"></th>
            <th colSpan={3}>المستحق</th>
            <th colSpan={3}>إجمالى المسدد</th>
            <th className="empty"></th>
            <th colSpan={3}>المتبقى من المسدد جزئى</th>
            <th colSpan={3}>إجمالى الاقساط الغير مسددة</th>
          </tr>
          <tr>
            <th colSpan={2} className="border-0 bg-white"></th>
            <th colSpan={2}>عدد العملاء / اقساط</th>
            <th>قيمة</th>
            <th>عدد</th>
            <th>قيمة</th>
            <th>%</th>
            <th className="empty"></th>
            <th>عدد</th>
            <th>قيمة</th>
            <th colSpan={2}>عدد العملاء / اقساط</th>
            <th>قيمة</th>
          </tr>
        </thead>
        <tbody>
          {/* {data.branchBriefing ? (
                        data.branchBriefing.map((brief) => {
                            return ( */}
          <tr>
            <td colSpan={2}>بني سويف - ناصر بنى سويف ثان</td>
            <td>{numbersToArabic(1901) || 0}</td>
            <td>{numbersToArabic(3857) || 0}</td>
            <td>{numbersToArabic("6,052,413") || 0}</td>
            <td>{numbersToArabic("3,835") || 0}</td>
            <td>{numbersToArabic("6,009,086") || 0}</td>
            <td>{numbersToArabic("99.28") || 0}</td>
            <td className="empty"></td>
            <td>{numbersToArabic("24") || 0}</td>
            <td>{numbersToArabic("37,088") || 0}</td>
            <td>{numbersToArabic("217") || 0}</td>
            <td>{numbersToArabic("387") || 0}</td>
            <td>{numbersToArabic("752,629") || 0}</td>
          </tr>
					<tr>
            <td colSpan={2}>بني سويف - ناصر بنى سويف ثان</td>
            <td>{numbersToArabic(1901) || 0}</td>
            <td>{numbersToArabic(3857) || 0}</td>
            <td>{numbersToArabic("6,052,413") || 0}</td>
            <td>{numbersToArabic("3,835") || 0}</td>
            <td>{numbersToArabic("6,009,086") || 0}</td>
            <td>{numbersToArabic("99.28") || 0}</td>
            <td className="empty"></td>
            <td>{numbersToArabic("24") || 0}</td>
            <td>{numbersToArabic("37,088") || 0}</td>
            <td>{numbersToArabic("217") || 0}</td>
            <td>{numbersToArabic("387") || 0}</td>
            <td>{numbersToArabic("752,629") || 0}</td>
          </tr>

          <tr>
            <td colSpan={2}>بني سويف - ناصر بنى سويف ثان</td>
            <td>{numbersToArabic(1901) || 0}</td>
            <td>{numbersToArabic(3857) || 0}</td>
            <td>{numbersToArabic("6,052,413") || 0}</td>
            <td>{numbersToArabic("3,835") || 0}</td>
            <td>{numbersToArabic("6,009,086") || 0}</td>
            <td>{numbersToArabic("99.28") || 0}</td>
            <td className="empty"></td>
            <td>{numbersToArabic("24") || 0}</td>
            <td>{numbersToArabic("37,088") || 0}</td>
            <td>{numbersToArabic("217") || 0}</td>
            <td>{numbersToArabic("387") || 0}</td>
            <td>{numbersToArabic("752,629") || 0}</td>
          </tr>

          {/* );
           })
                    ) : (
                        <tr></tr>
                    )}  */}
					<tr />
					<tr><td colSpan={100} className="border-0"><hr className="horizontal-line bold m-1" /></td></tr>
          <tr>
            <td colSpan={2} className="border-0">
              الإجمالى العام :
            </td>
            <td colSpan={2} className="bg-grey">عدد العملاء / اقساط</td>
            <td className="bg-grey">قيمة</td>
            <td className="bg-grey">عدد</td>
            <td className="bg-grey">قيمة</td>
            <td className="bg-grey">%</td>
            <td className="empty bg-grey" />
            <td className="bg-grey">عدد</td>
            <td className="bg-grey">قيمة</td>
            <td colSpan={2} className="bg-grey">عدد العملاء / اقساط</td>
            <td className="bg-grey">قيمة</td>
          </tr>
          <tr>
            <td colSpan={2} className="border-0" />
            <td colSpan={3} className="bg-grey">المستحق</td>
            <td colSpan={3} className="bg-grey">إجمالى المسدد</td>
            <td className="empty" />
            <td colSpan={3} className="bg-grey">المتبقى من المسدد جزئى</td>
            <td colSpan={3} className="bg-grey">إجمالى الاقساط الغير مسددة</td>
          </tr>
          <tr>
            <td colSpan={2} className="border-0" />
            <td>{numbersToArabic("399,403") || 0}</td>
            <td>{numbersToArabic("435,175") || 0}</td>
            <td>{numbersToArabic("636,850,125") || 0}</td>
            <td>{numbersToArabic("417,457") || 0}</td>
            <td>{numbersToArabic("610,675,557") || 0}</td>
            <td>{numbersToArabic("95.89") || 0}</td>
            <td className="empty" />
            <td>{numbersToArabic("1,289") || 0}</td>
            <td>{numbersToArabic("2,148,069") || 0}</td>
            <td>{numbersToArabic("15,111") || 0}</td>
            <td>{numbersToArabic("19,007") || 0}</td>
            <td>{numbersToArabic("26,174,307") || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PartialPayment;
