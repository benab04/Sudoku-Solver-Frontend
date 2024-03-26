import React, { useEffect, useState } from "react";
import "./SudokuGrid.css"; // Import the CSS file
const base_url = process.env.REACT_APP_BACKEND_URL;
const SudokuGrid = ({ initialGrid }) => {
  const [grid, setGrid] = useState(initialGrid);
  const [sudokuError, setSudokuError] = useState(null);

  useEffect(() => {
    // Update the grid state when initialGrid prop changes
    setGrid(initialGrid);
  }, [initialGrid]);

  const handleChange = (e, row, col) => {
    const updatedGrid = [...grid];
    const value = parseInt(e.target.value, 10) || 0; // Convert to integer, fallback to 0 if not a valid number
    updatedGrid[row][col] = value;
    setGrid(updatedGrid);
  };

  const handleSubmit = () => {
    setSudokuError(null);

    // Send the grid to the server
    fetch(`${base_url}solve/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ grid: grid }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 204) {
          setSudokuError("No solution found. Try checking the values again");
          throw new Error("No solution found for the Sudoku puzzle");
        } else {
          setSudokuError("Something went wrong. Please try again later.");
          throw new Error("Something went wrong. Please try again later.");
        }
      })
      .then((data) => {
        if (data.solved) {
          setGrid(JSON.parse(data.solved));
        }
        if (data.error) {
          setSudokuError(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="sudoku-container d-flex flex-column justify-content-center align-items-center">
      {sudokuError && (
        <div className="container text-align-center container-fluid my-3 ">
          <h5>{sudokuError}</h5>
        </div>
      )}
      <table className="sudoku-table">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  id={`cell-${rowIndex}${colIndex}`}
                  className={`sudoku-cell ${
                    (rowIndex < 3 && colIndex < 3) ||
                    (rowIndex >= 3 &&
                      rowIndex < 6 &&
                      colIndex >= 3 &&
                      colIndex < 6) ||
                    (rowIndex >= 6 && colIndex >= 6)
                      ? "sudoku-cell-bold"
                      : ""
                  }`}
                >
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={cell === 0 ? "" : cell} // Display empty string if cell is 0
                    onChange={(e) => handleChange(e, rowIndex, colIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} className="btn btn-primary my-3 mx-2">
        Solve
      </button>
    </div>
  );
};

export default SudokuGrid;
