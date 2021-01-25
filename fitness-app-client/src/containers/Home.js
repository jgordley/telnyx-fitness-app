import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { BsPersonBoundingBox, BsFillChatSquareDotsFill, BsPencilSquare, BsArrowRepeat } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import getFormattedWorkout from "../helpers/FormatWorkout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Home.css";

export default function Home() {

    // List of clients
    const [clients, setclients] = useState([]);


    const [count, setCount] = useState(0);
    const [isTextLoading] = useState(false);

    // Modal toggle variables
    const [show, setShow] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    // Current client viewing in update modal
    const [currentClient, setCurrentClient] = useState({ workout: {exercises: []}, latestMessage: ["No messages to display"] });


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

    const handleClosePreview = () => setShowPreview(false);
    const handleShowPreview = () => setShowPreview(true);


    useEffect(() => {
        async function onLoad() {

            console.log("Home!");
            try {
                const clients = await loadclients();
                setclients(clients);
            } catch (e) {
                alert(e);
            }
        }

        onLoad();
    }, [count]);

    function loadclients() {
        return API.get("fitness", "/clients");

    }

    async function refreshClients() {
        setCount(count + 1);
    }

    function openMessageModal(client) {
        setCurrentClient(client);
        handleShowMessages();
    }

    function openPreviewModal(client) {
        setCurrentClient(client);
        handleShowPreview();
    }

    function openUpdateModal(client) {
        setCurrentClient(client);
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
        let workoutText = getFormattedWorkout(workout, firstName);
        try {
            await API.post("fitness", "/send", {
                body: {
                    workout: workoutText,
                    phoneNumber: phoneNumber
                }
            });
            alert("Message sent!");
        } catch (e) {
            alert(e);
        }
    }

    async function handleSave() {
        try {
            await API.put("fitness", `/clients/${currentClient.clientId}`, {
                body: {
                    workout: currentClient.workout,
                    phoneNumber: updatePhoneNumber,
                    lastName: updateLastName,
                    firstName: updateFirstName,
                    height: updateHeight,
                    weight: updateWeight
                }
            });
            alert("Client updated!");
            handleCloseUpdate();
            setCount(count + 1);
        } catch (e) {
            alert(e);
        }
    }

    async function handleDelete() {
        try {
            await API.del("fitness", `/clients/${currentClient.clientId}`);
            alert("Client deleted!");
            handleCloseUpdate();
            setCount(count + 1);
        } catch (e) {
            alert(e);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
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

            // Adding this client to current listing
            const newClients = clients;
            newClients.push(result);
            setclients(newClients);

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
                            {currentClient.latestMessage.map((message, index) => (
                                <ListGroup.Item key={message + index.toString()}>
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

    function previewModal() {
        return (
            <>
                <Modal show={showPreview} onHide={handleClosePreview}>
                    <Modal.Header closeButton>
                        <Modal.Title>Workout Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{whiteSpace: "pre-wrap", height: "300px", overflowY: "auto"}}>
                            {getFormattedWorkout(currentClient.workout, currentClient.firstName)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePreview}>
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
                            <Col md={2}>
                                <span className="text-muted">
                                    {"Height: " + convertHeight(client.height)}
                                </span>
                                <br />
                                <span className="text-muted">
                                    {"Weight: " + client.weight + "lbs"}
                                </span>
                            </Col>
                            <Col md={7} style={{ textAlign: "center" }}>
                                <Button className="listButton" onClick={() => { openMessageModal(client) }} active={!isTextLoading}>
                                    <BsFillChatSquareDotsFill />
                                </Button>
                                <Button className="listButton" onClick={() => { openUpdateModal(client) }} active={!isTextLoading}>
                                    <BsPencilSquare />
                                </Button>
                                <LinkContainer to={`/workout/${client.clientId}`}>
                                    <Button className="listButton">
                                        Edit Workout <BsPencilSquare />
                                    </Button>
                                </LinkContainer>
                                <Button className="listButton" onClick={() => { openPreviewModal(client) }}>
                                    Preview
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
                    <Col style={{ textAlign: "right" }}>
                        <Button onClick={refreshClients}><BsArrowRepeat /></Button>
                    </Col>
                </Row>
                <ListGroup>{renderclientsList(clients)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {renderclients()}
            {CreateModal()}
            {MessageModal()}
            {UpdateModal()}
            {previewModal()}
        </div>
    );
}