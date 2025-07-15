import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatCard from './StatCard';

function Dashboard() {
  return (
    <Container className="mt-4">
      <h3>Welcome back, Tanaka 👋</h3>
      <p className="text-muted">Here’s what’s happening today</p>

      <Row className="mb-4">
        <Col md={4}>
          <StatCard title="Active Projects" value="12" icon="📂" />
        </Col>
        <Col md={4}>
          <StatCard title="Team Members" value="28" icon="👥" />
        </Col>
        <Col md={4}>
          <StatCard title="Assets" value="154" icon="📁" />
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <StatCard title="Hours Tracked This Week" value="47 hrs" icon="⏱️" />
        </Col>
        <Col md={4}>
          <StatCard title="Tasks Completed" value="72%" icon="✅" />
        </Col>
        <Col md={4}>
          <StatCard title="Last Admin Update" value="Yesterday" icon="🛠️" />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
