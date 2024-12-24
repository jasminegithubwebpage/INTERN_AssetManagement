import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Adjust the import path
import { jwtDecode } from 'jwt-decode'; // Corrected import for jwt-decode
import Navbar from '../components/UserNavbar';
import Select from "react-select";

const NewIssuePage = () => {
  const [assetIds, setAssetIds] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [description, setDescription] = useState('');
  const [hardwareComment, setHardwareComment] = useState('');
  const [emp, setEmpId] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [issueStatus, setIssueStatus] = useState(1); // Renamed from 'status' to 'issueStatus'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored as 'token' in localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        const empId = decoded.id; // Extract empId from the decoded token
        setEmpId(empId); // Set the empId state
        // Fetch issues for the employee using empId
        axiosInstance.get(`/issues/a`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Use the token in the Authorization header
          },
        })
        .then((response) => {
          setAssetIds(response.data); // Assuming response.data is the array of assets
        })
        .catch((error) => {
          console.error('Error fetching asset data:', error);
        });
      } catch (error) {
        console.error('Token decoding error:', error);
      }
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Calculate IST time by subtracting 330 minutes
    const date = new Date(); date.setMinutes(date.getMinutes() - 330); // Adjust for IST (UTC+5:30) 
    const isoString = date.toISOString(); // Get the ISO string // Split the date string by "T" and join with a space const 
    const dateParts = isoString.split("T"); 
    const formattedDate = `${dateParts[0]} ${dateParts[1]}`;
    // const timeInIST = date.toISOString();

    // Prepare the data to send to the backend
    const data = {
      t_isdt: formattedDate,
      t_asno: selectedAsset,
      t_emno: emp, // Using empId consistently here
      t_idsc: description,
      t_ists: 1,
      t_hcmt:'',
      t_cldt: new Date('1970-01-01').toISOString(), // Converts the date to a valid ISO string
      t_Refcntd: 0, // Default reference count (adjust as needed)
      t_Refcntu: 0,
    };
      console.log(selectedAsset);
    // Send data to backend to store it in the database
    axiosInstance.post('/issues/submit', data)
    .then(response => {
      console.log("Backend", response);
      setMessage('Issue submitted successfully');
      setIsSuccess(true);
  
      // Reload the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2000 milliseconds = 2 seconds
    })
      .catch(error => {
        console.error('Error submitting the issue:', error);
        if (error.response) {
          console.error('Response error:', error.response.data);
        }
        setMessage('Failed to submit issue');
        setIsSuccess(false);
      });
  };

  const assetOptions = assetIds.map(asset => ({
    value: asset.t_asno, // Asset ID
    label: `${asset.t_asno} - ${asset.t_nama}`, // Asset ID and Name
  }));

  const handleAssetChange = (selectedOption) => {
    setSelectedAsset(selectedOption ? selectedOption.value : '');
  };

  return (
    <> 
      <Navbar /> 
      <div className="max-w-4xl mx-auto mt-3 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">Report a New Issue</h1>

        {/* Back Button */}
        <button
          onClick={() => navigate(`/users/issues`)}
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
              value={issueStatus} // Changed from 'status' to 'issueStatus'
              onChange={(e) => setIssueStatus(parseInt(e.target.value))} // Changed from 'status' to 'issueStatus'
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Open</option>
              <option value={2}>In Progress</option>
              <option value={3}>Closed</option>
            </select>
          </div> */}

          {/* Hardware Comment */}
          {issueStatus !== 1 && ( // Changed from 'status' to 'issueStatus'
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
