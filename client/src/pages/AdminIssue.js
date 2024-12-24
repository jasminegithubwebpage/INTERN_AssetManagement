import { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Ensure the axios instance is correctly set up
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce'; // Install lodash.debounce

const AdminIssue = () => {
  const [userPin, setUserPin] = useState(null);
  const [userPinOptions, setUserPinOptions] = useState([]);
  const [assetOptions, setAssetOptions] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch assets based on the selected user PIN
  useEffect(() => {
    if (!userPin) {
      setAssetOptions([]); // Clear asset options if no user PIN is selected
      return;
    }

    const fetchAssets = async () => {
      try {
        const response = await axiosInstance.get(`/assets/by-pin/${userPin.value}`);
        const assets = response.data;
        const formattedAssets = assets.map((asset) => ({
          value: asset.t_asno,
          label: `${asset.t_asno} - ${asset.t_nama}`,
        }));
        setAssetOptions(formattedAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setMessage('Failed to fetch assets');
        setIsSuccess(false);
      }
    };

    fetchAssets();
  }, [userPin]);

  // Fetch user PIN options dynamically
  const fetchUserPinOptions = async (inputValue) => {
    try {
      const response = await axiosInstance.get(`/issues/search?query=${inputValue}`);
      const users = response.data;
      const formattedUsers = users.map((user) => ({
        value: user.t_emno,
        label: `${user.t_emno} - ${user.t_nama}`,
      }));
      setUserPinOptions(formattedUsers);
    } catch (error) {
      console.error('Error fetching user PINs:', error);
    }
  };

  // Debounce the user PIN fetch
  const debouncedFetchUserPinOptions = debounce(fetchUserPinOptions, 300);

  const handleUserPinInputChange = (inputValue) => {
    if (inputValue.trim() !== '') {
      debouncedFetchUserPinOptions(inputValue);
    } else {
      setUserPinOptions([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userPin || !selectedAsset || !description) {
      setMessage('Please select a user PIN, an asset, and provide a description');
      setIsSuccess(false);
      return;
    }

    const date = new Date(); date.setMinutes(date.getMinutes() - 330); // Adjust for IST (UTC+5:30) 
    const isoString = date.toISOString(); // Get the ISO string // Split the date string by "T" and join with a space const 
    const dateParts = isoString.split("T"); 
    const formattedDate = `${dateParts[0]} ${dateParts[1]}`;
    // const timeInIST = date.toISOString();
    const data = {
      t_emno: userPin.value,
      t_isdt: formattedDate,
      t_asno: selectedAsset.value,
      t_idsc: description,
      t_ists: 1,
      t_hcmt: '  ',
      t_cldt: new Date('1970-01-01').toISOString(),
      t_Refcntd: 0,
      t_Refcntu: 0,
    };

    try {
      const response = await axiosInstance.post('/issues/submit', data);
      setMessage('Issue submitted successfully');
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/Asset-Issues');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting the issue:', error);
      setMessage('Failed to submit the issue');
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-3 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Admin :  Report a New Issue</h1>
      <button
        onClick={() => navigate(`/Asset-Issues`)}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
      >
        ← Back to Issue Form
      </button>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userPin" className="block text-sm font-medium text-gray-600 mb-1">
            Enter User PIN or Name
          </label>
          <Select
            id="userPin"
            options={userPinOptions}
            onInputChange={handleUserPinInputChange}
            onChange={(selectedOption) => setUserPin(selectedOption)}
            placeholder="Search by User PIN or Name"
            isSearchable
          />
        </div>

        <div>
          <label htmlFor="asset" className="block text-sm font-medium text-gray-600 mb-1">
            Select Asset
          </label>
          <Select
            id="asset"
            options={assetOptions}
            value={selectedAsset}
            onChange={(selectedOption) => setSelectedAsset(selectedOption)}
            placeholder="Search and select an asset..."
            isSearchable
            required
          />
        </div>

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

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </div>

        {message && (
          <div style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminIssue;
