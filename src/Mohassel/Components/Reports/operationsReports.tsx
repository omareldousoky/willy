import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { Loader } from "../../../Shared/Components/Loader";
import ReportsModal from "./reportsModal";
import * as local from "../../../Shared/Assets/ar.json";
import Can from "../../config/Can";
import { fetchLoansBriefingReport } from "../../Services/APIs/Reports/loansBriefingReport";
import { installmentsDuePerOfficerCustomerCard } from "../../Services/APIs/Reports/installmentsDuePerOfficerCustomerCard";
import { unpaidInstallmentsByOfficer } from "../../Services/APIs/Reports/unpaidInstallmentsByOfficer";
import { fetchUnpaidInstallmentsPerAreaReport } from "../../Services/APIs/Reports/unpaidInstallmentsPerArea";
import Swal from "sweetalert2";
import LoansBriefing2 from "../pdfTemplates/loansBriefing/loansBriefing2";
import UnpaidInst from "../pdfTemplates/unpaidInst/unpaidInst";
import UnpaidInstallmentsByOfficer from "../pdfTemplates/unpaidInstallmentsByOfficer/unpaidInstallmentsByOfficer";
import InstallmentsDuePerOfficerCustomerCard from "../pdfTemplates/installmentsDuePerOfficerCustomerCard/installmentsDuePerOfficerCustomerCard";
import {
  ApiResponse,
  CustomersArrearsRequest,
  InstallmentsDuePerOfficerCustomerCardRequest,
  OfficersBranchPercentPaymentRequest,
  LeakedCustomersReportRequest,
  OfficersPercentPaymentRequest,
  OperationsReportRequest,
  PaidArrearsRequest,
  UnpaidInstallmentsByOfficerRequest,
} from "../../Services/interfaces";
import {
  fetchOfficersBranchPercentPaymentReport,
  fetchOfficersPercentPaymentReport,
} from "../../Services/APIs/Reports/officersPercentPayment";
import OfficersPercentPayment from "../pdfTemplates/officersPercentPayment/officersPercentPayment";
import OfficerBranchPercentPayment from "../pdfTemplates/officersPercentPayment/officersBranchPercentPayment";
import LeakedCustomersPDF from "../pdfTemplates/LeakedCustomers/leakedCustomers";
import { fetchLeakedCustomersReport } from "../../Services/APIs/Reports/leakedCustomers";
import { fetchDueInstallmentsReport } from "../../Services/APIs/Reports/dueInstallments";
import DueInstallments from "../pdfTemplates/dueInstallments/dueInstallments";
import { getErrorMessage } from "../../../Shared/Services/utils";
import { fetchCustomersArrearsReport } from "../../Services/APIs/Reports/customersArrears";
import { CustomersArrears } from "../pdfTemplates/customersArrears/customersArrears";
import { fetchPaidArrearsReport } from "../../Services/APIs/Reports/paidArrears";
import { PaidArrears } from "../pdfTemplates/paidArrears/paidArrears";
import { fetchMonthComparisonReport } from "../../Services/APIs/Reports/monthComparison";
import MonthComparison from "../pdfTemplates/monthComparison/monthComparison";
import ActiveWalletIndividual from "../pdfTemplates/activeWalletIndividual/activeWalletIndividual";
import { ActiveWalletRequest, fetchActiveWalletGroupReport, fetchActiveWalletIndividualReport } from "../../Services/APIs/Reports/activeWallet";
import ActiveWalletGroup from "../pdfTemplates/activeWalletGroup/activeWalletGroup";
import { Button } from "react-bootstrap";

export interface PDF {
  key?: string;
  local?: string;
  inputs?: Array<string>;
  permission: string;
}

interface OperationsReportsState {
  showModal?: boolean;
  print?: string;
  pdfsArray?: Array<PDF>;
  selectedPdf: PDF;
  data: any; // TODO: Handle type
  loading: boolean;
  fromDate: string;
  toDate: string;
  date: string;
}

enum Reports {
  LoansBriefing2 = "loansBriefing2",
  OfficersPercentPayment = "officersPercentPayment",
  OfficersBranchPercentPayment = "officersBranchPercentPayment",
  UnpaidInstallmentsByOfficer = "unpaidInstallmentsByOfficer",
  InstallmentsDuePerOfficerCustomerCard = "installmentsDuePerOfficerCustomerCard",
  UnpaidInstallmentsPerArea = "unpaidInstallmentsPerArea",
  DueInstallments = "dueInstallments",
  LeakedCustomers = "leakedCustomers",
  PaidArrears = "paidArrears",
  CustomersArrears = "customersArrears",
  MonthComparison = "monthComparison",
  ActiveWalletIndividual = "activeWalletIndividual",
  ActiveWalletGroup = "activeWalletGroup",
}

