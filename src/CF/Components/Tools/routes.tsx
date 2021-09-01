import * as React from 'react'
import Can from '../../../Shared/config/Can'
import local from '../../../Shared/Assets/ar.json'
import EncodingFiles from './encodingFiles'
import DocumentTypeCreation from '../documentTypeCreation/documentTypeCreation'
import GeoAreas from './geoAreas'
import BusinessActivities from './businessActivities'
import BusinessSpecialities from './businessSpecialities'
import LimitsThreshold from './LimitsThreshold'

export const toolsRoutes = {
  path: '/tools',
  label: local.tools,
  render: (props) => (
    <Can I="documentTypes" a="config">
      <EncodingFiles {...props} />
    </Can>
  ),
  routes: [
    {
      path: '/encoding-files',
      label: local.encodingFiles,
      render: (props) => (
        <Can I="documentTypes" a="config">
          <EncodingFiles {...props} />
        </Can>
      ),
      routes: [
        {
          path: '/create-encoding-files',
          label: local.createEncodingFiles,
          render: (props) => (
            <Can I="documentTypes" a="config">
              <DocumentTypeCreation {...props} edit={false} />
            </Can>
          ),
        },
        {
          path: '/edit-encoding-files',
          label: local.createEncodingFiles,
          render: (props) => (
            <Can I="documentTypes" a="config">
              <DocumentTypeCreation {...props} edit />
            </Can>
          ),
        },
      ],
    },
    {
      path: '/geo-areas',
      label: local.branchAreas,
      render: () => (
        <Can I="geoArea" a="config">
          <GeoAreas />
        </Can>
      ),
    },
    {
      path: '/business-activities',
      label: local.businessActivities,
      render: () => (
        <Can I="viewBusinessSectorConfig" a="config">
          <BusinessActivities />
        </Can>
      ),
    },
    {
      path: '/business-specialities',
      label: local.businessSpecialities,
      render: () => (
        <Can I="viewBusinessSectorConfig" a="config">
          <BusinessSpecialities />
        </Can>
      ),
    },
    {
      path: '/limits-config',
      label: local.principalRange,
      render: (props) => (
        <Can I="createMaxPrincipal" a="config">
          <LimitsThreshold {...props} />
        </Can>
      ),
    },
  ],
}
