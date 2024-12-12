import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({
    assetCode: '',
    assetName: '',
    category: '',
    status: '',
    employeeNumber: '',
    employeeName: '',
    department: '',
  });

  const [filteredAssets, setFilteredAssets] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/assets'); // Adjust URL accordingly
        setAssets(response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
    fetchAssets();
  }, []);

  // Filter data whenever filters or assets change
  useEffect(() => {
    setFilteredAssets(
      assets.filter((asset) => {
        return (
          String(asset.t_asno || '').toLowerCase().includes(filters.assetCode.toLowerCase()) &&
          String(asset.t_nama).toLowerCase().includes(filters.assetName.toLowerCase()) &&
          String(asset.t_catg).toLowerCase().includes(filters.category.toLowerCase()) &&
          String(asset.t_stat).toLowerCase().includes(filters.status.toLowerCase()) &&
          String(asset.t_emno || '').toLowerCase().includes(filters.employeeNumber.toLowerCase()) &&
          String(asset.emp_name).toLowerCase().includes(filters.employeeName.toLowerCase()) &&
          String(asset.t_dsca).toLowerCase().includes(filters.department.toLowerCase())
        );
      })
    );
  }, [filters, assets]);

  // Handle filter changes
  const handleFilterChange = (e, column) => {
    setFilters({
      ...filters,
      [column]: e.target.value,
    });
  };

  return (
    <div className="container p-8 text-sm  transform -translate-y-12">
      <table className="min-w-full table-auto border-collapse bg-white shadow-md">
        <thead className="bg-gray-100 w-20">
          <tr>
            {/* Filter Inputs */}
            {['AssetCode', 'AssetName', 'category', 'status', 'Emp_Number', 'Emp_Name', 'Dept'].map((col, index) => (
              <th key={index} className="px-6 py-4 text-left font-semibold text-gray-700">
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded-lg w-full"
                  placeholder={`Filter ${col.replace(/([A-Z])/g, ' $1').trim()}`}
                  value={filters[col]}
                  onChange={(e) => handleFilterChange(e, col)}
                />
                {col.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
            <th className="px-6 py-4 text-left font-semibold text-gray-700">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <tr key={asset.t_asno} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-t">{asset.t_asno}</td>
                <td className="px-6 py-4 border-t">{asset.t_nama}</td>
                <td className="px-6 py-4 border-t">{asset.t_catg}</td>
                <td className="px-6 py-4 border-t">{asset.t_stat}</td>
                <td className="px-6 py-4 border-t">{asset.t_emno}</td>
                <td className="px-6 py-4 border-t">{asset.emp_name}</td>
                <td className="px-6 py-4 border-t">{asset.t_dsca}</td>
                <td className="px-6 py-4 border-t">
                  <Link to={`/assets/${asset.t_asno}`} className="text-blue-500">View</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center">No assets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
