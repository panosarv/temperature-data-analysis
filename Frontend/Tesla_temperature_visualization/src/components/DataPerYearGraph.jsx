import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch"; 

// Transform the data into a usable format for the graph
const transformData = (data) => {
  const availableYears = ["All"];
  const monthlyData = [];
  const annualAverageData = [];
  const yearSet = new Set();

  for (const year in data) {
    yearSet.add(parseInt(year));
    availableYears.push(year);

    if (data[year]["Annual"] !== undefined && data[year]["std"] !== undefined) {
      annualAverageData.push({
        year,
        "Yearly avg temperature": data[year]["Annual"],
        "std bounds": [
          data[year]["Annual"] - data[year]["std"],
          data[year]["Annual"] + data[year]["std"],
        ],
      });
    }

    Object.keys(data[year]).forEach((month) => {
      if (month !== "Annual" && month !== "std" && month !== "mean") {
        monthlyData.push({
          year,
          month: `${month}-${year}`,
          "Temperature per month": data[year][month],
        });
      }
    });
  }

  const yearRange = [...yearSet].sort((a, b) => a - b);
  return { availableYears, monthlyData, annualAverageData, yearRange };
};

function DataPerYearGraph() {
  const [graphData, setGraphData] = useState({
    availableYears: [],
    monthlyData: [],
    annualAverageData: [],
    yearRange: [],
  });
  const [selectedYear, setSelectedYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const [sliderRange, setSliderRange] = useState([0, 0]); // Stores the selected slider range
  const [showSTD, setShowSTD] = useState(true); // Controls the visibility of the std

  const getDataPerYear = async () => {
    try {
      const userId = sessionStorage.getItem("user_id"); // Retrieve user_id from sessionStorage
      if (!userId) {
        throw new Error("User ID not found in session storage.");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/graph/dataPerYear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user_id": userId,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      const { availableYears, monthlyData, annualAverageData, yearRange } =
        transformData(data);

      setGraphData({ availableYears, monthlyData, annualAverageData, yearRange });
      setSliderRange([yearRange[0], yearRange[yearRange.length - 1]]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataPerYear();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const filteredData =
    selectedYear === "All"
      ? graphData.annualAverageData.filter(
          (entry) =>
            parseInt(entry.year) >= sliderRange[0] &&
            parseInt(entry.year) <= sliderRange[1]
        )
      : graphData.monthlyData.filter((entry) => entry.year === selectedYear);

  return (
    <div className="w-full flex flex-col p-4 justify-center items-start gap-4">
      {/* Control Panel */}
      <div className="w-full md:w-64 p-4 border rounded-lg bg-white shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedYear === "All" ? "Year: All" : `Year: ${selectedYear}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-40 overflow-y-scroll"
            sideOffset={4}
            align="start"
          >
            {graphData.availableYears.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Button */}
        {selectedYear !== "All" && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setSelectedYear("All")}
          >
            Reset
          </Button>
        )}

        {/* Standard Dev Toggle */}
        {selectedYear === "All" && (
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              checked={showSTD}
              onCheckedChange={(value) => setShowSTD(value)}
            />
            <span>Show Standard deviation</span>
          </div>
        )}
      </div>

      {/* Graph */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={filteredData}
            style={selectedYear !== "All" ? { display: "none" } : { display: "block" }}
            className="transition-opacity duration-500"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Render Banded Area */}
            {showSTD && (
              <Area
                type="monotone"
                dataKey="std bounds"
                stroke="none"
                fill="rgba(135, 206, 235, 0.3)" 
              />
            )}

            {/* Render Yearly Average Line */}
            <Line
              type="natural"
              dataKey="Yearly avg temperature"
              stroke="black"
              strokeWidth={4}
              activeDot={{
                onClick: (event, payload) => setSelectedYear(payload.payload.year),
                style: { cursor: "pointer" }, 
              }}
            />
          </ComposedChart>
          <LineChart
            data={filteredData}
            style={selectedYear === "All" ? { display: "none" } : { display: "block" }}
            className='transition-opacity duration-500'
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={selectedYear === "All" ? "year" : "month"}
              tickFormatter={(tick) =>
                selectedYear === "All" ? tick : tick.split("-")[0]
              }
            />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Render Lines */}
            <Line
              type="natural"
              dataKey="Temperature per month"
              stroke="black"
              strokeWidth={4}
             
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Year Range Slider */}
      {selectedYear === "All" && (
        <div className="w-full flex flex-col items-center mt-4">
          <p className="mb-2">
            Range: {sliderRange[0]} - {sliderRange[1]}
          </p>
          <Slider
            min={graphData.yearRange[0]}
            max={graphData.yearRange[graphData.yearRange.length - 1]}
            value={sliderRange}
            onValueChange={(newRange) => setSliderRange(newRange)}
            step={1}
            className="w-full"
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
    </div>
  );
};

export default DataPerYearGraph;
