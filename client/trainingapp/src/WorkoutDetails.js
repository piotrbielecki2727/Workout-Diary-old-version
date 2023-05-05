import React, { useState, useEffect } from 'react';
import { useParams, Link, Route } from 'react-router-dom';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import './WorkoutDetails.css';
import WorkoutCreator from './WorkoutCreator';


function WorkoutDetails() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  const updateExerciseList = (newExerciseList) => {
    setWorkout(prevState => ({
      ...prevState,
      exercises: newExerciseList
    }));
  }

  useEffect(() => {
    Axios.get(`http://localhost:3001/getWorkoutById/${id}`)
      .then((response) => {
        console.log('Workout data:', response.data);
        setWorkout(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);


  const deleteExerciseFromWorkout = (id, exerciseId) => {
    Axios.delete(`http://localhost:3001/workouts/${id}/exercises/${exerciseId}`)
      .then((response) => {
        console.log('Exercise deleted:', response.data);
        // wywołaj funkcję, która zaktualizuje stan ćwiczeń w komponencie rodzica
      })
      .catch((error) => {
        console.log('Error deleting exercise:', error);
      });
  };


  if (!workout) {
    return <div>Loading...</div>;
  }




  return (
    <div className="workout-details-container">
      <Table bordered>
        <thead>
          <tr>
            <th colSpan="2">Workout Details </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{workout.name}</td>
          </tr>
          <tr>
            <td>Date:</td>
            <td>{workout.date}</td>
          </tr>
        </tbody>
      </Table>
      {workout.exercises &&
        workout.exercises.map((exercise, index) => (
          <div key={exercise.exercise._id}>
            <h5>Exercise {index + 1}: {exercise.exercise.name}</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Max</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets &&
                  exercise.sets.map((set, index) => (
                    <tr key={set._id}>
                      <td>{index + 1}</td>
                      <td>{set.reps}</td>
                      <td>{set.weight}</td>
                      <td>{(set.weight * (1 + (0.0334 * set.reps))).toFixed(1)}</td>
                      <td>
                      <Button className='deletebutton' onClick={() => deleteExerciseFromWorkout(id,exercise.exercise._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        ))}
      <p>
      <div>
        <WorkoutCreator workout={workout} id={id} updateExerciseList={updateExerciseList}/></div>
      </p>
    </div>
  );
}

export default WorkoutDetails;
