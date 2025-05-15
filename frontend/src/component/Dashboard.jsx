import React, { useState } from 'react';
import AdminList from './AdminList';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'admins':
        return <AdminList />;
      case 'dashboard':
      default:
        return (
          <>
            <h1>Super Admin Dashboard</h1>
            <div className="dashboard-cards">
              <div className="dashboard-card admins">
                <div className="dashboard-card-number">5</div>
                <div className="dashboard-card-label">Admins</div>
              </div>
              <div className="dashboard-card students">
                <div className="dashboard-card-number">350</div>
                <div className="dashboard-card-label">Students</div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-title">Super Admin</div>
        <nav className="sidebar-nav">
          <a 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('dashboard');
            }}
          >
            Dashboard
          </a>
          <a 
            className={activeSection === 'admins' ? 'active' : ''} 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('admins');
            }}
          >
            Admins
          </a>
          <a href="#">Settings</a>
        </nav>
      </aside>
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard; 