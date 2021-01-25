import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import ListGroup from "react-bootstrap/ListGroup";
import { BsArrowRepeat } from "react-icons/bs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ReactJson from 'react-json-view';
import Modal from 'react-bootstrap/Modal';
import "./Status.css";

export default function Status() {
    const [status, setStatus] = useState(0);
    const [count] = useState(0);
    const [viewStatus, setViewStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState({});

    const handleClose = () => setViewStatus(false);
    const handleShow = () => setViewStatus(true);

    useEffect(() => {
        async function onLoad() {

            try {
                const status = await loadStatus();
                setStatus(status);
            } catch (e) {
                alert(e);
            }
        }

        onLoad();
    }, [count]);

    function loadStatus() {
        return API.get("fitness", "/status");
    }

    function StatusModal() {
        return (
            <>
                <Modal show={viewStatus} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Status Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ReactJson
                        src={currentStatus}
                        enableClipboard={false}
                        collapsed={true}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }


    function renderstatusList(status) {
        return (
            <>
                <ListGroup.Item key={status.id}>
                    <Row>
                        <Col md={3}>
                            <span className="font-weight-bold">
                                Event Type
                            </span>
                        </Col>
                        <Col md={3}>
                            <span className="font-weight-bold">
                                Recipient
                            </span>
                        </Col>
                        <Col md={3}>
                            <span className="font-weight-bold">
                                Phone Number
                            </span>
                        </Col>
                        <Col md={3}>
                        </Col>
                    </Row>
                </ListGroup.Item>
                {status ? status.map((status) => (
                    <ListGroup.Item key={status.id} style={status.status.data.payload.errors.length > 0 ? {color: "red"} : null}>
                        <Row>
                            <Col md={3}>
                                <span>
                                    {status.status.data.event_type}
                                </span>
                            </Col>
                            <Col md={3}>
                                <span>
                                    {status.status.data.payload.text.split(" ")[1].slice(0, -1)}
                                </span>
                            </Col>
                            <Col md={3}>
                                <span>
                                    {status.status.data.payload.to[0].phone_number}
                                </span>
                            </Col>
                            <Col md={3}>
                                <Button onClick={() => {setCurrentStatus(status); handleShow();}}>Log Status</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )) : null}
            </>
        );
    }

    function renderstatus() {
        return (
            <div className="status">
                <Row>
                    <Col>
                        <h2>Your status updates</h2>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <Button><BsArrowRepeat /></Button>
                    </Col>
                </Row>
                <ListGroup className="statusListGroup">{renderstatusList(status)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Status">
            {renderstatus()}
            {StatusModal()}
        </div>
    );
}