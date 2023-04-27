import React, { useState, useEffect } from 'react';
import './UserDetails.css';
import { Container, Row, Col, Image } from 'react-bootstrap';
import majk from './pngs/majk.png'; // import your logo image
function UserDetails() {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3001/userData", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        token: window.localStorage.getItem("token"),
                    }),
                });
                const data = await response.json();
                setUserData(data.data);
            } catch (error) {
                console.log("Error occurred while fetching data:", error);
            }
        };
        fetchUserData();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

        return (
            <Container className="mt-5 custom-background">
                <Row>
                    <Col md={3}>
                        <Image
                            src={majk}
                            roundedCircle
                            className="mb-3"
                            style={{width:"200px",height:"200px"}}
                        />
                        <h4>{userData.firstname} {userData.lastname}</h4>
                        <p>{userData.email}</p>
                        <h2>Body measurements</h2>
                        <ul>
                            <li>Height: 188cm</li>
                            <li>Weight: 95kg</li>
                            <li>Biceps size: 41cm</li>
                        </ul>
                    </Col>
                    <Col md={9}>
                        <h2>About Me</h2>
                        <p>
                            xddddddd
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }

    export default UserDetails;