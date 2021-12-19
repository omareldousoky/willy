import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import HeaderWithCards, {
  Tab,
} from 'Shared/Components/HeaderWithCards/headerWithCards'
import { Loader } from 'Shared/Components/Loader'
import DynamicTable from 'Shared/Components/DynamicTable/dynamicTable'
import Search from 'Shared/Components/Search/search'
import { ListViewProps } from './types'

export function ListView<TableDataType>({
  headerTitle = '',
  headerTabs,
  activeTab,
  isLoading = false,
  viewTitle = '',
  sideTitleText = '',
  tableFrom,
  tableSize,
  tableTotalCount,
  tableUrl,
  tableMappers,
  tableData,
  onChangeTableNumber,
  isCf = false,
  searchKeys,
  dropDownKeys,
  searchPlaceholder,
  searchSetFrom,
  searchUrl,
  hqBranchIdRequest,
  datePlaceholder,
}: ListViewProps<TableDataType>) {
  const renderSearch = searchKeys && searchKeys.length > 0 && (
    <Search
      cf={isCf}
      searchKeys={searchKeys}
      dropDownKeys={dropDownKeys}
      searchPlaceholder={searchPlaceholder}
      setFrom={searchSetFrom}
      datePlaceholder={datePlaceholder}
      url={searchUrl || ''}
      from={tableFrom}
      size={tableSize}
      hqBranchIdRequest={hqBranchIdRequest}
    />
  )
  const renderTable = (
    <DynamicTable
      pagination
      from={tableFrom}
      size={tableSize}
      url={tableUrl}
      totalCount={tableTotalCount}
      mappers={tableMappers}
      data={tableData}
      changeNumber={onChangeTableNumber}
    />
  )
  return (
    <>
      {headerTabs && headerTabs?.length > 0 && (
        <div className="print-none">
          <HeaderWithCards
            header={headerTitle}
            array={headerTabs as Tab[]}
            active={headerTabs.findIndex(
              (tab) => tab.stringKey === activeTab || tab.icon === activeTab
            )}
          />
        </div>
      )}
      {activeTab ? (
        <Card className="main-card p-2">
          <Loader type="fullsection" open={isLoading} />
          <Card.Body className="p-0">
            <div className="custom-card-header">
              <div className="d-flex align-items-center">
                <Card.Title className="mr-4 mb-0">{viewTitle}</Card.Title>
                <span className="text-muted">{sideTitleText}</span>
              </div>
            </div>
            <hr className="dashed-line" />
            {renderSearch}
            {renderTable}
          </Card.Body>
        </Card>
      ) : (
        <>
          {renderSearch}
          {renderTable}
        </>
      )}
    </>
  )
}
