import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Route } from 'react-router-dom';

function WorkoutCreator({ match, history }) {
  const { id } = match.params;
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = useState([]);

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
    if (selected && selected._id) { // add null check
      console.log('Selected exercise key:', selected._id);
    }
  };

  const handleAddExercise = () => {
    if (!selectedExercise) {
      console.log('No exercise selected');
      return;
    }

    Axios.put(`http://localhost:3001/addExerciseToWorkout/${id}`, {
      exercise: selectedExercise,
      sets: sets,
    })
      .then((response) => {
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
    <div>
      {sets.map((set, index) => (
        <div key={index}>
          <input
            type="number"
            placeholder="Reps"
            name="reps"
            value={set.reps}
            onChange={(event) => handleSetsChange(event, index)}
          />
          <input
            type="number"
            placeholder="Weight"
            name="weight"
            value={set.weight}
            onChange={(event) => handleSetsChange(event, index)}
          />
          <button onClick={() => handleRemoveSet(index)}>Remove Set</button>
        </div>
      ))}
      <button onClick={handleAddSet}>Add Set</button>
    </div>
  );

  return (
    <div>
       <button name="backbutton" onClick={() => { window.location.href = `/workout/${id}`; }} > Back</button>
      <h1>Add Exercise to Workout</h1>
      <div>ID: {id}</div> {/* Dodaj ten wiersz */}
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
          <h2>{selectedExercise.name}</h2>
          {setsForm}
          <button onClick={handleAddExercise}>Add Exercise</button>
        </div>
      )}
    </div>
  );
}

export default WorkoutCreator;
