import MonthlyQuarterlyReports from './monthlyQuarterlyReports';
import React, { Component } from "react";
import * as local from "../../../Shared/Assets/ar.json";
import { CardNavBar, Tab } from "../HeaderWithCards/cardNavbar";
import Can from "../../config/Can";
import Reports from "./reports";
import IscoreReports from "./iscoreReports";
import Card from "react-bootstrap/Card";
import OracleIntegration from "./oracleIntegration";
import OperationsReports from "./operationsReports";
interface State {
    id: string;
    activeTab: string;
    tabsArray: Array<Tab>;
}
class ReportsHome extends Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            activeTab: "financialReports",
            tabsArray: [
                {
                    header: local.paymentsReports,
                    stringKey: "financialReports",
                },
                {
                    header: local.iScoreReports,
                    stringKey: "iScoreReports",
                    permission: "downloadIscoreFile",
                    permissionKey: "report",
                },
                {
                    header: local.operationsReports,
                    stringKey: "operationsReports",
                },  
                {
                    header: local.monthlyQuarterlyReports,
                    stringKey: 'monthlyQuarterlyReports',
                }]
        }
    }
    handleOptionChange = (changeEvent) => {
        this.setState({
            activeTab: changeEvent.target.value,
        });
    };
    renderContent() {
        switch (this.state.activeTab) {
            case "financialReports":
                return <Reports />;
            case "iScoreReports":
                return <IscoreReports />;
            case "oracleIntegration":
                return <OracleIntegration />;
            case "operationsReports":
                return <OperationsReports />;
            case "monthlyQuarterlyReports":
                return <MonthlyQuarterlyReports/>
            default:
                return null;
        }
    }
    render() {
        return (
            <Card>
                <div className="print-none">
                    <CardNavBar
                        header={"here"}
                        array={this.state.tabsArray}
                        active={this.state.activeTab}
                        selectTab={(index: string) =>
                            this.setState({ activeTab: index })
                        }
                    />
                </div>
                <div>{this.renderContent()}</div>
            </Card>
        );
    }
}
export default ReportsHome;
