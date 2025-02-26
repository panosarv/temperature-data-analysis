import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import  GroupCheckbox  from "./GroupCheckbox.jsx"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts"



//The transformData function processes a rawData object containing numerical data categorized by months and years. 
//It transforms this data into an array of objects, where each object represents a specific year with its corresponding month-wise data.
const transformData = (rawData) => {
  const years = Object.keys(rawData["Jan"]) // Assuming 'Jan' has all the years
  return years.map((year) => {
    const entry = { year: parseInt(year, 10) }
    Object.keys(rawData).forEach((month) => {
      entry[month] = parseFloat(rawData[month][year]) || null // Handle invalid values
    })
    return entry
  })
}
//The getAxisYDomain function calculates the minimum and maximum values (Y-axis domain) for a specified range of years from the given data. 
//It evaluates specific keys within each data entry, ignoring invalid or missing values, and applies an optional offset to the result.
const getAxisYDomain = (from, to, data, keys, offset) => {
  const refData = data.filter((d) => d.year >= from && d.year <= to)
  console.log(refData)
  let bottom = Infinity
  let top = -Infinity

  refData.forEach((d) => {
    keys.forEach((key) => {
      if (d[key] !== null && !isNaN(d[key])) {
        if (d[key] > top) top = d[key]
        if (d[key] < bottom) bottom = d[key]
      }
    })
  })

  return [Math.floor(bottom) - offset, Math.ceil(top) + offset]
}
function DataPerMonthGraph() {
  const [data, setData] = useState([])
  const [months, setMonths] = useState([])
  const [selectedMonths, setSelectedMonths] = useState([])
  const [zoomState, setZoomState] = useState({
    refAreaLeft: "",
    refAreaRight: "",
    left: "dataMin",
    right: "dataMax",
    top: "dataMax+1",
    bottom: "dataMin-1",
  })

  //API call to fetch data from the backend
  const getDataPerMonth = async () => {
    const userId = sessionStorage.getItem("user_id")
    console.log('userId',userId)
    const response = await fetch("http://127.0.0.1:8000/api/graph/dataPerMonth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user_id" : userId
        },
        
        
        
    })
    const rawData = await response.json()
    const transformedData = transformData(rawData)
    setData(transformedData)
    const monthList = Object.keys(rawData)
    setMonths(monthList)
    setSelectedMonths(monthList)
  }

  const handleMonthSelect = (selectedIds) => {
    setSelectedMonths(selectedIds)
  }

  useEffect(() => {
    getDataPerMonth()
  }, [])

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = zoomState

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setZoomState((prev) => ({
        ...prev,
        refAreaLeft: "",
        refAreaRight: "",
      }))
      return
    }

    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft]

    const [bottom, top] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      data,
      months,
      1
    )

    setZoomState((prev) => ({
      ...prev,
      refAreaLeft: "",
      refAreaRight: "",
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    }))
  }

  const zoomOut = () => {
    setZoomState({
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin-1",
    })
  }

  return (
    <div className="w-full flex flex-col md:flex-row p-4 justify-center items-start gap-4">
      <div className="w-full md:w-64 p-4 border rounded-lg bg-white shadow-sm">
      <GroupCheckbox
          options={months.map((month) => ({ id: month, label: month }))}
          selectedItems={selectedMonths} 
          onChange={handleMonthSelect}   
        />

      </div>
      <div className="w-full md:flex-1" style={{userSelect:"none"}}>
        <div className="highlight-bar-charts mb-4"
        style={{userSelect:"none",width:"100%"}}>
          <Button onClick={zoomOut} variant="outline">
            Zoom Out
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            onMouseDown={(e) =>
              setZoomState((prev) => ({ ...prev, refAreaLeft: e.activeLabel }))
            }
            onMouseMove={(e) =>
              zoomState.refAreaLeft &&
              setZoomState((prev) => ({ ...prev, refAreaRight: e.activeLabel }))
            }
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              allowDataOverflow
              dataKey="year"
              type="number"
              domain={[zoomState.left, zoomState.right]}
            />
            <YAxis allowDataOverflow domain={[zoomState.bottom, zoomState.top]} />
            <Tooltip />
            {selectedMonths.map((month, index) => (
              <Line
                key={month}
                type="monotone"
                dataKey={month}
                stroke={`hsl(${(index * 360) / months.length}, 70%, 50%)`}
                dot={false}
              />
            ))}
            {zoomState.refAreaLeft && zoomState.refAreaRight ? (
              <ReferenceArea
                x1={zoomState.refAreaLeft}
                x2={zoomState.refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DataPerMonthGraph