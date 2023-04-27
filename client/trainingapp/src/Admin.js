import React, { useState, useEffect } from 'react'
import './Admin.css';
import Axios from 'axios';


function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = () => {
    Axios.get('http://localhost:3001/getUsers')
      .then((response) => {
        const filteredUsers = response.data.filter((user) => user.email !== "admin@admin.com");
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const blockUser = (userId) => {
    console.log("User ID:", userId); // logowanie wartości ID w konsoli
    Axios.post('http://localhost:3001/blockUser', { userId })
      .then((response) => {
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unblockUser = (userId) => {
    console.log("User ID:", userId); // logowanie wartości ID w konsoli
    Axios.post('http://localhost:3001/unblockUser', { userId })
      .then((response) => {
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };





  return (
    <div className='users'>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Blocked?</th>
            <th>Block user</th>
            <th>Unblock user</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.block ? "Yes" : "No"}</td>
              <td>
                <button className='block' onClick={() => blockUser(user._id)}>Block</button>       
              </td>
              <td>
              <button className='unblock' onClick={() => unblockUser(user._id)}>Unblock</button>  
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
