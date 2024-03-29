import React, { useEffect, useState } from "react";
import Camera from "./Camera";
import SudokuGrid from "./SudokuGrid";
import { FaUpload } from "react-icons/fa6";
import "./styles/styles.css";
import { FaTrash } from "react-icons/fa";
import Loader from "./Loader";
import { GoInfo } from "react-icons/go";
import "./styles/SudokuGrid.css";
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
  const [received, setReceived] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(base_url)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
            setReceived(true);
            clearInterval(interval);
          }
        })
        .catch((err) => console.log(err));
    }, 3000);
  }, []);

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

  const resetAll = () => {
    setCapturedImage(null);
    setSudokuError(null);
  };

  const sendDataToServer = (imageDataURL) => {
    setSolvedSudoku(null);
    setSudokuError(null); // Reset error state
    setReceived(false);
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
        setReceived(true);
        setCapturedImage(`data:image/png;base64,${data.Detected_encoded}`);
        setSolvedSudoku(data.solved);
        setInitialGrid(JSON.parse(data.Unsolved)); // Set initial grid to Unsolved
        setSudokuError(null); // Reset error state
      })
      .catch((error) => {
        console.error("Error:", error);
        setReceived(true);
        setSolvedSudoku(null);
        setSudokuError("Error occurred while extracing digits.");
      });
  };

  return (
    <div className="wrapper-div  text-center mt-5 mx-0">
      <div className="container container-fluid py-4 px-0 mx-0">
        <h1 className="heading mb-4">Sudoku Solver</h1>

        <div className="row flex flex-direction-column justify-content-center align-items-center mx-0">
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
              <div className="image-section container-fluid p-4">
                <div className=" captured-image">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="img-fluid mt-3 captured-image "
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
              <div className="d-flex align-items-center justify-content-center ">
                <div
                  className="container container-fluid d-flex align-items-center justify-content-center alert-error alert alert-danger mx-4 p-2 "
                  role="alert"
                >
                  <GoInfo />
                  <h6 className="error-text mx-3">{sudokuError}</h6>
                </div>
              </div>
            )}
          </div>
        </div>
        {!received && <Loader />}

        {received && initialGrid && (
          <SudokuGrid
            initialGrid={initialGrid}
            defaultGrid={defaultGrid}
            resetAll={resetAll}
          />
        )}
      </div>
    </div>
  );
};

export default App;
