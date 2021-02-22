import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import * as local from "../../../Shared/Assets/ar.json";
import { CardNavBar, Tab } from "../HeaderWithCards/cardNavbar";
import MonthlyClosing from './MonthlyClosing/monthlyClosing';

interface State {
    id: string;
    activeTab: string;
    tabsArray: Array<Tab>;
}
enum TabsToRender {
    MonthClosing = "monthClosing",

}
class FinancialClosing extends Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            activeTab: TabsToRender.MonthClosing,
            tabsArray: [{
                header: local.monthlyClosing,
                stringKey: TabsToRender.MonthClosing,
            },
            ],
        }
    }
    renderContent(){
        switch (this.state.activeTab) {
            case TabsToRender.MonthClosing:  
                return <MonthlyClosing/> ;
            default:
                return null;
        }
    }
    render() {
        return (
            <Card>
                    <CardNavBar 
                    header= {"here"}
                    array= {this.state.tabsArray}
                    active = {this.state.activeTab}
                    selectTab={(index: string) => this.setState({activeTab: index})}
                    />
                    <div>
                        {this.renderContent()}
                    </div>
            </Card>
        )
    }
}
export default FinancialClosing;