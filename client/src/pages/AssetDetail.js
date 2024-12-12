import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const api = 'http://localhost:3001';
// import {axios} from "axios";
const AssetDetail = () => {
  const { asno } = useParams(); // Get the 'asno' parameter from the URL
  const [asset, setAsset] = useState(null); // State to hold the asset data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [componentData, setComponentData] = useState([]);
  const [issueData, setIssueData] = useState([])
  const [error, setError] = useState(null); // State to manage error state
  const [movementData, setMovementData] = useState([]);
 
  // Fetch asset details when component mounts or 'asno' changes
  useEffect(() => {
    const fetchAssetDetails = async () => {
        try {
            const assetResponse = await fetch(`${api}/assets/${asno}`);
            if (!assetResponse.ok) {
                throw new Error('Asset not found');
            }
            const assetData = await assetResponse.json();
            setAsset(assetData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComponentDetails = async () => {
        try {
            const componentResponse = await fetch(`${api}/assets/${asno}/components`);
            if (!componentResponse.ok) {
                throw new Error('Components not found');
            }
            const componentData = await componentResponse.json();
            setComponentData(componentData);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchMovementDetails = async () => {
      try {
          const response = await fetch(`${api}/assets/${asno}/movement`);
          if (response.ok) {
              const data = await response.json();
              setMovementData(data);
          } else {
              setError('Movement details not found.');
          }
      } catch (err) {
          console.error(err);
          setError('An error occurred while fetching movement details.');
      }
  };
  const fetchIssueData = async () => {
    try {
       const response = await fetch(`${api}/assets/${asno}/issues`); // Update with correct endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch issue data');
      }
      const data = await response.json();
      setIssueData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
   fetchIssueData();
    fetchAssetDetails();
    fetchComponentDetails();
    fetchMovementDetails();
}, [asno]);

  console.log(issueData);
  if (loading) {
    return <div>Loading asset details...</div>; // Show loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there is an error
  }

  if (!asset) {
    return <div>Asset not found</div>; // Show message if asset is not found
  }

  return (
    <div className="container mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Asset Details</h2>
    <div className="flex flex-wrap border border-gray-300 rounded-lg">

      {/* Left Side */}
      <div className="w-full md:w-1/2 px-4 border-r border-gray-300">
        <table className="min-w-full bg-white table-auto text-sm">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Asset Code</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_asno}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Asset Name</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_nama}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Category</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_catg}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Status</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_stat}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Manufacturer</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_mfgr}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Value</td>
              <td className="px-2 py-1 text-gray-800">${asset.t_aval}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">RAM</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_rams} GB</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Asset Tag</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_asnt}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Location</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_lcno}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Asset Serial Number</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_serl}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      {/* Right Side */}
      <div className="w-full md:w-1/2 px-4">
        <table className="min-w-full bg-white table-auto text-sm">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Processor</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_prcd}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Storage</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_hdds} GB</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Graphics Card</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_gpds}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Operating System</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_ipad}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Purchase Date</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_podt}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Warranty Expiry</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_wrdt}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Location</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_lcno}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Invoice Number</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_ninv}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Warranty Type</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_wrty}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-2 py-1 font-bold text-black">Monitor</td>
              <td className="px-2 py-1 text-gray-800">{asset.t_moni}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* component data */}
       {/* Component data */}
 {/* Component data */}
 </div>
 <div className="w-full md:w-1/2 px-4 mt-10">
  <h2 className="text-xl font-bold mb-4">Component Details</h2>
  <table className="min-w-full bg-white table-auto text-sm border border-gray-300 rounded">
    <thead>
      <tr className="border-b border-gray-300">
        <th className="px-2 py-1 text-left font-bold text-black">Asset Name</th>
        <th className="px-2 py-1 text-left font-bold text-black">Upgrade Size</th>
        <th className="px-2 py-1 text-left font-bold text-black">Upgrade Notes</th>
        <th className="px-2 py-1 text-left font-bold text-black">Transaction Date</th>
      </tr>
    </thead>
    <tbody className="border-b border-gray-300">
      {componentData.length === 0 ? (
        <tr>
          <td colSpan="4" className="px-2 py-1 text-center text-gray-500">
            No components found
          </td>
        </tr>
      ) : (
        componentData.map((item) => (
          <tr key={item.t_ctid} className="border-b border-gray-300">
            <td className="px-2 py-1 text-gray-800">{item.Asset_Name}</td>
            <td className="px-2 py-1 text-gray-800">{item.Upgrade_Size}</td>
            <td className="px-2 py-1 text-gray-800">{item.Upgrade_Notes}</td>
            <td className="px-2 py-1 text-gray-800">{new Date(item.Transaction_Date).toLocaleDateString()}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>

</div>


<div className="w-full px-4 mt-10">
  <h2 className="text-xl font-bold mb-4">Movement Details</h2>
  <table className="w-full bg-white table-auto text-sm border border-gray-300 rounded">
    <thead>
      <tr className="border-b border-gray-300">
        <th className="px-2 py-1 text-left font-bold text-black">Transaction_Date</th>
        <th className="px-2 py-1 text-left font-bold text-black">Asset Number</th>
        <th className="px-2 py-1 text-left font-bold text-black">Employee Name</th>
        <th className="px-2 py-1 text-left font-bold text-black">Employee No</th>
        <th className="px-2 py-1 text-left font-bold text-black">Employee_Department</th>
        <th className="px-2 py-1 text-left font-bold text-black">Remarks</th>
      </tr>
    </thead>
    <tbody className="border-b border-gray-300">
      {movementData?.length === 0 ? (
        <tr>
          <td colSpan="7" className="px-2 py-1 text-center text-gray-500">
            No movement found
          </td>
        </tr>
      ) : (
        movementData?.map((item) => (
          <tr key={item.t_movid} className="border-b border-gray-300">
              <td className="px-2 py-1 text-gray-800">{new Date(item.Transaction_Date).toLocaleDateString()}</td>
            
            <td className="px-2 py-1 text-gray-800">{item.Asset_Number}</td>
            <td className="px-2 py-1 text-gray-800">{item.Employee_Name}</td>
            <td className="px-2 py-1 text-gray-800">{item.Employee_No}</td>
            <td className="px-2 py-1 text-gray-800">{item.Department_Description}</td>
            <td className="px-2 py-1 text-gray-800">{item.Remarks}</td>

          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
{/* ISSUE DETAILS */}
<div className="w-full px-4 mt-10">
      <h2 className="text-xl font-bold mb-4">Issue Details</h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <table className="w-full bg-white table-auto text-sm border border-gray-300 rounded">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-2 py-1 text-left font-bold text-black">Issue Log No</th>
              <th className="px-2 py-1 text-left font-bold text-black">Issue Log Date</th>
              <th className="px-2 py-1 text-left font-bold text-black">Asset Number</th>
              <th className="px-2 py-1 text-left font-bold text-black">Employee No</th>
              <th className="px-2 py-1 text-left font-bold text-black">Employee Name</th>
              <th className="px-2 py-1 text-left font-bold text-black">Issue Description</th>
              <th className="px-2 py-1 text-left font-bold text-black">Issue Status</th>
              <th className="px-2 py-1 text-left font-bold text-black">HW Engineer Comments</th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-300">
            {issueData?.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-2 py-1 text-center text-gray-500">
                  No issues found
                </td>
              </tr>
            ) : (
              issueData.map((item) => (
                <tr key={item.Issue_Log_No} className="border-b border-gray-300">
                  <td className="px-2 py-1 text-gray-800">{item.Issue_Log_No}</td>
                  <td className="px-2 py-1 text-gray-800">{new Date(item.Issue_Log_Date).toLocaleDateString()}</td>
                  <td className="px-2 py-1 text-gray-800">{item.Asset_No}</td>
                  <td className="px-2 py-1 text-gray-800">{item.Employee_No}</td>
                  <td className="px-2 py-1 text-gray-800">{item.Employee_Name}</td>
                  <td className="px-2 py-1 text-gray-800">{item.Issue_Description}</td>
                  <td className="px-2 py-1 text-gray-800">{item.Issue_Status}</td>
                  <td className="px-2 py-1 text-gray-800">{item.HW_Engineer_Comments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>

   
    </div>
  //</div>
      

  
  );
};

export default AssetDetail;
