import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import './WorkoutCreator.css'

function WorkoutCreator({ match, history }) {
  const { id } = match.params;
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSets([]);
    setSelectedExercise(null);
  }

  const handleShow = () => setShow(true);

  useEffect(() => {
    Axios.get('http://localhost:3001/getExercises')
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selected = exercises.find((exercise) => exercise._id === selectedId);
    setSelectedExercise(selected);
    if (selected && selected._id) {
      console.log('Selected exercise key:', selected._id);
    }
  };

  const handleAddExercise = () => {
   

    const emptySetIndex = sets.findIndex((set) => set.reps === '' || set.weight === '');
    if (emptySetIndex !== -1) {
      alert(`Set ${emptySetIndex + 1} is empty`);
      return;
    }

    if (sets.length === 0 || !sets.every((set) => set.reps !== '' && set.weight !== '')) {
      alert('All sets must be filled');
      return;
    }

    Axios.put(`http://localhost:3001/addExerciseToWorkout/${id}`, {
      exercise: selectedExercise,
      sets: sets,
    })
      .then((response) => {
        alert("EXERCISE ADDED");
        setSets([]);
        setSelectedExercise(null);
        console.log('Updated workout:', response.data);
        console.log('New exercise key:', response.data.exercise._id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSetsChange = (event, index) => {
    const { name, value } = event.target;
    const newSets = [...sets];
    newSets[index][name] = value;
    setSets(newSets);
  };

  const handleAddSet = () => {
    setSets([...sets, { reps: '', weight: '' }]);
  };

  const handleRemoveSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const setsForm = (
    <div className="sets-form">
      <Button className="my-button" onClick={handleAddSet}>Add Set</Button>
      {sets.map((set, index) => (
        <div key={index}>
          <h5>Set {index + 1}: {set.index}</h5>
          <input
            min="1"
            max="100"
            type="number"
            placeholder="Repss"
            name="reps"
            value={set.reps}
            onChange={(event) => handleSetsChange(event, index)}
          />
          <input
            min="0"
            max="1000"
            type="number"
            placeholder="Weight"
            name="weight"
            value={set.weight}
            onChange={(event) => handleSetsChange(event, index)}
          />
          <Button className="my-button" onClick={() => handleRemoveSet(index)}>Remove Set</Button>

        </div>
      ))}
      <Button className="my-button1" onClick={handleAddExercise}>Add Exercise</Button>
    </div>
  );

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <button name="backbutton" onClick={() => { window.location.href = `/workout/${id}`; }} > Back</button>

      <Modal show={show} onHide={handleClose} >

        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h4>Choose exercise:</h4>
          <select onChange={handleSelectChange}>
            <option value="">Select an exercise</option>
            {exercises.map((exercise) => (
              <option key={exercise._id} value={exercise._id}>
                {exercise.name}
              </option>
            ))}
          </select>
          {selectedExercise && (
            <div>
              <h4>Choosen exercise: {selectedExercise.name}</h4>
              {setsForm}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div >
  );
}

export default WorkoutCreator;