class OperationsReports extends Component<{}, OperationsReportsState> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      print: "",
      pdfsArray: [
        {
          key: Reports.LoansBriefing2,
          local: "ملخص الحالات والقروض 2",
          inputs: ["dateFromTo", "branches"],
          permission: "briefingReport",
        },
        {
          key: Reports.UnpaidInstallmentsByOfficer,
          local: "الاقساط المستحقة بالمندوب",
          inputs: [
            "dateFromTo",
            "creationDateFromTo",
            "branches",
            "representatives",
          ],
          permission: "unpaidInstallmentsByOfficer",
        },
        {
          key: Reports.InstallmentsDuePerOfficerCustomerCard,
          local: "الاقساط المستحقة للمندوب كارت العميل",
          inputs: [
            "dateFromTo",
            "branches",
            "representatives",
          ],
          permission: "installmentsDuePerOfficerCustomerCard",
        },
        {
          key: Reports.UnpaidInstallmentsPerArea,
          local: "قائمة الاقساط الغير مسددة بمناطق العمل",
          inputs: ["dateFromTo", "branches", "geoAreas"],
          permission: "unpaidInstallmentsPerArea",
        },
        {
          key: Reports.OfficersPercentPayment,
          local: "نسبة سداد المندوبين 1",
          inputs: ["dateFromTo", "branches", "representatives", "gracePeriod"],
          permission: "officerPercentPayment",
        },
        {
          key: Reports.OfficersBranchPercentPayment,
          local: "نسبة سداد المندوبين 3",
          inputs: [
            "dateFromTo",
            "creationDateFromTo",
            "branches",
            "gracePeriod",
          ],
          permission: "officerBranchPercentPayment",
        },
        {
          key: Reports.DueInstallments,
          local: "ملخص الأقساط المستحقة (تقرير السداد الجزئي)",
          inputs: ["dateFromTo", "branches"],
          permission: "dueInstallments",
        },
        {
          key: Reports.LeakedCustomers,
          local: "تقرير العملاء المتسربون",
          inputs: ["dateFromTo", "branches", "representatives"],
          permission: "churnedCustomers",
        },
        {
          key: Reports.CustomersArrears,
          local: "متأخرات المندوب لم يستحق أو مسدد جزئي",
          inputs: ["date", "branches", "representatives"],
          permission: "customersArrears",
        },
        {
          key: Reports.PaidArrears,
          local: "تقرير ما تم تحصيله من المتأخرات",
          inputs: ["dateFromTo", "branches", "representatives"],
          permission: "paidArrears",
        },
        {
          key: Reports.MonthComparison,
          local:
            "مقارنه تقرير ملخص الاقساط المستحقه (تقرير السداد الجزئي ) بالشهر السابق",
          inputs: ["monthComparisonDateFromTo", "branches"],
          permission: "monthComparison",
        },
        {
          key: Reports.ActiveWalletIndividual,
          local: "المحفظة النشطه للمندوبين - فردى",
          inputs: ["date", "branches", "representatives"],
          permission: "individualActiveWallet",
        },
        {
          key: Reports.ActiveWalletGroup,
          local: "المحفظة النشطه للمندوبين - جماعى",
          inputs: ["date", "branches", "representatives"],
          permission: "groupActiveLoans",
        },
      ],
      selectedPdf: { permission: "" },
      data: undefined,
      loading: false,
      fromDate: "",
      toDate: "",
      date: "",
    };
  }
  handlePrint(selectedPdf: PDF) {
    // reset data
    this.setState({
      showModal: true,
      selectedPdf: selectedPdf,
      data: undefined,
      fromDate: "",
      toDate: "",
      date: "",
    });
  }
  handleSubmit(values) {
    const branches = values.branches.map((branch) => branch._id);
    values.branches = branches.includes("") ? [] : branches;
    const { fromDate, toDate, date } = values;
    this.setState({ loading: true, showModal: false, fromDate, toDate, date });
    switch (this.state.selectedPdf.key) {
      case Reports.LoansBriefing2:
        return this.fetchLoansBriefing(values);
      case Reports.UnpaidInstallmentsByOfficer:
        return this.fetchUnpaidInstallmentsByOfficer(values);
      case Reports.InstallmentsDuePerOfficerCustomerCard:
        return this.fetchInstallmentsDuePerOfficerCustomerCard(values);
      case Reports.UnpaidInstallmentsPerArea:
        return this.fetchUnpaidInstallments(values);
      case Reports.OfficersPercentPayment:
        return this.fetchOfficersPercentPayment(values);
      case Reports.OfficersBranchPercentPayment:
        return this.fetchOfficersBranchPercentPayment(values);
      case Reports.DueInstallments:
        return this.fetchDueInstallments(values);
      case Reports.LeakedCustomers:
        return this.fetchLeakedCustomers(values);
      case Reports.CustomersArrears:
        return this.fetchCustomersArrears(values);
      case Reports.PaidArrears:
        return this.fetchPaidArrears(values);
      case Reports.MonthComparison:
        return this.fetchMonthComparison(values);
      case Reports.ActiveWalletIndividual:
        return this.fetchActiveWalletIndividual(values)
      case Reports.ActiveWalletGroup:
        return this.fetchActiveWalletGroup(values);
      default:
        return null;
    }
  }

  handleFetchReport(res: ApiResponse<any>, report: Reports) {
    if (res.status === "success") {
      if (!res.body || !Object.keys(res.body).length) {
        this.setState({ loading: false });
        Swal.fire("error", local.noResults);
      } else {
        this.setState(
          {
            data: res.body,
            showModal: false,
            print: report,
            loading: false,
          },
          () => window.print()
        );
      }
    } else {
      this.setState({ loading: false });
      Swal.fire(
        "Error !",
        getErrorMessage((res.error as Record<string, string>).error),
        "error"
      );
    }
  }

  reportRequest(values): OperationsReportRequest {
    const { fromDate, toDate, branches } = values;
    return {
      startDate: fromDate,
      endDate: toDate,
      branches,
    };
  }
  async fetchLoansBriefing(values) {
    const res = await fetchLoansBriefingReport(this.reportRequest(values));
    this.handleFetchReport(res, Reports.LoansBriefing2);
  }
  async fetchInstallmentsDuePerOfficerCustomerCard(values) {
    const request: InstallmentsDuePerOfficerCustomerCardRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
    };
    const res = await installmentsDuePerOfficerCustomerCard(request);
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.InstallmentsDuePerOfficerCustomerCard
    );
  }

  async fetchUnpaidInstallmentsByOfficer(values) {
    const request: UnpaidInstallmentsByOfficerRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
      creationDateFrom: values.creationDateFrom,
      creationDateTo: values.creationDateTo,
    };

    const res = await unpaidInstallmentsByOfficer(request);
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsByOfficer
    );
  }

  async fetchUnpaidInstallments(values) {
    const res = await fetchUnpaidInstallmentsPerAreaReport(
      { ...this.reportRequest(values), geoAreas: values.geoAreas as string[]}
    );
    this.handleFetchReport(
      res as ApiResponse<any>,
      Reports.UnpaidInstallmentsPerArea
    );
  }

  async fetchOfficersPercentPayment(values) {
    const { fromDate, toDate, branches, representatives, gracePeriod } = values;
    const request: OfficersPercentPaymentRequest = {
      startDate: fromDate,
      endDate: toDate,
      branches,
      representatives,
      gracePeriod,
    };
    const res = await fetchOfficersPercentPaymentReport({ ...request });
    this.handleFetchReport(res, Reports.OfficersPercentPayment);
  }

  async fetchOfficersBranchPercentPayment(values) {
    const request: OfficersBranchPercentPaymentRequest = {
      startDate: values.fromDate,
      endDate: values.toDate,
      branches: values.branches,
      representatives: values.representatives,
      gracePeriod: values.gracePeriod,
      creationDateFrom: values.creationDateFrom,
      creationDateTo: values.creationDateTo,
    };

    const res = await fetchOfficersBranchPercentPaymentReport(request);
    this.handleFetchReport(res, Reports.OfficersBranchPercentPayment);
  }

  async fetchDueInstallments(values) {
    const res = await fetchDueInstallmentsReport(this.reportRequest(values));
    this.handleFetchReport(res, Reports.DueInstallments);
  }
  async fetchLeakedCustomers(values) {
    const { loanOfficerIds } = values;
    const res = await fetchLeakedCustomersReport({
      ...this.reportRequest(values),
      loanOfficerIds,
    } as LeakedCustomersReportRequest);
    this.handleFetchReport(res, Reports.LeakedCustomers);
  }

  async fetchPaidArrears(values) {
    const { fromDate, toDate, branches, loanOfficerIds } = values;
    const res = await fetchPaidArrearsReport({
      startDate: fromDate,
      endDate: toDate,
      branches,
      loanOfficerIds,
    } as PaidArrearsRequest);
    this.handleFetchReport(res, Reports.PaidArrears);
  }

  async fetchCustomersArrears(values) {
    const { date, branches, loanOfficers } = values;
    const res = await fetchCustomersArrearsReport({
      date,
      branches,
      loanOfficers,
    } as CustomersArrearsRequest);
    this.handleFetchReport(res, Reports.CustomersArrears);
  }

  async fetchMonthComparison(values) {
    // get timestamp in UTC
    const res = await fetchMonthComparisonReport({
      startDate: new Date(new Date(values.fromDate).toUTCString())
				.setUTCHours(0,0,0,0),
      endDate: new Date(new Date(values.toDate).toUTCString())
        .setUTCHours(23, 59, 59, 999),
      branches: values.branches,
    });
    this.handleFetchReport(res, Reports.MonthComparison);
  }

  async fetchActiveWalletIndividual(values) {
    const { date, branches, loanOfficers } = values;
    const res = await fetchActiveWalletIndividualReport({
      date,
      branches,
      loanOfficerIds: loanOfficers
    } as ActiveWalletRequest)
    this.handleFetchReport(res, Reports.ActiveWalletIndividual)
  }
  async fetchActiveWalletGroup(values) {
    const { date, branches, loanOfficerIds } = values;
    const res = await fetchActiveWalletGroupReport({
      date,
      branches,
      loanOfficerIds
    } as ActiveWalletRequest)
    this.handleFetchReport(res, Reports.ActiveWalletGroup)
  }

  render() {
    return (
      <>
        <Card style={{ margin: "20px 50px" }} className="print-none">
          <Loader type="fullscreen" open={this.state.loading} />
          <Card.Body style={{ padding: 15 }}>
            <div className="custom-card-header">
              <div className="d-flex">
                <Card.Title className="mr-5">
                  {local.operationsReports}
                </Card.Title>
              </div>
            </div>
            {this.state.pdfsArray?.map((pdf, index) => {
              return (
                <Can I={pdf.permission} a="report" key={index}>
                  <Card key={index}>
                    <Card.Body>
                      <div className="d-flex justify-content-between font-weight-bold">
                        <div>
                          <span className="mr-5 text-secondary">
                            #{index + 1}
                          </span>
                          <span>{pdf.local}</span>
                        </div>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => this.handlePrint(pdf)}
                          title="download"
                        >
                          <span className="download-icon" aria-hidden="true" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Can>
              );
            })}
          </Card.Body>
        </Card>
        {this.state.showModal && (
          <ReportsModal
            pdf={this.state.selectedPdf}
            show={this.state.showModal}
            hideModal={() => this.setState({ showModal: false })}
            submit={(values) => this.handleSubmit(values)}
          />
        )}
        {this.state.print === Reports.LoansBriefing2 && this.state.data && (
          <LoansBriefing2
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.InstallmentsDuePerOfficerCustomerCard &&
          this.state.data && (
            <InstallmentsDuePerOfficerCustomerCard
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.UnpaidInstallmentsByOfficer &&
          this.state.data && (
            <UnpaidInstallmentsByOfficer
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.UnpaidInstallmentsPerArea &&
          this.state.data && (
            <UnpaidInst
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.OfficersPercentPayment &&
          this.state.data && (
            <OfficersPercentPayment
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.OfficersBranchPercentPayment &&
          this.state.data && (
            <OfficerBranchPercentPayment
              data={this.state.data}
              fromDate={this.state.fromDate}
              toDate={this.state.toDate}
            />
          )}
        {this.state.print === Reports.DueInstallments && this.state.data && (
          <DueInstallments
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.LeakedCustomers && this.state.data && (
          <LeakedCustomersPDF
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.CustomersArrears && this.state.data && (
          <CustomersArrears data={this.state.data} date={this.state.date} />
        )}
        {this.state.print === Reports.PaidArrears && this.state.data && (
          <PaidArrears
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {this.state.print === Reports.MonthComparison && this.state.data && (
          <MonthComparison
            data={this.state.data}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        )}
        {
          this.state.print === Reports.ActiveWalletIndividual && this.state.data && (
            <ActiveWalletIndividual
              date={this.state.date}
              data={this.state.data}
            />
          )
        }
        {
          this.state.print === Reports.ActiveWalletGroup && this.state.data && (
            <ActiveWalletGroup
              date={this.state.date}
              data={this.state.data}
            />
          )
        }
      </>
    );
  }
}

export default OperationsReports;
