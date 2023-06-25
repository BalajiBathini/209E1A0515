import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://104.211.219.98';

const TrainList = ({ trains }) => (
  <div>
    <h2>All Trains</h2>
    <table>
      <thead>
        <tr>
          <th>Train Number</th>
          <th>Train Name</th>
          <th>Departure Time</th>
          <th>Seats Available (Sleeper)</th>
          <th>Seats Available (AC)</th>
          <th>Price (Sleeper)</th>
          <th>Price (AC)</th>
        </tr>
      </thead>
      <tbody>
        {trains.map((train) => (
          <tr key={train.trainNumber}>
            <td>{train.trainNumber}</td>
            <td>{train.trainName}</td>
            <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</td>
            <td>{train.seatsAvailable.sleeper}</td>
            <td>{train.seatsAvailable.AC}</td>
            <td>{train.price.sleeper}</td>
            <td>{train.price.AC}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SingleTrain = ({ train }) => (
  <div>
    <h2>Train Details</h2>
    <table>
      <thead>
        <tr>
          <th>Train Number</th>
          <th>Train Name</th>
          <th>Departure Time</th>
          <th>Seats Available (Sleeper)</th>
          <th>Seats Available (AC)</th>
          <th>Price (Sleeper)</th>
          <th>Price (AC)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{train.trainNumber}</td>
          <td>{train.trainName}</td>
          <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</td>
          <td>{train.seatsAvailable.sleeper}</td>
          <td>{train.seatsAvailable.AC}</td>
          <td>{train.price.sleeper}</td>
          <td>{train.price.AC}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const App = () => {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await axios.post(`${API_BASE_URL}/train/auth`, {
          companyName: 'SVEC',
          ownerName: 'Balaji',
          ownerEmail: 'balajijr007@gmail.com',
          rollNo: '209e1a0515',
          clientID: 'b844d1b-2507-4e19-a133-56da35dc4efc',
          clientSecret: 'cTZZFWapmAOnXsex'
        });

        const { access_token } = authResponse.data;

        const trainsResponse = await axios.get(`${API_BASE_URL}/train/trains`, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });

        const filteredTrains = trainsResponse.data.filter(
          (train) =>
            train.departureTime.Hours > new Date().getHours() ||
            (train.departureTime.Hours === new Date().getHours() && train.departureTime.Minutes > new Date().getMinutes() + 30)
        );

        setTrains(filteredTrains);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleTrainClick = async (trainNumber) => {
    try {
      const authResponse = await axios.post(`${API_BASE_URL}/train/auth`, {
        companyName: 'SVEC',
        ownerName: 'Balaji',
        ownerEmail: 'balajijr007@gmail.com',
        rollNo: '209e1a0515',
        clientID: 'b844d1b-2507-4e19-a133-56da35dc4efc',
        clientSecret: 'cTZZFWapmAOnXsex'
      });

      const { access_token } = authResponse.data;

      const trainResponse = await axios.get(`${API_BASE_URL}/train/trains/${trainNumber}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      setSelectedTrain(trainResponse.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      {selectedTrain ? (
        <SingleTrain train={selectedTrain} />
      ) : (
        <TrainList trains={trains} />
      )}
    </div>
  );
};

export default App;
