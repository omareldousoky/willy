import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import * as local from "../../../Shared/Assets/ar.json";
import { Loader } from "../../../Shared/Components/Loader";
import { getErrorMessage } from "../../../Shared/Services/utils";
import { checkLinkage } from "../../Services/APIs/Leads/halanLinkage";
import {
  CheckLinkageResponse,
  LinkageStatusEnum,
} from "../../Services/interfaces";

const HalanLinkageModal = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const checkHalanLinkage = async () => {
    if (!props.customer._id) {
      props.hideModal();
      Swal.fire("Error !", getErrorMessage(""));
      return;
    }
    const res = await checkLinkage(props.customer._id);
    if (res.status === "success") {
      setIsLoading(false);
      const response = res.body as CheckLinkageResponse;
      if (response.status === LinkageStatusEnum.Pending) {
        setShowForm(true);
      }
    } else {
      props.hideModal();
      Swal.fire(
        "Error !",
        getErrorMessage((res.error as Record<string, string>).error),
        "error"
      );
      return;
    }
  };
  useEffect(() => {
    console.log(props.customer);
    checkHalanLinkage();
  });

  return (
    <Modal size="lg" show={props.show} onHide={props.hideModal}>
      <Loader type="fullsection" open={isLoading} />
      <Modal.Header closeButton>
        <Modal.Title className="m-auto">{local.linkUserWithHalan}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showForm && (
          <>
            <Card className="info-box">
              <Row>
                <div className="item">
                  <p className="label">{local.customerName}</p>
                  <p>{props.customer.customerName}</p>
                </div>
                <div className="item">
                  <p className="label">{local.oneBranch}</p>
                  <p>Branch Name</p>
                </div>
                <div className="item">
                  <p className="label">{local.customerCode}</p>
                  <p>{props.customer.key}</p>
                </div>
              </Row>
            </Card>
            <Col>
              <Button className="w-100" disabled={false} variant="primary">
                {local.submit}
              </Button>
            </Col>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default HalanLinkageModal;
