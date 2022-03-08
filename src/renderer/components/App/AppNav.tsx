import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function AppNav() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand className="ml-2">React-Bootstrap</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="app-nav" />
        <Navbar.Collapse id="app-nav">
          <Nav className="me-auto">
            <NavDropdown title="API" id="api-nav-dropdown">
              <LinkContainer to="/specification">
                <NavDropdown.Item>Specification</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown title="Settings" id="settings-nav-dropdown">
              <LinkContainer to="/settings">
                <NavDropdown.Item>App Settings</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNav;
