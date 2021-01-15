import React, { useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import config from "../config";
import { s3Upload } from "../helpers/aws-lib";
import "./UploadGIF.css";

export default function UploadGIF() {
  const file = useRef(null);

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      console.log(attachment);
      alert(attachment);
    } catch (e) {
      alert(e);
    }
  }


  return (
    <div className="NewGIF">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <Button type="submit"
        >
          Create
        </Button>
      </Form>
    </div>
  );
}