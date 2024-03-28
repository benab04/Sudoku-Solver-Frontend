import React, { useState } from "react";
import Camera from "./Camera";
import SudokuGrid from "./SudokuGrid";
import { FaUpload } from "react-icons/fa6";
import "./styles.css";
import { FaTrash } from "react-icons/fa";

const base_url = process.env.REACT_APP_BACKEND_URL;
const App = () => {
  const defaultGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [capturedImage, setCapturedImage] = useState(null);
  const [solvedSudoku, setSolvedSudoku] = useState(null);
  const [sudokuError, setSudokuError] = useState(null);
  const [initialGrid, setInitialGrid] = useState(defaultGrid);

  const handleCapture = (imageDataURL) => {
    setCapturedImage(imageDataURL);
  };

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        setCapturedImage(imageDataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmission = () => {
    if (capturedImage) {
      sendDataToServer(capturedImage);
    } else {
      alert("Please capture or select an image first.");
    }
  };

  const sendDataToServer = (imageDataURL) => {
    setSolvedSudoku(null);
    setSudokuError(null); // Reset error state

    fetch(`${base_url}extract/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageDataURL: imageDataURL }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(JSON.parse(data.Unsolved));
        setSolvedSudoku(data.solved);
        // setCapturedImage(null);
        setInitialGrid(JSON.parse(data.Unsolved)); // Set initial grid to Unsolved
        setSudokuError(null); // Reset error state
      })
      .catch((error) => {
        console.error("Error:", error);
        setSolvedSudoku(null);
        setSudokuError("Error occurred while extracing digits.");
      });
  };

  return (
    <div className="wrapper-div  text-center mt-5 mx-0">
      <div className="container container-fluid py-4 px-0 mx-0">
        <h1 className="heading mb-4">Sudoku Solver</h1>

        <div className="row flex flex-direction-column justify-content-center align-items-center">
          <div className="col-md-6 mb-3">
            <Camera onCapture={handleCapture} className="my-3" />
            <label
              htmlFor="fileInput"
              className="btn upload-button btn-primary my-3"
            >
              <FaUpload />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileInput}
              className="visually-hidden"
            />
            <button onClick={handleSubmission} className="btn btn-primary mx-2">
              Extract
            </button>
            {capturedImage && (
              <div className="image-section">
                <div className=" captured-image">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="img-fluid mt-3 captured-image"
                    style={{ maxWidth: "400px", width: "100%", height: "auto" }}
                  />
                  <label
                    className="btn delete-btn btn-primary"
                    onClick={() => setCapturedImage(null)}
                  >
                    <FaTrash />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6"></div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            {solvedSudoku && (
              <img
                src={`data:image/png;base64,${solvedSudoku}`}
                alt="Solved"
                className="img-fluid"
                style={{ maxWidth: "400px", width: "100%", height: "auto" }}
              />
            )}
            {sudokuError !== null && sudokuError !== "" && (
              <h4>{sudokuError}</h4>
            )}
          </div>
        </div>
        {initialGrid && (
          <SudokuGrid initialGrid={initialGrid} defaultGrid={defaultGrid} />
        )}
      </div>
    </div>
  );
};

export default App;
