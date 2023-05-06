import React, { useState, useEffect } from 'react';
import { useParams, Link, Route } from 'react-router-dom';
import Axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './WorkoutDetails.css';
import WorkoutCreator from './WorkoutCreator';
import Image from 'react-bootstrap/Image';
import majk from './pngs/majk.png'; // import your logo image
import ModalHeader from 'react-bootstrap/esm/ModalHeader';



function WorkoutDetails() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null); // dodajemy stan dla wybranego ćwiczenia


  const callModal = (exercise) => {
    setShowModal(true);
    setSelectedExercise(exercise)
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExercise(null);

  };



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



  return (
    <div className="workout-details-container">
      <Modal show={showModal} onHide={closeModal}>
        <ModalHeader closeButton></ModalHeader>
        <Modal.Body>
          <td className="exercise-image-cell1"><Image src={selectedExercise && selectedExercise.exerciseGif} /></td>
          <h5 className='h5-1'>{selectedExercise && selectedExercise.exerciseName}</h5>
          {selectedExercise &&
            <>
              <Table className='table3' bordered>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight</th>
                    <th></th>
                    <th>Reps</th>
                    <th>Max</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExercise.sets &&
                    selectedExercise.sets.map((set, index) => (
                      <tr key={set._id}>
                        <td>{index + 1}</td>
                        <td>{set.weight}</td>
                        <td>x</td>
                        <td>{set.reps}</td>
                        <td>{(set.weight * (1 + (0.0334 * set.reps))).toFixed(1)}</td>
                        <td>
                          <Button variant='success'>Edit</Button>
                          <Button variant='secondary'>x</Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          }
        </Modal.Body>
      </Modal>
      {workout && (
        <Table className='table1' bordered>
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
      )}
      <p>
        <div>
          <WorkoutCreator workout={workout} id={id} updateExerciseList={updateExerciseList} /></div>
      </p>
      <Table className="table2" bordered>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {workout && workout.exercises && workout.exercises.map((exercise, index) => (
            <tr key={exercise.exercise._id}>
              <td>{index + 1}</td>
              <td className="exercise-image-cell"><Image src={exercise.exercise.gifUrl} /></td>
              <td>
                <h5>{exercise.exercise.name}</h5>
                Bodypart: {exercise.exercise.bodyPart}
                <br></br>
                Muscle: {exercise.exercise.target}
                <br></br>
                Equipment: {exercise.exercise.equipment}
                {exercise.sets &&
                  exercise.sets.map((set, index) => (
                    <div key={set._id}>
                      {set.weight} kg x {set.reps} reps
                    </div>
                  ))}

              </td>
              <td>
                <Button variant="success" onClick={() => callModal({ exercise, sets: exercise.sets, index, exerciseName: exercise.exercise.name, exerciseGif: exercise.exercise.gifUrl })}> View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div >
  );
}

export default WorkoutDetails;
