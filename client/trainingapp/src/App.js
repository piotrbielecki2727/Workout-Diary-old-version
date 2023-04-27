import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import moment from "moment";
import "moment/locale/pl";
import './App.css';
import { Link, Route } from "react-router-dom";
import { Form, Button, ListGroup } from 'react-bootstrap';
import { Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';


function App() {
  const [listofTraining, setlistofTraining] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null); // id treningu, który jest aktualnie edytowany
  const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  const userId = localStorage.getItem('userId');


  /////////////////////////////OBSLUGA TRENINGOW/////////////////////
  useEffect(() => {
    Axios.get(`http://localhost:3001/getTrainingByUserId/${userId}`)
      .then((response) => {
        console.log('Training data:', response.data);
        setlistofTraining(response.data);
        localStorage.setItem('userId', userId); // store the userId in the local storage
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);


  const createTraining = async () => {
    try {
      const response = await Axios.post(`http://localhost:3001/createTraining`, {
        name: name,
        date: formattedDate,
      });

      const trainingObject = {
        _id: response.data._id,
        name: response.data.name,
        date: response.data.date,
      };

      const userResponse = await Axios.get(`http://localhost:3001/user/${userId}`);
      if (!Array.isArray(userResponse.data.trainings)) {
        console.error("userResponse.data.trainings is not iterable");
        userResponse.data.trainings = [];
      }
      const updatedTrainings = [...userResponse.data.trainings, trainingObject];

      await Axios.put(`http://localhost:3001/user/${userId}`, { trainings: updatedTrainings });

      alert("TRAINING CREATED");
      setName("");
      setDate("");
      setlistofTraining((prevList) => [...prevList, trainingObject]);
      console.log(`New training created with ID: ${trainingObject._id}`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the training.");
    }
  };

  const updateTraining = async (trainingId, updatedTraining) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
      const response = await Axios.put(`http://localhost:3001/updateTraining/${trainingId}`, {
      name: updatedTraining.name,
      date: formattedDate,
    });
      const updatedTrainingObject = {
        _id: response.data._id,
        name: response.data.name,
        date: response.data.date,
      };

   
      const userResponse = await Axios.get(`http://localhost:3001/user/${userId}`);
      const updatedTrainings = userResponse.data.trainings.map(training => {
        if (training._id === updatedTrainingObject._id) {
          return updatedTrainingObject;
        }
        return training;
      });
      await Axios.put(`http://localhost:3001/user/${userId}`, { trainings: updatedTrainings });

      setlistofTraining(prevList => prevList.map(training => {
        if (training._id === updatedTrainingObject._id) {
          return updatedTrainingObject;
        }
        return training;
      }));

      alert("TRAINING UPDATED");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the training.");
    }
  };


  const editTraining = (training) => {
    setEditId(training._id);
    setName(training.name);
    setDate(training.formattedDate);
  };


  const deleteTraining = async (trainingId) => {
    try {
      // delete training from the server
      await Axios.delete(`http://localhost:3001/deleteTraining/${trainingId}`);

      // remove training from user's trainings array
      const userResponse = await Axios.get(`http://localhost:3001/user/${userId}`);
      const updatedTrainings = userResponse.data.trainings.filter((training) => training._id !== trainingId);
      await Axios.put(`http://localhost:3001/user/${userId}`, { trainings: updatedTrainings });

      // update state to remove deleted training from the list
      setlistofTraining((prevList) => prevList.filter((training) => training._id !== trainingId));

      alert("TRAINING DELETED");
      console.log(`Training with ID ${trainingId} has been deleted`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the training.");
    }
  };





  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setDate("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editId) {
      updateTraining(editId, { name, date });
    } else {
      createTraining();
    }
  };

  /////////////////////OBSLUGA CWICZEN///////////////////////
  const getWorkoutById = (id) => {
    Axios.get(`http://localhost:3001/getWorkoutById/${id}`, {
    })
      .then((response) => {
        alert("TRAINING GOT");
        const workout = {
          name: response.data.name,
          date: response.data.date,
        }
        console.log(workout);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  return (
    <div className='xd'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              pattern="[A-Za-z0-9\s]+"
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Enter date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              min="2021-01-01T00:00"
              max="2023-12-31T23:59"
              required
            />
          </Form.Group>
          <br></br>
          {editId ? (
            <>
            <ButtonGroup>
              <Button className='update' variant="primary" type="submit" >
                Update Training
              </Button>
              <Button variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
              </ButtonGroup>
            </>
          ) : (
            <Button className='wariat' variant="secondary" type="submit">
              Create Training
            </Button>
          )}
        </Form>
        <hr />
        <p>User ID: {userId}</p>
        <ListGroup>
          {listofTraining.map((training) => {
            console.log("List of training IDs:", listofTraining.map((training) => training._id));
            console.log('Key for this item:', training._id);
            return (
              <ListGroup.Item key={training._id}>
                <table className='tables'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{training._id}</td>
                      <td>{training.name}</td>
                      <td>{training.date}</td>
                      <td>
                        <ButtonGroup>
                          <Button className='editbutton' onClick={() => editTraining(training)}>Edit</Button>
                          <Button className='deletebutton' onClick={() => deleteTraining(training._id)}>Delete</Button>
                          <Link to={`/workout/${training._id}`} className='btn btn-info'>View</Link>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
    </div>
  );
}

export default App;