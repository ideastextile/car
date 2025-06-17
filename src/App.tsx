import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import VehicleEntryPage from './pages/VehicleEntryPage';
import VehicleExitPage from './pages/VehicleExitPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Header />
                  <Navigation />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/entry" element={<VehicleEntryPage />} />
                      <Route path="/exit" element={<VehicleExitPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                  </main>
                  <footer className="bg-gray-800 text-white py-4 text-center text-sm">
                    <p>© {new Date().getFullYear()} SmartPark by 7starsoftwareservice. All rights reserved.</p>
                  </footer>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;