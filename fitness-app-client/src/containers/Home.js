import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { BsPersonBoundingBox, BsFillChatSquareDotsFill, BsPencilSquare, BsArrowRepeat } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import getFormattedWorkout from "../helpers/FormatWorkout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Home.css";

export default function Home() {
    const [clients, setclients] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isTextLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [currentClient, setCurrentClient] = useState({ latestMessage: ["No messages to display"] });


    //Create client fields
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    //Update client fields
    const [updateHeight, setUpdateHeight] = useState(0);
    const [updateWeight, setUpdateWeight] = useState(0);
    const [updateFirstName, setUpdateFirstName] = useState("");
    const [updateLastName, setUpdateLastName] = useState("");
    const [updatePhoneNumber, setUpdatePhoneNumber] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseMessages = () => setShowMessages(false);
    const handleShowMessages = () => setShowMessages(true);

    const handleCloseUpdate = () => setShowUpdate(false);
    const handleShowUpdate = () => setShowUpdate(true);

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

    async function refreshClients() {
        setCount(count+1);
    }

    function openMessageModal(client) {
        setCurrentClient(client);
        console.log(client);
        handleShowMessages();
    }

    function openUpdateModal(client) {
        setCurrentClient(client);
        console.log(client);
        setUpdateFirstName(client.firstName);
        setUpdateLastName(client.lastName);
        setUpdateWeight(client.weight);
        setUpdateHeight(client.height);
        setUpdatePhoneNumber(client.phoneNumber);
        handleShowUpdate();
    }

    function convertHeight(inches) {
        const feet = (inches - (inches % 12)) / 12;
        inches = inches % 12;
        return feet.toString() + "'" + inches.toString() + "\"";
    }

    async function sendWorkout(workout, phoneNumber, firstName) {
        console.log(workout, phoneNumber);
        let workoutText = getFormattedWorkout(workout, firstName);
        console.log(workoutText);
        try {
            const result = await API.post("fitness", "/send", {
                body: {
                    workout: workoutText,
                    phoneNumber: phoneNumber
                }
            });

            console.log(result);
            alert("Message sent!");
        } catch (e) {
            alert(e);
        }
    }

    async function handleSave() {
        console.log(currentClient.clientId);
        console.log(updateFirstName);
        try {
            const result = await API.put("fitness", `/clients/${currentClient.clientId}`, {
                body: {
                    workout: currentClient.workout,
                    phoneNumber: updatePhoneNumber,
                    lastName: updateLastName,
                    firstName: updateFirstName,
                    height: updateHeight,
                    weight: updateWeight
                }
            });

            console.log(result);
            alert("Client updated!");
            handleCloseUpdate();
            setCount(count+1);
        } catch (e) {
            alert(e);
        }
    }

    async function handleDelete() {
        try {
            const result = await API.del("fitness", `/clients/${currentClient.clientId}`);
            console.log(result);
            alert("Client deleted!");
            handleCloseUpdate();
            setCount(count+1);
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

    function UpdateModal() {
        return (
            <>
                <Modal show={showUpdate} onHide={handleCloseUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Client</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Control placeholder="First name" value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="Last name" value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value)} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Control placeholder="Height(inches)" value={updateHeight} onChange={(e) => setUpdateHeight(e.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="Weight(lbs)" value={updateWeight} onChange={(e) => setUpdateWeight(e.target.value)} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Form.Control placeholder="Phone Number" value={updatePhoneNumber} onChange={(e) => setUpdatePhoneNumber(e.target.value)} />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseUpdate}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button variant="primary" disabled={!updateHeight || !updateWeight || !updateLastName || !updateFirstName || !updatePhoneNumber} onClick={handleSave}>
                            Save
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
                            <Col md={6} style={{textAlign: "center"}}>
                                <Button className="listButton" onClick={() => { openMessageModal(client) }} active={!isTextLoading}>
                                    <BsFillChatSquareDotsFill />
                                </Button>
                                <Button className="listButton" onClick={() => { openUpdateModal(client) }} active={!isTextLoading}>
                                    <BsPencilSquare />
                                </Button>
                                <Button className="listButton" onClick={() => { sendWorkout(client.workout, client.phoneNumber, client.firstName) }} active={!isTextLoading}>
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
                <Row>
                    <Col>
                    <h2>Your clients</h2>
                    </Col>
                    <Col style={{textAlign: "right"}}>
                    <Button onClick={refreshClients}><BsArrowRepeat /></Button>
                    </Col>
                </Row>
                <ListGroup>{!isLoading && renderclientsList(clients)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {renderclients()}
            {CreateModal()}
            {MessageModal()}
            {UpdateModal()}
        </div>
    );
}