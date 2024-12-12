import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const AssetIssues = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("1");
  const [dateStartFilter, setDateStartFilter] = useState("");
  const [dateEndFilter, setDateEndFilter] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empOptions, setEmpOptions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Search box state
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [command, setCommand] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee names
    axiosInstance
      .get("/issues/list_emp")
      .then((response) => {
        const options = response.data.map((emp) => ({
          value: emp.emp_id,
          label: `${emp.emp_name} (${emp.emp_id})`,
        }));
        setEmpOptions(options);
      })
      .catch((error) => console.error("Error fetching employee names:", error));
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, selectedEmp, dateStartFilter, dateEndFilter, searchKeyword]);

  const fetchIssues = () => {
    axiosInstance
      .get("/issues/list")
      .then((response) => {
        let filteredIssues = response.data;

        // Status filter
        if (statusFilter) {
          filteredIssues = filteredIssues.filter(
            (issue) => issue.t_ists === parseInt(statusFilter)
          );
        }

        // Employee filter
if (selectedEmp && selectedEmp.value !== "none") {
  filteredIssues = filteredIssues.filter((issue) => {
    // Match by emp_id or empname
    return (
      issue.emp_id == selectedEmp.value || 
      issue.empname.toLowerCase().includes(selectedEmp.label.split("(")[0].trim().toLowerCase())
    );
  });
}



        // Date range filter
        if (dateStartFilter && dateEndFilter) {
          filteredIssues = filteredIssues.filter((issue) => {
            const issueDate = new Date(issue.t_isdt);
            return (
              issueDate >= new Date(dateStartFilter) &&
              issueDate <= new Date(dateEndFilter)
            );
          });
        }

        // Search box filter (matches keyword in description or employee name)
        if (searchKeyword) {
          filteredIssues = filteredIssues.filter(
            (issue) =>
              issue.t_idsc.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              issue.empname.toLowerCase().includes(searchKeyword.toLowerCase())
          );
        }

        // Sort by reported date descending
        filteredIssues = filteredIssues.sort(
          (a, b) => new Date(b.t_isdt) - new Date(a.t_isdt)
        );

        setIssues(filteredIssues);
      })
      .catch((error) => console.error("Error fetching issues:", error));
  };

  const handleEditClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleUpdateStatus = (status) => {
    const updatedData = {
      t_ists: parseInt(status, 10),
      t_hcmt: command,
    };

    if (status === "3") {
      updatedData.t_cldt = new Date(); // Add closed date
    }

    axiosInstance
      .put(`/issues/updation/${selectedIssue.t_isno}`, updatedData)
      .then(() => {
        navigate("/Asset-Issues");
        setSelectedIssue(null);
        setCommand("");
        fetchIssues();
      })
      .catch((error) => console.error("Error updating issue:", error));
  };

  return (
    <div className="container p-5 text-sm">
      <h1 className="text-2xl font-semibold mb-6">Issues</h1>

     {/* Filters */}
<div className="mb-4 flex flex-wrap items-center gap-4">
  {/* Status Filter */}
  <div className="flex flex-col">
    <label className="font-semibold text-sm mb-1">Status:</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border border-gray-300 rounded px-3 py-1 w-40"
    >
      <option value="">All</option>
      <option value="1">Open</option>
      <option value="2">In Progress</option>
      <option value="3">Closed</option>
    </select>
  </div>

  {/* Search Box */}
  <div className="flex flex-col">
    <label className="font-semibold text-sm mb-1">Search:</label>
    <input
      type="text"
      placeholder="Search description or name"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      className="border border-gray-300 rounded px-3 py-1 w-40"
    />
  </div>

  {/* Employee Filter */}
  <div className="flex flex-col">
    <label className="font-semibold text-sm mb-1">Employee:</label>
    <Select
      options={[{ value: "none", label: "All Employees" }, ...empOptions]}
      value={selectedEmp}
      onChange={(selectedOption) => setSelectedEmp(selectedOption)}
      placeholder="Select employee"
      isSearchable
      isClearable
      className="w-40"
    />
  </div>

  {/* Date Range Filter */}
  <div className="flex flex-col">
    <label className="font-semibold text-sm mb-1">Date Range:</label>
    <div className="flex gap-2">
      <input
        type="date"
        value={dateStartFilter}
        onChange={(e) => setDateStartFilter(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 w-40"
      />
      <input
        type="date"
        value={dateEndFilter}
        onChange={(e) => setDateEndFilter(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 w-40"
      />
    </div>
  </div>
</div>


      {/* Issues Table */}
      <table className="min-w-full table-auto border-collapse border border-black">
        <thead>
          <tr className="border border-black">
            <th className="border border-black px-4 py-2">Issue ID</th>
            <th className="border border-black px-4 py-2">Asset ID</th>
            <th className="border border-black px-4 py-2">Asset Name</th>
            <th className="border border-black px-4 py-2">Employee Name</th>
            <th className="border border-black px-4 py-2">Employee ID</th>
            <th className="border border-black px-4 py-2">Description</th>
            <th className="border border-black px-4 py-2">Status</th>
            <th className="border border-black px-4 py-2">Reported On</th>
            <th className="border border-black px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <tr key={issue.t_isno} className="border border-black">
                <td className="border px-4 py-2">{issue.t_isno}</td>
                <td className="border px-4 py-2">{issue.t_asno}</td>
                <td className="border px-4 py-2">{issue.t_nama}</td>
                <td className="border px-4 py-2">{issue.empname}</td>
                <td className="border px-4 py-2">{issue.t_emno}</td>
                <td className="border px-4 py-2">{issue.t_idsc}</td>
                <td className="border px-4 py-2">
                  {issue.t_ists === 1
                    ? "Open"
                    : issue.t_ists === 2
                    ? "In Progress"
                    : "Closed"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(issue.t_isdt).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditClick(issue)}
                    className="text-blue-500 underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4">
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
    {/* Edit Modal */}
        {/* Edit Window Modal */}
{selectedIssue && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
      <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
      <p><strong>Issue Number:</strong> {selectedIssue.t_isno}</p>
      <p><strong>Current Status:</strong>      {selectedIssue.t_ists === 1 ? 'Open' : selectedIssue.t_ists === 2 ? 'In Progress' : 'Closed'}</p>

      <label className="block mt-4 font-semibold">Update Status:</label>
      <select
  className="border rounded px-3 py-1 w-full"
  value={selectedIssue?.t_ists || ""}
  onChange={(e) => setSelectedIssue({ ...selectedIssue, t_ists: e.target.value })}
>
  <option value="">Select Status</option>
  <option value="1">Open</option>
  <option value="2">In Progress</option>
  <option value="3">Closed</option>
</select>


      <label className="block mt-4 font-semibold">Service Description:</label>
      <textarea
        className="border rounded px-3 py-1 w-full"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      ></textarea>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setSelectedIssue(null)} // Close modal
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
         onClick={() => handleUpdateStatus(selectedIssue.t_ists)}
         // Example status update
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    
  );
};


export default AssetIssues;
