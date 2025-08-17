// src/pages/SignalsView.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PairSelector from './Signals/PairSelector';
import TradingChart from './Signals/TradingChart';
import SignalAnalysis from './Signals/SignalAnalysis';

const SignalsView = ({ userId }) => {
  return (
    <div className="App">
      <Container className="py-4">
        <Row>
          <Col>
            <PairSelector />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <TradingChart />
          </Col>
        </Row>
        <Row>
          <Col>
            <SignalAnalysis />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignalsView;