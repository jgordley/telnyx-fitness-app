import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { BsPersonBoundingBox } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Home.css";

export default function Home() {
    const [clients, setclients] = useState([]);
    const [count] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextLoading, setIsTextLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [currentClient, setCurrentClient] = useState({ latestMessage: ["No messages to display"] });


    //Create client fields
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseMessages = () => setShowMessages(false);
    const handleShowMessages = () => setShowMessages(true);

    const headers = {
        "Authorization": "Bearer KEY017648B2A94C60500B8F46CFE1C94AEC_SIcqzXjn23R81vrNYGRfkX",
        "Content-Type": "application/json",
        "Accept": "application/json"
    };

    const baseUrl = "https://api.telnyx.com/v2/messages";

    //const telnyx = require('telnyx')('KEY017648B2A94C60500B8F46CFE1C94AEC_SIcqzXjn23R81vrNYGRfkX');

    useEffect(() => {
        async function onLoad() {

            try {
                const clients = await loadclients();
                setclients(clients);
                console.log(clients);
            } catch (e) {
                alert(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [count]);

    function loadclients() {
        return API.get("fitness", "/clients");
    }

    function openMessageModal(client) {
        setCurrentClient(client);
        console.log(client);
        setShowMessages(true);
    }

    function convertHeight(inches) {
        const feet = (inches - (inches % 12)) / 12;
        inches = inches % 12;
        return feet.toString() + "'" + inches.toString() + "\"";
    }

    async function sendWorkout(workout, phoneNumber) {
        console.log(workout, phoneNumber);
        try {
            const result = await API.post("fitness", "/send", {
                body: {
                    workout: workout,
                    phoneNumber: phoneNumber
                }
            });

            console.log(result);
            alert("Message sent!");
        } catch (e) {
            alert(e);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(height, weight, firstName, lastName, phoneNumber);
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].phoneNumber === phoneNumber) {
                alert("A user with this phone number already exists");
                return;
            }
        }
        try {
            const result = await createClient({
                height: height,
                weight: weight,
                lastName: lastName,
                firstName: firstName,
                phoneNumber: phoneNumber
            });

            // New client added
            console.log(result);

            // Adding this client to current listing
            const newClients = clients;
            newClients.push(result);
            setclients(newClients);
            console.log(clients);

            // Close modal
            handleClose();
        } catch (e) {
            alert(e);
        }
    }

    function createClient(client) {
        return API.post("fitness", "/clients", {
            body: client
        })
    }

    function CreateModal() {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Client</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Control placeholder="First name" onChange={(e) => setFirstName(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="Last name" onChange={(e) => setLastName(e.target.value)} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Control placeholder="Height(inches)" onChange={(e) => setHeight(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="Weight(lbs)" onChange={(e) => setWeight(e.target.value)} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Control placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" disabled={!height || !weight || !lastName || !firstName || !phoneNumber} onClick={handleSubmit}>
                            Add Client
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function MessageModal() {
        return (
            <>
                <Modal show={showMessages} onHide={handleCloseMessages}>
                    <Modal.Header closeButton>
                        <Modal.Title>Recent Messages</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            {currentClient.latestMessage.map((message) => (
                                <ListGroup.Item key={message}>
                                    <span className="text-muted">
                                        {message}
                                    </span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseMessages}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function renderclientsList(clients) {
        return (
            <>
                <ListGroup.Item key={0} action onClick={handleShow} className="py-3 text-nowrap text-truncate">
                    <BsPersonBoundingBox size={17} />
                    <span className="ml-2 font-weight-bold">Add a new client</span>
                </ListGroup.Item>
                {clients.map((client) => (
                    <ListGroup.Item key={client.clientId}>
                        <Row>
                            <Col md={3}>
                                <span className="font-weight-bold">
                                    {client.firstName + " " + client.lastName}
                                </span>
                                <br />
                                <span className="text-muted">
                                    Client Since: {new Date(client.createdAt).toLocaleDateString()}
                                </span>
                            </Col>
                            <Col md={3}>
                                <span className="text-muted">
                                    {"Height: " + convertHeight(client.height)}
                                </span>
                                <br />
                                <span className="text-muted">
                                    {"Weight: " + client.weight + "lbs"}
                                </span>
                            </Col>
                            <Col md={3}>
                                <Button onClick={() => { openMessageModal(client) }} active={!isTextLoading}>
                                    See Messages
                                </Button>
                            </Col>
                            <Col md={3} style={{ textAlign: "center" }}>
                                <Button onClick={() => { sendWorkout(client.workout, client.phoneNumber) }} active={!isTextLoading}>
                                    Send Workout
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </>
        );
    }

    function renderclients() {
        return (
            <div className="clients">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your clients</h2>
                <ListGroup>{!isLoading && renderclientsList(clients)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {renderclients()}
            {CreateModal()}
            {MessageModal()}
        </div>
    );
}