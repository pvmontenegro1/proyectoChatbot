
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* <Navbar.Brand href="#home">Registro de usuarios - Admin</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#user-register">User Register</Nav.Link>
            <Nav.Link href="#chats">Chats</Nav.Link>
            <Nav.Link href="#contacts">Contacts</Nav.Link>
            <Nav.Link href="#admin">Admin</Nav.Link>
            <Nav.Link href="#logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
