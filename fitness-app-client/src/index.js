import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import config from './config';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

//AWS Capabilities
import { Amplify } from 'aws-amplify';


Amplify.configure({
  Auth: {
    mandatorySignIn: false,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    accessKeyId: "xxx",
    secretAccessKey: "xxx"
  },
  API: {
    endpoints: [
      {
        name: "fitness",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

ReactDOM.render(
    <Router>
      <App />
    </Router>,
  document.getElementById('root')
);