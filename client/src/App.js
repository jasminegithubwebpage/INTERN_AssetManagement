import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
import Layout from './components/Layout';
import Login from './pages/Login';
import IssueForm from './pages/IssueForm';
import NewIssuePage from './pages/NewIssuePage';
import AssetIssues from './pages/AssetIssues';
import UserLogin from './pages/UserLogin';
import { UserProvider } from './pages/UserContext';
function App() {
  return (
  <UserProvider>
    <Router>
      
      <Routes>
           <Route path="/" element={<Login />} />
           
          <Route path="/assets" element={<Layout><AssetList /></Layout>} /> {/* Assets List */}
          <Route path="/assets/:asno" element={<Layout><AssetDetail /></Layout>} /> {/* Asset Detail */}
          <Route path="users/issues/" element={<IssueForm />} />
          {/* <Route path="/new-issue/:empId" element = {<NewIssuePage />}/> */}
          <Route path="/new-issue" element={<NewIssuePage />} />
          <Route path="/Asset-Issues" element={<Layout><AssetIssues /></Layout>} />
          <Route path = "/users" element={<UserLogin />} />
          </Routes>
    
    </Router>
    </UserProvider>
  );
}

export default App;
