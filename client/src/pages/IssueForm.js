import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import axiosInstance from "../axiosInstance";

const IssueForm = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  useEffect(() => {
    const fetchIssues = async () => {
      
      try {
         // Get token from localStorage
        if (!token) {
           console.log('No token found');
          return;
        }

        const response = await axiosInstance.get("/issues", {
          headers: {
            Authorization: `Bearer ${token}` // Pass token in the header
          },
        });

        console.log("Issues fetched successfully:", response.data);
        setIssues(response.data);
        
        console.log("User Issues:", response.data);
        

        let filteredIssues = response.data;

        // Apply filters
        if (statusFilter) {
          filteredIssues = filteredIssues.filter(issue => issue.t_ists === parseInt(statusFilter));
        }

        if (dateFilter) {
          filteredIssues = filteredIssues.filter(issue => {
            const issueDate = new Date(issue.t_isdt);
            const filterDate = new Date(dateFilter);
            return issueDate.toLocaleDateString() === filterDate.toLocaleDateString();
          });
        }

        // Sort issues
        filteredIssues = filteredIssues.sort((a, b) => new Date(b.t_isdt) - new Date(a.t_isdt));
        setIssues(filteredIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        // navigate("/login");
      }
    };

    fetchIssues();
  }, [statusFilter, dateFilter, navigate]);
  const handleNewIssue = () => {
  
    navigate("/new-issue", { state: { token } });
  };
  return (
    <> <UserNavbar />
    <div className="container p-8 text-sm">
      <h1 className="text-2xl font-semibold mb-6">IT HARDWARE ISSUES</h1>

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
        <table className="min-w-full table-auto border border-black">
          <thead>
            <tr className="border border-black">
              <th className="px-4 py-2 text-left border-b border-black">Issue ID</th>
              <th className="px-4 py-2 text-left border-b border-black">Hardware Name</th>
              <th className="px-4 py-2 text-left border-b border-black">Issue Description</th>
              <th className="px-4 py-2 text-left border-b border-black">Status</th>
              <th className="px-4 py-2 text-left border-b border-black">Reported On</th>
            </tr>
          </thead>
          <tbody  className="border border-black">
            {issues.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">No issues found.</td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.t_isno} className="border-b border-black">
                  <td className="px-4 py-2 border-black">{issue.t_isno}</td>
                  <td className="px-4 py-2 border-black">{issue.t_nama}</td>

                  <td className="px-4 py-2 border-black">{issue.t_idsc}</td>
                  <td className="px-4 py-2 border-black">
                    {issue.t_ists === 1 ? 'Open' : issue.t_ists === 2 ? 'In Progress' : 'Closed'}
                  </td>
                  <td className="px-4 py-2 border-black">{new Date(issue.t_isdt).toLocaleString()}</td>
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
