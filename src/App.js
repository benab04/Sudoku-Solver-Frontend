import React, { useState } from "react";
import Camera from "./Camera";

const App = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [solvedSudoku, setSolvedSudoku] = useState(null);
  const [sudokuError, setSudokuError] = useState(null);

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

    fetch("http://127.0.0.1:8000/", {
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
        setSolvedSudoku(data.solved);
        setCapturedImage(null);
        setSudokuError(null); // Reset error state
      })
      .catch((error) => {
        console.error("Error:", error);
        setSolvedSudoku(null);
        setSudokuError("Error occurred while solving sudoku.");
      });
  };

  return (
    <div className="container text-center mt-5">
      <div className="card p-4">
        <h1 className="mb-4">Sudoku Solver</h1>
        <div className="row flex flex-direction-column justify-content-center align-items-center">
          <div className="col-md-6 mb-3">
            <Camera onCapture={handleCapture} className="my-3" />
            <label htmlFor="fileInput" className="btn btn-primary my-3">
              Choose File
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileInput}
              className="visually-hidden"
            />
            {capturedImage && (
              <div>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="img-fluid mt-3"
                  style={{ maxWidth: "400px", width: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <button onClick={handleSubmission} className="btn btn-primary">
              Submit
            </button>
          </div>
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
      </div>
    </div>
  );
};

export default App;
