import React, { useState, useEffect } from 'react';
import "./Workout.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { BsFillTrashFill } from "react-icons/bs";
import { API } from "aws-amplify";
import Button from "react-bootstrap/Button";
import RangeSlider from 'react-bootstrap-range-slider';
import { useParams, useHistory } from "react-router-dom";

export default function Workout() {

    const { clientId } = useParams();
    const [client, setClient] = useState({});

    const [name, setName] = useState("");
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [sets, setSets] = useState(0);

    const history = useHistory();

    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        async function onLoad() {
            console.log("Running!");
            try {
                const newClient = await API.get("fitness", `/clients/${clientId}`);
                setClient(newClient);
                setExercises(newClient.workout.exercises);
            } catch (e) {
                alert("Error getting client: " + e);
            }
        }

        onLoad();
    }, [clientId]);

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(exercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setExercises(items);
    }

    function addExercise() {
        if(!name) {
            alert("Please add an exercise name!");
            return;
        }
        const newExercise = {
            name: name,
            sets: sets,
            reps: reps,
            weight: weight
        }
        const current = exercises;
        current.push(newExercise);
        setExercises(current);
        setWeight(0);
        setReps(0);
        setSets(0);
        setName("");
    }

    function removeExercise(index) {
        const temp = [...exercises];
        temp.splice(index, 1);
        setExercises(temp);
    }

    async function updateExercise() {

        const updatedClient = client;
        updatedClient.workout.exercises = exercises;

        try {
            await API.put("fitness", `/clients/${clientId}`, {
                body: updatedClient
            });
        } catch (e) {
            alert("Error updating workout: " + e);
        }

        history.push("/");
    }

    return (
        <div className="workout text-center">
            <Row>
                <Col md={6}>
                    <Container>
                        <h2>Exercise Editor</h2>
                        <br></br>
                        <Form style={{ textAlign: "left" }}>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Exercise Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter exercise name" value={name} onChange={(event) => setName(event.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Sets</Form.Label>
                                <RangeSlider
                                    value={sets}
                                    variant="success"
                                    onChange={changeEvent => setSets(changeEvent.target.value)}
                                    max={10}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Reps</Form.Label>
                                <RangeSlider
                                    value={reps}
                                    variant="success"
                                    onChange={changeEvent => setReps(changeEvent.target.value)}
                                    max={30}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Weight</Form.Label>
                                <RangeSlider
                                    value={weight}
                                    variant="success"
                                    onChange={changeEvent => setWeight(changeEvent.target.value)}
                                    max={100}
                                />
                            </Form.Group>
                            <Button variant="success" onClick={addExercise}>Submit form</Button>
                        </Form>
                    </Container>
                </Col>
                <Col md={6} className="workout-list">
                    <h2>Current Workout</h2>
                    <div className="inner-workout-list">
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="exercises">
                            {(provided) => (
                                <ul className="exercises" {...provided.droppableProps} ref={provided.innerRef}>
                                    {exercises.map(({ name, sets, reps, weight }, index) => {
                                        return (
                                            <Draggable key={name+index.toString()} draggableId={name+index.toString()} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <p>
                                                            {name} {sets} x {reps} with {weight} lbs
                                                        </p>
                                                        <Button onClick={() => removeExercise(index)}><BsFillTrashFill /></Button>
                                                    </li>

                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    </div>
                    <Button variant="success" onClick={updateExercise}>Set Workout</Button>
                </Col>
            </Row>
        </div>
    );
}