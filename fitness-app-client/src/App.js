import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
            <img alt="telnyx logo" className="brandImage" src={"data:image/png;base64,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"}></img>
            <span style={{marginLeft: "25px"}}>Fitness Dashboard</span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            <LinkContainer to="/status">
              <Nav.Link>Status Updates</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;