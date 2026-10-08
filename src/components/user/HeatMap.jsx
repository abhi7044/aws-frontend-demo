import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

const pad = (n) => String(n).padStart(2, "0");

// Library ko date "YYYY/MM/DD" format me chahiye
const formatDate = (d) =>
  `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;

// Random activity generate karne wala function
const generateActivityData = (startDate, endDate) => {
  const data = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    data.push({
      date: formatDate(current),
      count: Math.floor(Math.random() * 50),
    });
    current.setDate(current.getDate() + 1);
  }

  return data;
};

const panelColors = {
  0: "#2d333b",
  8: "#0e4429",
  20: "#006d32",
  32: "#26a641",
  45: "#39d353",
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  useEffect(() => {
    setActivityData(generateActivityData(startDate, endDate));
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "800px", color: "white" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={startDate}
        endDate={endDate}
        rectSize={13}
        space={3}
        rectProps={{ rx: 2.5 }}
        panelColors={panelColors}
        legendCellSize={0}
      />
    </div>
  );
};

export default HeatMapProfile;