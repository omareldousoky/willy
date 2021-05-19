import React, { useEffect, useState } from "react";
import { Application } from "../../../../Shared/Services/interfaces";
import {
  getStatus,
  guarantorOrderLocal,
  numbersToArabic,
  orderLocal,
  timeToArabicDate,
} from "../../../../Shared/Services/utils";
import { Header } from "../pdfTemplateCommon/header";
import * as local from "../../../../Shared/Assets/ar.json";
import { IndividualWithInstallments } from "../../LoanProfile/loanProfile";

export const SmeCard = ({
  application,
  penalty,
  remainingTotal,
  getGeoArea,
  members,
}: {
  application: Application;
  penalty: number;
  remainingTotal: number;
  getGeoArea(area: string): { active: boolean; name: string };
  members: IndividualWithInstallments;
}) => {
  const [totalDaysLate, setTotalDaysLate] = useState<number>(0);
  const [totalDaysEarly, setTotalDaysEarly] = useState<number>(0);

  useEffect(() => {
    let totalDaysLate = 0;
    let totalDaysEarly = 0;
    application.installmentsObject?.installments?.map((installment) => {
      if (installment.status !== "rescheduled") {
        if (installment.paidAt) {
          const number = Math.round(
            (new Date(installment.paidAt).setHours(23, 59, 59, 59) -
              new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
              (1000 * 60 * 60 * 24)
          );
          if (number > 0) {
            totalDaysLate = totalDaysLate + number;
          } else totalDaysEarly = totalDaysEarly + number;
        } else {
          const number = Math.round(
            (new Date().setHours(23, 59, 59, 59).valueOf() -
              new Date(installment.dateOfPayment).setHours(23, 59, 59, 59)) /
              (1000 * 60 * 60 * 24)
          );
          if (number > 0) totalDaysLate = totalDaysLate + number;
        }
      }
    });
    setTotalDaysLate(totalDaysEarly);
    setTotalDaysEarly(totalDaysLate);
  }, []);

  const getSum = (key: string) => {
    let max = 0;
    application.installmentsObject?.installments?.map((installment) => {
      max = max + installment[key];
    });
    return max.toFixed(2);
  };
  return (
    <>
      <div className="contract-container" dir="rtl" lang="ar">
        <Header
          title="كارت العميل"
          showCurrentUser={false}
          showCurrentTime={false}
        />

        <p className="font-weight-bolder mb-5">
          عميلنا العزيز، برجاء الالتزام بسداد الاقساط حسب الجدول المرفق
        </p>

        <table>
          <tbody>
            <tr>
              <td>
                الشركة
                <div className="pa-2 border">
                  {numbersToArabic(application.customer?.key)}
                </div>
                <div className="pa-2 border">
                  {" "}
                  {application.customer?.businessName}
                </div>
              </td>
              <td>
                {" "}
                التاريخ
                <div className="pa-2 border">
                  {timeToArabicDate(application.creationDate, false)}
                </div>
              </td>
              <td>
                {" "}
                المندوب
                <div className="pa-2 border">
                  {application.customer?.representativeName}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td>
                قيمة التمويل{" "}
                <div className="pa-2 border">
                  {numbersToArabic(application.principal)}
                </div>
              </td>
              <td>
                فترة السداد{" "}
                <div className="pa-2 border">
                  {application.product?.periodType === "days"
                    ? local.daily
                    : local.inAdvanceFromMonthly}
                </div>
              </td>
              <td>
                عدد الاقساط{" "}
                <div className="pa-2 border">
                  {numbersToArabic(
                    application.installmentsObject?.installments?.length
                  )}
                </div>
              </td>
              <td>
                فترة السماح
                <div className="pa-2 border">
                  {numbersToArabic(application.product?.gracePeriod)}
                </div>
                <div className="pa-2 border">تمويل رأس المال</div>
              </td>
            </tr>
            <tr>
              <td>
                غرامات مسددة{" "}
                <div className="pa-2 border">
                  {numbersToArabic(application.penaltiesPaid)}
                </div>
              </td>
              <td>
                غرامات مطلوبة{" "}
                <div className="pa-2 border">{numbersToArabic(penalty)}</div>
              </td>
              <td>
                غرامات معفاة{" "}
                <div className="pa-2 border">
                  {numbersToArabic(application.penaltiesCanceled)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="ma-5">
          <tbody>
            <tr>
              <th>القسط</th>
              <th>تاريخ الآستحقاق</th>
              <th> قيمة القسط</th>
              <th>تكلفه التمويل</th>
              <th>اجمالي القيمة</th>
              <th>قيمه مسدده</th>
              <th>تكلفه التمويل مسدده</th>
              <th>الحاله</th>
              <th>تاريخ الحاله</th>
              <th>ايام التأخير</th>
              <th className="w-25">ملاحظات</th>
            </tr>
            {application.installmentsObject?.installments?.map(
              (installment) => (
                <tr key={installment.id}>
                  <td>
                    {numbersToArabic(application.applicationKey) +
                      "/" +
                      numbersToArabic(installment.id)}
                  </td>
                  <td>{timeToArabicDate(installment.dateOfPayment, false)}</td>
                  <td>{numbersToArabic(installment.principalInstallment)}</td>
                  <td>{numbersToArabic(installment.feesInstallment)}</td>
                  <td>{numbersToArabic(installment.installmentResponse)}</td>
                  <td>{numbersToArabic(installment.principalPaid)}</td>
                  <td>{numbersToArabic(installment.feesPaid)}</td>
                  <td className="w-100">{getStatus(installment)}</td>
                  <td>
                    {installment.paidAt
                      ? timeToArabicDate(installment.paidAt, false)
                      : ""}
                  </td>
                  <td>
                    {installment.paidAt
                      ? numbersToArabic(
                          Math.round(
                            (new Date(installment.paidAt).setHours(
                              23,
                              59,
                              59,
                              59
                            ) -
                              new Date(installment.dateOfPayment).setHours(
                                23,
                                59,
                                59,
                                59
                              )) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : new Date().setHours(23, 59, 59, 59).valueOf() >
                          new Date(installment.dateOfPayment).setHours(
                            23,
                            59,
                            59,
                            59
                          ) && installment.status !== "rescheduled"
                      ? numbersToArabic(
                          Math.round(
                            (new Date().setHours(23, 59, 59, 59).valueOf() -
                              new Date(installment.dateOfPayment).setHours(
                                23,
                                59,
                                59,
                                59
                              )) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : ""}
                  </td>
                  <td></td>
                </tr>
              )
            )}
            <tr>
              <td>الإجمالي</td>
              <td></td>
              <td>
                {numbersToArabic(
                  application.installmentsObject?.totalInstallments?.principal
                )}
              </td>
              <td>
                {numbersToArabic(
                  application.installmentsObject?.totalInstallments?.feesSum
                )}
              </td>
              <td>
                {numbersToArabic(
                  application.installmentsObject?.totalInstallments
                    ?.installmentSum
                )}
              </td>
              <td>{numbersToArabic(getSum("principalPaid"))}</td>
              <td>{numbersToArabic(getSum("feesPaid"))}</td>
              <th>ايام التأخير</th>
              <td>
                {totalDaysLate > 0
                  ? numbersToArabic(totalDaysLate)
                  : numbersToArabic(0)}
              </td>
              <th>ايام التبكير</th>
              <td>
                {numbersToArabic(
                  totalDaysEarly < 0 ? totalDaysEarly * -1 : totalDaysEarly
                )}
              </td>
            </tr>
            <tr>
              <th colSpan={3} style={{ backgroundColor: "white" }}></th>
              <th colSpan={2} className="py-5 px-0 mr-5">
                رصيد العميل
              </th>
              <td colSpan={2} className="py-5 px-0">
                {numbersToArabic(remainingTotal)}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="ma-5" style={{ border: "1px black solid" }}>
          <tbody>
            {application.guarantors.length > 0 && (
              <tr>
                <th>كود الضامن</th>
                <th>اسم الضامن</th>
                <th>المنطقه</th>
                <th>العنوان</th>
                <th>تليفون</th>
              </tr>
            )}
            {application.guarantors.length > 0
              ? application.guarantors.map((guarantor, index) => {
                  const area = getGeoArea(guarantor.geoAreaId || "");
                  return (
                    <tr key={index}>
                      <td>{numbersToArabic(guarantor.key)}</td>
                      <td>{guarantor.customerName}</td>
                      <td
                        className={
                          !area.active && area.name !== "-" ? "text-danger" : ""
                        }
                      >
                        {area.name}
                      </td>
                      <td>{guarantor.customerHomeAddress}</td>
                      <td>
                        {numbersToArabic(guarantor.mobilePhoneNumber) +
                          "-" +
                          numbersToArabic(guarantor.businessPhoneNumber) +
                          "-" +
                          numbersToArabic(guarantor.homePhoneNumber)}
                      </td>
                    </tr>
                  );
                })
              : application.product?.beneficiaryType === "group"
              ? application.group?.individualsInGroup.map(
                  (individualInGroup, index) => {
                    const area = getGeoArea(
                      individualInGroup.customer.geoAreaId
                    );
                    const share = members.customerTable?.filter(
                      (member) =>
                        member.customer._id === individualInGroup.customer._id
                    )[0].installmentAmount;
                    return (
                      <tr key={index}>
                        <td>
                          {numbersToArabic(individualInGroup.customer.key)}
                        </td>
                        <td>{individualInGroup.customer.customerName}</td>
                        <td>{numbersToArabic(individualInGroup.amount)}</td>
                        <td>{numbersToArabic(share)}</td>
                        <td
                          className={
                            !area.active && area.name !== "-"
                              ? "text-danger"
                              : ""
                          }
                        >
                          {area.name}
                        </td>
                        <td>
                          {individualInGroup.customer.customerHomeAddress}
                        </td>
                        <td>
                          {numbersToArabic(
                            individualInGroup.customer.mobilePhoneNumber
                          ) +
                            "-" +
                            numbersToArabic(
                              individualInGroup.customer.businessPhoneNumber
                            ) +
                            "-" +
                            numbersToArabic(
                              individualInGroup.customer.homePhoneNumber
                            )}
                        </td>
                      </tr>
                    );
                  }
                )
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};
SmeCard.defaultProps = {
  application: {},
};
