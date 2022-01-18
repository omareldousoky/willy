import React from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import local from '../../Assets/ar.json'
import Can from '../../config/Can'
import { LtsIcon } from '../LtsIcon'

import { PDFListProps } from './types'

export const PDFList = ({ list, onClickDownload }: PDFListProps) => {
  return (
    <>
      {list?.length > 0 ? (
        list.map((listItem, index) => (
          <Can
            I={listItem.permission}
            a={listItem.serviceKey ?? 'report'}
            key={index}
          >
            <Card key={index} className="mx-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center font-weight-bold">
                  <div className="d-flex">
                    <span className="mr-5 text-secondary">#{index + 1}</span>
                    <span>{listItem.local}</span>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => onClickDownload(listItem)}
                    title="download"
                  >
                    <LtsIcon name="download" color="#7dc356" size="40px" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Can>
        ))
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          {local.noResults}
        </div>
      )}
    </>
  )
}
