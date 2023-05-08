import React, { useState, useEffect } from 'react'
import Axios from 'axios';

function Exercises() {
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: 'https://exercisedb.p.rapidapi.com/exercises',
                headers: {
                    'X-RapidAPI-Key': '25fac427ebmshfd3bfe4f86e1cdcp16c50djsn9cb25b01059a',
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                }
            };

            try {
                const response = await Axios.request(options);
                setExercises(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {exercises.map((exercise) => (
                <div key={exercise.id}>
                    <h2>{exercise.id}</h2>
                    <h2>{exercise.name}</h2>
                    <img src={exercise.gifUrl} alt={exercise.name} />
                </div>
            ))}
        </div>
    );
}

export default Exercises;