import { useState, useEffect } from "react";
import groupsData from "./groups.json";
import "./App.sass";
import config from "./config";

const Monitors = () => {
  const [apiData, setApiData] = useState({ monitors: [] });
  const [rawData, setRawData] = useState("");
  const [displayCategory, setDisplayCategory] = useState("All");
  const [upMonitors, setUpMonitors] = useState([]);
  const [downMonitors, setDownMonitors] = useState([]);
  const [pausedMonitors, setPausedMonitors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = config.UPTIME_ROBOT_API_KEY;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          api_key: `${apiKey}`,
          format: "json",
          logs: "1",
        }),
      };

      try {
        const response = await fetch(
          "https://api.uptimerobot.com/v2/getMonitors",
          requestOptions
        );

        if (!response.ok) {
          throw Error("Network response was not ok");
        }

        const data = await response.json();
        setApiData(data);
        setRawData(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const upMonitorsArray = apiData.monitors.filter(
      (monitor) => monitor.status === 2
    );
    const downMonitorsArray = apiData.monitors.filter(
      (monitor) => monitor.status === 9
    );
    const pausedMonitorsArray = apiData.monitors.filter(
      (monitor) => monitor.status === 0
    );
    setUpMonitors(upMonitorsArray);
    setDownMonitors(downMonitorsArray);
    setPausedMonitors(pausedMonitorsArray);
  }, [apiData]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Paused";
      case 2:
        return "OK";
      case 9:
        return "Down";
      default:
        return "Unknown";
    }
  };

  function getStatusBackgroundColor(status) {
    switch (status) {
      case 0:
        return "#687790";
      case 2:
        return "#4DA74D";
      case 9:
        return "#BA3637";
      default:
        return "inherit";
    }
  }

  const filterMonitorsByCategory = () => {
    switch (displayCategory) {
      case "All":
        return apiData.monitors;
      case "Group1":
        return apiData.monitors.filter((monitor) =>
          groupsData.Group1.includes(monitor.id)
        );
      case "Group2":
        return apiData.monitors.filter((monitor) =>
          groupsData.Group2.includes(monitor.id)
        );
      default:
        return apiData.monitors;
    }
  };

  return (
    <div className="container">
      <div className="heading-container">
        <h1 className="heading">MONITOORING</h1>
      </div>
      <div className="overall-status-section">
        <div className="overall-status-container">
          <div className="overall-status">
            <button
              className="status-btn btn-up"
              onClick={() => setDisplayCategory("UP")}
            >
              <a className="status-number">{upMonitors.length}</a>
            </button>
            <button
              className="status-btn btn-down"
              onClick={() => setDisplayCategory("DOWN")}
            >
              <a className="status-number">{downMonitors.length}</a>
            </button>
            <button
              className="status-btn btn-paused"
              onClick={() => setDisplayCategory("PAUSED")}
            >
              <a className="status-number">{pausedMonitors.length}</a>
            </button>
          </div>
        </div>
      </div>
      <div className="groups">
        <button className="group-btn" onClick={() => setDisplayCategory("All")}>
          All
        </button>
        <button
          className="group-btn"
          onClick={() => setDisplayCategory("Group1")}
        >
          Group1
        </button>
        <button
          className="group-btn"
          onClick={() => setDisplayCategory("Group2")}
        >
          Group2
        </button>
      </div>
      <div className="monitors-section">
        {displayCategory === "UP" && (
          <div className="monitors-container">
            {upMonitors.map((monitor) => (
              <div className="monitor-item" key={monitor.id}>
                <div className="monitor-item-left">
                  <a
                    className="monitor-name"
                    href={monitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {monitor.friendly_name}
                  </a>
                  <p className="monitor-type">Type: {monitor.type === 1 ? "HTTP" : `Keyword "${monitor.keyword_value}"`}</p>
                </div>
                <div className="monitor-item-right" style={{ background: getStatusBackgroundColor(monitor.status) }}>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayCategory === "DOWN" && (
          <div className="monitors-container">
            {downMonitors.map((monitor) => (
              <div className="monitor-item" key={monitor.id}>
                <div className="monitor-item-left">
                  <a
                    className="monitor-name"
                    href={monitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {monitor.friendly_name}
                  </a>
                  <p className="monitor-type">Type: {monitor.type === 1 ? "HTTP" : `Keyword "${monitor.keyword_value}"`}</p>
                </div>
                <div className="monitor-item-right" style={{ background: getStatusBackgroundColor(monitor.status) }}>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayCategory === "PAUSED" && (
          <div className="monitors-container">
            {pausedMonitors.map((monitor) => (
              <div className="monitor-item" key={monitor.id}>
                <div className="monitor-item-left">
                  <a
                    className="monitor-name"
                    href={monitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {monitor.friendly_name}
                  </a>
                  <p className="monitor-type">Type: {monitor.type === 1 ? "HTTP" : `Keyword "${monitor.keyword_value}"`}</p>
                </div>
                <div className="monitor-item-right" style={{ background: getStatusBackgroundColor(monitor.status) }}>
                </div>
              </div>
            ))}
          </div>
        )}

        {displayCategory !== "UP" &&
          displayCategory !== "DOWN" &&
          displayCategory !== "PAUSED" && (
            <div className="monitors-container">
              {filterMonitorsByCategory().map((monitor) => (
                <div className="monitor-item" key={monitor.id}>
                  <div className="monitor-item-left">
                    <a
                      className="monitor-name"
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {monitor.friendly_name}
                    </a>
                    <p>Type: {monitor.type === 1 ? <span className="monitor-type">HTTP</span> : <span><span className="monitor-type">Keyword</span><span className="monitor-keyword-value">"{monitor.keyword_value}"</span></span>}</p>
                  </div>
                <div className="monitor-item-right" style={{ background: getStatusBackgroundColor(monitor.status) }}>
                </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default Monitors;
