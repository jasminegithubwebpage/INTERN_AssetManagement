import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
import Layout from './components/Layout';
import Login from './pages/Login';
import IssueForm from './pages/IssueForm';
import NewIssuePage from './pages/NewIssuePage';
import AssetIssues from './pages/AssetIssues';
function App() {
  return (
    <Router>
      
      <Routes>
           <Route path="/" element={<Login />} />
           
          <Route path="/assets" element={<Layout><AssetList /></Layout>} /> {/* Assets List */}
          <Route path="/assets/:asno" element={<Layout><AssetDetail /></Layout>} /> {/* Asset Detail */}
          <Route path="/issues/:emno" element={<IssueForm />} />
          {/* <Route path="/new-issue/:empId" element = {<NewIssuePage />}/> */}
          <Route path="/new-issue/:empId" element={<NewIssuePage />} />
          <Route path="/Asset-Issues" element={<Layout><AssetIssues /></Layout>} />
          </Routes>
    
    </Router>
  );
}

export default App;
