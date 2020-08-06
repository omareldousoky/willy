import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import * as local from "../../../Shared/Assets/ar.json";
import ClientGuaranteedLoans from "../pdfTemplates/ClientGuaranteedLoans/ClientGuaranteedLoans";
import { GuaranteedLoans } from "../../Services/interfaces";

interface State {
  pdfsArray: Array<any>;
  selectedPdf: any;
}
interface Props {
  guaranteeedLoansData: GuaranteedLoans | undefined;
  changeDataToBePrinted: (data) => void;
  changePrint: (data) => void;
}
export class CustomerReportsTab extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      pdfsArray: [
        {
          key: "ClientGuaranteedLoans",
          local: local.ClientGuaranteedLoans,
          //   inputs: ["dateFromTo", "branches"],
          data: this.props.guaranteeedLoansData,
        },
      ],
      selectedPdf: {},
    };
  }
  handlePrint = (pdf) => {
    console.log("here", pdf);
    this.props.changePrint(pdf.key);
    this.props.changeDataToBePrinted(pdf.data);
  };
  render() {
    return (
      <Card style={{ margin: "20px 50px" }} className="print-none">
        <Card.Body style={{ padding: 0 }}>
          <div className="custom-card-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Card.Title style={{ marginLeft: 20, marginBottom: 0 }}>
                {local.reportsProgram}
              </Card.Title>
            </div>
          </div>
          {this.state.pdfsArray?.map((pdf, index) => {
            return (
              <Card key={index}>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0px 20px",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ marginLeft: 40 }}>#{index + 1}</span>
                      <span>{pdf.local}</span>
                    </div>
                    <img
                      style={{ cursor: "pointer" }}
                      alt="download"
                      data-qc="download"
                      src={require(`../../Assets/green-download.svg`)}
                      onClick={() => this.handlePrint(pdf)}
                    />
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </Card.Body>
      </Card>
    );
  }
}
