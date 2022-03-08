import { useState } from 'react';
import { Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import Icon from '@mdi/react';
import {
  mdiCog,
  // mdiFileDocumentEdit,
  // mdiFileCancel,
  mdiDotsHorizontal,
} from '@mdi/js';
import './AppSettings.css';

function AppSettings() {
  const [editMode, setEditMode] = useState(false);

  const toggleEdit = () => setEditMode(!editMode);

  return (
    <div className="AppSettings">
      <Container fluid>
        <Row>
          <Col>
            <Card bg="dark" text="white" className="page-header mt-3" body>
              <div className="float-start">
                <Icon className="page-header-icon" path={mdiCog} size={1} />
                <span className="page-header-title">Application Settings</span>
              </div>
              <Dropdown className="float-end ml-auto" id="spec-header-dropdown">
                <Dropdown.Toggle
                  variant="dark"
                  // className="btn-sm"
                  // onClick={openSpecFile}
                >
                  <Icon
                    className="button-icon"
                    path={mdiDotsHorizontal}
                    size={1}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Dropdown.Item>Open Swagger/OpenAPI Document</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AppSettings;
