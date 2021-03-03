import React from "react";
import store from "../../../../Shared/redux/store";
import { timeToArabicDate } from "../../../../Shared/Services/utils";
import "./officersPercentPayment.scss";

interface OfficersPercentPaymentHeaderProps {
    fromDate: string;
    toDate: string;
}
const OfficersPercentPaymentHeader = ({
    fromDate,
    toDate,
}: OfficersPercentPaymentHeaderProps) => {
    return (
        <>
            <div className="officers-payment-wrapper">
                <span className="logo-print" role="img" />
                <p className="m-0 ml-3 text-sm">
                    ترخيص ممارسه نشاط التمويل متناهي الصغر رقم (2) لسنه 2015
                </p>
            </div>
            <p className="ml-3 pt-1 text-left">شركة تساهيل للتمويل متناهي الصغر</p>
            <div className="d-flex mb-3">
                <p className="m-auto" style={{ fontSize: "16px" }}>
                    تقرير نسب السداد و الانتاجيه للمندوبين : من &nbsp;
                    {timeToArabicDate(new Date(fromDate).valueOf(), false)} إلى
                    : &nbsp;
                    {timeToArabicDate(new Date(toDate).valueOf(), false)}
                </p>
								<p className="mr-3">{store.getState().auth.name}</p>
            </div>
        </>
    );
};

export default OfficersPercentPaymentHeader;
