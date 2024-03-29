import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";

const Camera = ({ onCapture }) => {
  const [stream, setStream] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const videoRef = React.createRef();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        setShowModal(true);
      })
      .catch((error) => {
        // Handle permission denied error
        if (error.name === "NotAllowedError") {
          console.error("Permission to access camera was denied");
        } else {
          console.error("Error accessing camera:", error);
        }
      });
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setShowModal(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL("image/png");
      onCapture(imageDataURL);
      setShowModal(false);
      stopCamera();
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Capture Sudoku Image</h5>
                <button
                  type="button"
                  className="btn-close modal-close"
                  aria-label="Close"
                  onClick={stopCamera}
                ></button>
              </div>
              <div className="modal-body">
                {stream && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100"
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={captureImage}
                >
                  Capture
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={stopCamera}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button onClick={startCamera} className="btn btn-primary me-2">
        <FaCamera />
      </button>
    </>
  );
};

export default Camera;
