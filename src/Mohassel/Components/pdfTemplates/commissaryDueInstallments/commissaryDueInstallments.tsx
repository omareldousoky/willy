import React, { Component } from 'react'
import './commissaryDueInstallments.scss'

const numbersToArabic = (input) => {
  if (input || input === 0) {
    const id = ['۰', '۱', '۲', '۳', '٤', '۵', '٦', '۷', '۸', '۹'];
    const inputStr = input.toString();
    return inputStr.replace(/[0-9]/g, (number) => {
      return id[number]
    });
  } else return '';
}
export default class CommissaryDueInstallments extends Component {
  renderHeader = () => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'darkgrey', border: '1px solid black', width: '50%', textAlign: "center", marginBottom: 5 }}>
            {'شركة تساهيل'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{'قائمة الإقساط المستحقة بالمندوب'}</p>
          <p style={{ margin: 0 }}><span>{'من '}</span><span>{'Date1 '}</span><span>{'إلى '}</span><span>{'Date2'}</span></p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0 }}>{'1/1'}</p>
          <p style={{ margin: 0 }}>{"Today's Date"}</p>
        </div>
      </div>
    )
  }
  renderCommissaryDetailsDiv = (CommissaryName = '') => (
    <div style={{ display: 'flex', margin: '5px 0' }}>
      <div style={{ width: '60%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '15%' }}>{'أسم المندوب :'}</p>
          <div style={{ backgroundColor: 'darkgrey', border: '1px solid black', minWidth: 320, textAlign: "right", paddingRight: 5, marginRight: 2 }}>
            <span>{'علياء عبده أحمد حسين'}</span>
            {/* <span>{CommissaryName}</span> */}
          </div>
          <div style={{ border: '1px solid black', minWidth: 160, textAlign: "left", paddingRight: 5, marginRight: 2 }}>
            <span>{'132124123'}</span>
          </div>
        </div>
      </div>
      <div style={{ width: '40%' }} />
    </div>
  )
  renderSummary = (name, count, totalInstallmentAmount, totalPaidAmount, totalDueAmount) => {
    return (
      <div style={{ margin: '2px 0' }}>
        <div className="lineStroke" />
        <div style={{ display: 'flex', margin: '4px 0' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: 4, minWidth: 60 }}>{'إجمالي : '}</span>
            <span style={{ marginLeft: 4, minWidth: 70 }}>{'المندوب : '}</span>
            <div style={{ backgroundColor: 'darkgrey', border: '1px solid black', minWidth: 320, textAlign: "right", paddingRight: 2, marginLeft: 4 }}>
              <span>{name}</span>
            </div>
            <div style={{ border: '1px solid black', textAlign: "center", minWidth: 80, marginLeft: 4 }}>
              {count}
            </div>
            <div style={{ border: '1px solid black', textAlign: "center", minWidth: 80, marginLeft: 4 }}>
              {totalInstallmentAmount}
            </div>
            <div style={{ border: '1px solid black', textAlign: "center", minWidth: 80, marginLeft: 4 }}>
              {totalPaidAmount}
            </div>
            <div style={{ border: '1px solid black', textAlign: "center", minWidth: 80 }}>
              {totalDueAmount}
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>
        <div className="lineStroke" />
      </div>
    )
  }
  renderCommissaryData = () => {
    return (
      <div className="CommissaryDiv">
        {this.renderCommissaryDetailsDiv()}
        {this.renderTable()}
        {this.renderSummary('علياء عبده أحمد حسين', 14, 53000, 0, 53000)}
      </div>
    )
  }
  renderData = () => {
    return (
      <div className="commissaryDueInstallments" dir="rtl" lang="ar">
        {this.renderHeader()}
        {this.renderCommissaryData()}
      </div>
    )
  }
  renderTable = () => {
    let data = [
      {
        clientName: 'hamada',
        installmentNumber: 123,
        dueDate: 873498,
        installmentStatus: 'غير مسدد',
        installmentAmount: 120,
        dueAmount: 680,
        paidAmount: 420,
        address: 'alharam',
        branchName: 'Giza'
      },
      {
        clientName: 'hamadaa22',
        installmentNumber: 123,
        dueDate: 873498,
        installmentStatus: 'غير مسدد',
        installmentAmount: 120,
        dueAmount: 680,
        paidAmount: 420,
        address: 'alharam',
        branchName: 'Giza'
      },
      {
        clientName: 'hamadaaaaaaa333',
        installmentNumber: 123,
        dueDate: 873498,
        installmentStatus: 'غير مسدد',
        installmentAmount: 120,
        dueAmount: 680,
        paidAmount: 420,
        address: 'alharam',
        branchName: 'Giza'
      }
    ]
    return (
      <table className="table">
        <thead>
          <tr>
            <th>{'أسم العميل'}</th>
            <th>{'ت الإستحقاق'}</th>
            <th>{'رقم القسط'}</th>
            <th>{'حالة القسط'}</th>
            <th>{'قيمة القسط'}</th>
            <th>{'مسدد'}</th>
            <th>{'المستحق'}</th>
            <th>{'إسم الفرع'}</th>
          </tr>
        </thead>
        {this.renderTableBody(data)}
      </table>
    )
  }
  renderTableBody = (array) => {
    return (
      <tbody>
        {array.map((el, idx) => {
          return (
            <tr key={idx}>
              <td>{el.clientName}</td>
              <td>{el.dueDate}</td>
              <td>{el.installmentNumber}</td>
              <td>{el.installmentStatus}</td>
              <td>{numbersToArabic(el.installmentAmount)}</td>
              <td>{el.paidAmount}</td>
              <td>{el.dueAmount}</td>
              <td>{el.branchName}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }
  render() {
    return (this.renderData())
  }
}