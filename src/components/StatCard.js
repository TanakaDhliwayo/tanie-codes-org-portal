import React from 'react';
import { Card } from 'react-bootstrap';

function StatCard({ title, value, icon }) {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        <Card.Title>{value}</Card.Title>
        <Card.Text>{title}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StatCard;
