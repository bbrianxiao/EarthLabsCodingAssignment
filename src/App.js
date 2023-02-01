// import logo from "./logo.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {decode} from "html-entities";

function App() {
  const [bpi, setBpi] = useState({});
  const [filteredBpi, setFilteredBpi] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchTime, setFetchTime] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    console.log(res);
    setBpi(res.data.bpi);
    setFilteredBpi(res.data.bpi);
    setLoading(false);
    const fetchTime = new Date().toLocaleString();
    setFetchTime(fetchTime);
    setLoading(false);
    setUpdatedTime(res.data.time.updated);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (e) => {
    const filterValue = e.target.value.toLowerCase();
    setFilteredBpi(
      Object.keys(bpi)
        .filter((currency) => currency.toLowerCase().includes(filterValue))
        .reduce((acc, cur) => ({ ...acc, [cur]: bpi[cur] }), {})
    );
  };

  const handleSort = (e) => {
    setFilteredBpi(
      Object.keys(filteredBpi)
        .sort()
        .reduce((acc, cur) => ({ ...acc, [cur]: filteredBpi[cur] }), {})
    );
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
        <h1>Currency Rate Exchanger Created By Brian Xiao</h1>
          <input
            type="text"
            placeholder="Filter by code"
            onChange={handleFilter}
          />
          <button id="sortbtn" onClick={handleSort}>Sort</button>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Symbol</th>
                <th>Rate</th>
                <th>Description</th>
                <th>Rate Float</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(filteredBpi).map((currency) => (
                <tr key={currency}>
                  <td>{currency}</td>
                  <td>{decode(filteredBpi[currency].symbol)}</td>
                  <td>{filteredBpi[currency].rate}</td>
                  <td>{filteredBpi[currency].description}</td>
                  <td>{filteredBpi[currency].rate_float}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Data Last Updated at: {updatedTime}</p>
          <p>Last Refreshed at: {fetchTime}</p>

          <button id="getdatabtn" onClick={fetchData}>Refresh Data</button>
        </>
      )}
    </div>
  );
}

export default App;
