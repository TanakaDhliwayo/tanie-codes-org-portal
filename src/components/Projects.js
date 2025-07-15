import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const dummyProjects = [
  {
    id: 1,
    name: "Future Ready Career Expo",
    start: "2025-06-01",
    end: "2025-07-01",
    status: "Active",
    team: ["Tanaka", "Siyamthanda", "Thando"],
  },
  {
    id: 2,
    name: "Tiny Techies Robotics Launch",
    start: "2025-04-10",
    end: "2025-06-15",
    status: "Completed",
    team: ["Tanaka", "Melissa"],
  },
];

const Projects = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">📁 Projects</h2>
      <Row>
        {dummyProjects.map((project) => (
          <Col md={6} lg={4} className="mb-4" key={project.id}>
            <Card>
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {project.start} → {project.end}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Status:</strong> {project.status} <br />
                  <strong>Team:</strong> {project.team.join(", ")}
                </Card.Text>
                <Button variant="primary">View</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Projects;
