import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const IssueForm = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');  // Define statusFilter state
  // const [idFilter, setIdFilter] = useState('');
  // const [descFilter, setDescFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate(); // Use navigate instead of history
  const { emno } = useParams(); // Get the empId from the URL parameters

  console.log(emno);
  useEffect(() => {
    // Fetch issues from the backend with filters
    axios.get(`http://localhost:3001/issues/${emno}`)
      .then(response => {
        let filteredIssues = response.data;

        // Apply filters
        if (statusFilter) {
          filteredIssues = filteredIssues.filter(issue => issue.t_ists === parseInt(statusFilter));
        }
        // if (idFilter) {
        //   filteredIssues = filteredIssues.filter(issue => issue.t_isno.toString().includes(idFilter));
        // }
        // if (descFilter) {
        //   filteredIssues = filteredIssues.filter(issue => issue.t_idsc.toLowerCase().includes(descFilter.toLowerCase()));
        // }
        if (dateFilter) {
          filteredIssues = filteredIssues.filter(issue => {
            const issueDate = new Date(issue.t_isdt);
            const filterDate = new Date(dateFilter);
            return issueDate.toLocaleDateString() === filterDate.toLocaleDateString();
          });
        }

        // Sort issues by date descending
        filteredIssues = filteredIssues.sort((a, b) => new Date(b.t_isdt) - new Date(a.t_isdt));

        setIssues(filteredIssues);
      })
      .catch(error => {
        console.error('Error fetching issues:', error);
      });
  }, [emno, statusFilter, dateFilter]); // Re-fetch data when filters change

  const handleNewIssue = () => {
    console.log(emno);
    navigate(`/new-issue/${emno}`);
  };
  
  

  return (
    <> <Navbar />
    <div className="container p-8 text-sm">
      <h1 className="text-2xl font-semibold mb-6">Issues</h1>

      {/* Filters for Issue Status and Reported Date */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="mr-2 font-semibold">Filter by Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">All</option>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mr-2 font-semibold">Filter by Reported Date:</label>
          <input
            id="date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>
      </div>

      {/* Button to Add New Issue */}
      <button onClick={handleNewIssue} className="btn btn-primary mb-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
        New Issue
      </button>

      {/* Issue Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Issue ID</th>
              <th className="px-4 py-2 text-left border-b">Asset Name</th>
              <th className="px-4 py-2 text-left border-b">Description</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
              <th className="px-4 py-2 text-left border-b">Reported On</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No issues found.</td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.t_isno} className="border-b">
                  <td className="px-4 py-2">{issue.t_isno}</td>
                  <td className="px-4 py-2">{issue.t_nama}</td>

                  <td className="px-4 py-2">{issue.t_idsc}</td>
                  <td className="px-4 py-2">
                    {issue.t_ists === 1 ? 'Open' : issue.t_ists === 2 ? 'In Progress' : 'Closed'}
                  </td>
                  <td className="px-4 py-2">{new Date(issue.t_isdt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default IssueForm;
