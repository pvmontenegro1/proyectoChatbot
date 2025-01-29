import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import CustomNavbar from './Navbar';
import './UserRegister.css';
import { createUser, getUsers } from '../../api/api'; // Ajusta la ruta según sea necesario

const UserRegister = () => {
  const [users, setUsers] = useState([]);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);
  const [maxId, setMaxId] = useState(0); // Estado para el ID máximo

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersList = await getUsers();
    setUsers(usersList);
    // Encuentra el ID máximo de los usuarios
    const maxUserId = usersList.reduce((max, user) => Math.max(max, user.id), 0);
    setMaxId(maxUserId);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newId = maxId + 1; // Genera el nuevo ID
    const user = { id: newId, username, password };
    await createUser(user);
    setUserName('');
    setPassword('');
    fetchUsers(); // Refresh the list
  };

/*   const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      await deleteUserById(id);
      fetchUsers(); // Refresh the list
    }
  }; */

  return (
    <>
      <CustomNavbar />
      <Container className="user-register-container">
        <Row className="mb-4">
          <Col>
            <h1 className="user-register-header">Registro de usuarios - Admin</h1>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form className="user-register-form" onSubmit={handleRegister}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => setUserName(e.target.value)} 
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {editId ? 'Update' : 'Register'}
              </Button>
            </Form>
          </Col>
          <Col md={9}>
            <h2 className="user-register-header">Users:</h2>
            <Table striped bordered hover variant="dark" className="user-register-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Password</th>
                  
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserRegister;
