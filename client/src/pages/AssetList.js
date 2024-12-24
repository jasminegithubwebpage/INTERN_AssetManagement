import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({
    t_asno: '',
    t_nama: '',
    t_catg: '',
    t_stat: '',
    t_emno: '',
    emp_name: '',
    t_dsca: '',
  });

  const [filteredAssets, setFilteredAssets] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/assets'); // Adjust URL accordingly
        console.log('Assets from backend:', response.data);
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
          String(asset?.t_asno || '').toLowerCase().includes(filters.t_asno.toLowerCase()) &&
          String(asset?.t_nama || '').toLowerCase().includes(filters.t_nama.toLowerCase()) &&
          String(asset?.t_catg || '').toLowerCase().includes(filters.t_catg.toLowerCase()) &&
          String(asset?.t_stat || '').toLowerCase().includes(filters.t_stat.toLowerCase()) &&
          String(asset?.t_emno || '').toLowerCase().includes(filters.t_emno.toLowerCase()) &&
          String(asset?.emp_name || '').toLowerCase().includes(filters.emp_name.toLowerCase()) &&
          String(asset?.t_dsca || '').toLowerCase().includes(filters.t_dsca.toLowerCase())
        );
      })
    );
    // console.log('Filtered Assets:', filteredAssets);
  }, [filters, assets]);

  // Handle filter changes
  const handleFilterChange = (e, column) => {
    setFilters({
      ...filters,
      [column]: e.target.value,
    });
  };

  const columns = [
    { key: 't_asno', label: 'Asset Code' },
    { key: 't_nama', label: 'Asset Name' },
    { key: 't_catg', label: 'Category' },
    { key: 't_stat', label: 'Status' },
    { key: 't_emno', label: 'Employee Number' },
    { key: 'emp_name', label: 'Employee Name' },
    { key: 't_dsca', label: 'Department' },
  ];

  return (
    <div className="container p-8 text-sm transform -translate-y-12">
      <table className="min-w-full table-auto border-collapse bg-white shadow-md">
        <thead className="bg-gray-100 w-20">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 text-left font-semibold text-gray-700">
                <input
                  type="text"
                  className="px-2 py-1 border border-gray-300 rounded-lg w-full"
                  placeholder={`Filter ${col.label}`}
                  value={filters[col.key]} // Ensure `filters` keys match `col.key`
                  onChange={(e) => handleFilterChange(e, col.key)}
                />
                {col.label}
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
