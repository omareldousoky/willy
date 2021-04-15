import React from 'react'
import { Button } from 'react-bootstrap'
import * as local from '../../../Shared/Assets/ar.json'
import Can from '../../config/Can'
export const TerroristsCustomers = () => {
  return (
    <Can I="getSuspectedCustomers" a ="customer">
      {/* //: TODO -- add on Click to download the list */}
      <Button className="btn-cancel-prev">{local.downloadSuspected}</Button> 
    </Can>
  )
}
