import React, { useState, useEffect } from 'react';
import { useParams, Link, Route } from 'react-router-dom';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import './WorkoutDetails.css';

function WorkoutDetails() {
  const { id } = useParams(); // użyj hooka useParams()
  const [workout, setWorkout] = useState(null);

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

  const deleteExercise = (exerciseId) => {
    Axios.delete(`http://localhost:3001/deleteExercise/${id}/${exerciseId}`)
      .then((response) => {
        console.log(response);
        setWorkout(response.data);
      })
      .catch((error) => {
        console.log(error);
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
        workout.exercises.map((exercise) => (
          <div key={exercise.exercise._id}>
            <h5>{exercise.exercise.name}</h5>
            <Table  bordered>
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
                      <td>{(set.weight * (1+(0.0334*set.reps))).toFixed(1)}</td>
                      <td>
                        <button
                        >
                          Delete set
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        ))}
      <p>
        <Link
          className="btn btn-info1"
          to={`/workout-creator/${id}`}
        >
          Add exercises
        </Link>
        <Link className="btn btn-info" to={`/app`}>
          Back
        </Link>
      </p>
    </div>
  );
}

export default WorkoutDetails;
