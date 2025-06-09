import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { theme } from './styles/theme';
import Header from './components/common/Header';
import Home from './components/Home';
import Login from './components/auth/Login';
import UserTypeSelection from './components/auth/UserTypeSelection';
import JobseekerRegister from './components/jobseeker/JobseekerRegister';
import EmployerRegister from './components/employer/EmployerRegister';
import JobseekerDashboard from './components/jobseeker/JobseekerDashboard';
import EmployerDashboard from './components/employer/EmployerDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-user-type" element={<UserTypeSelection />} />
          <Route path="/register/jobseeker" element={<JobseekerRegister />} />
          <Route path="/register/employer" element={<EmployerRegister />} />
          <Route path="/jobseeker/dashboard" element={<ProtectedRoute><JobseekerDashboard /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
