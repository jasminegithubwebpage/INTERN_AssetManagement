import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Navbar from '../components/Navbar';
import axiosInstance from '../axiosInstance';
const NewIssuePage = () => {
  const [assetIds, setAssetIds] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1); // Default: Open
  const [hardwareComment, setHardwareComment] = useState('');
  const [emp, setEmpId] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false)
//   const location = useLocation(); // Get location object from React Router
  const { empId } = useParams();
   // Avoid setting empId on every render
  //  console.log(empId);
   useEffect(() => {
    if (empId) {
      setEmpId(empId); // Only set empId if it's not undefined or null
    }
  }, [empId]);
  
  useEffect(() => {
    if (emp) {
      // Perform Axios call when emp is set
      axiosInstance.get(`/issues/a/${emp}`)
        .then(response => {
          // Assuming response.data is the array of assets
          setAssetIds(response.data);
        })
        .catch(error => console.error('Error fetching asset data:', error));
    }
  }, [emp]);
  

  // console.log(selectedAsset);
  const handleSubmit = (event) => {
    event.preventDefault();

    // Calculate IST time by subtracting 330 minutes
    const date = new Date();
    date.setMinutes(date.getMinutes() - 330); // Convert to IST

    const timeInIST = date.toISOString(); // Store in ISO format

    // Prepare the data to send to the backend
    const data = {
      // Auto-generate ISU000001 style number
      t_isdt: timeInIST,
      t_asno: selectedAsset,
      t_emno: empId, // Using empId consistently here
      t_idsc: description,
      t_ists: 1,
      t_hcmt: '',
      t_cldt: new Date('1970-01-01').toISOString(), // Converts the date to a valid ISO string
      t_Refcntd: 0, // Default reference count (adjust as needed)
      t_Refcntu: 0,
     // Default reference count (adjust as needed)
    };

    // Send data to backend to store it in the database
    axiosInstance.post('/issues/submit', data)
    .then(response => {
      console.log("Backend",response);
      setMessage('Issue submitted successfully');
      setIsSuccess(true); 
      // navigate(`/issues/${emp}`); // Redirect to the issue list after submission
    })
    .catch(error => {
      console.error('Error submitting the issue:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
      setMessage('Failed to submit issue');
      setIsSuccess(false);
    });
  }  

  const assetOptions = assetIds.map(asset => ({
    value: asset.t_asno, // Asset ID
    label: `${asset.t_asno} - ${asset.t_nama}`, // Asset ID and Name
  }));
  
  
  // Ensure you initialize `selectedAsset` properly
  const handleAssetChange = (selectedOption) => {
    setSelectedAsset(selectedOption ? selectedOption.value : '');
  };
  

  return (
    <> <Navbar /> 
    <div className="max-w-4xl mx-auto mt-3 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Report a New Issue</h1>

      {/* Back Button */}
      <button
        onClick={() => navigate(`/issues/${emp}`)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
      >
        ← Back to Issue Form
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Dropdown with React Select */}
        <div>
          <label htmlFor="asset" className="block text-sm font-medium text-gray-600 mb-1">
            Select Asset
          </label>
          <Select
            id="asset"
            options={assetOptions}
            value={assetOptions.find(option => option.value === selectedAsset)}
            onChange={(selectedOption) => setSelectedAsset(selectedOption.value)}
            placeholder="Search and select an asset..."
            isSearchable
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Status */}
        {/* <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(parseInt(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Open</option>
            <option value={2}>In Progress</option>
            <option value={3}>Closed</option>
          </select>
        </div> */}

        {/* Hardware Comment */}
        {status !== 1 && (
          <div>
            <label htmlFor="hardwareComment" className="block text-sm font-medium text-gray-600 mb-1">
              Hardware Engineer Comment
            </label>
            <textarea
              id="hardwareComment"
              value={hardwareComment}
              onChange={(e) => setHardwareComment(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>
         {/* Display the message near the submit button */}
      {message && (
        <div style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>
          {message}
        </div>
      )}
      </form>
    </div>
    </>
  );
};

export default NewIssuePage;
