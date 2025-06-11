import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import UserContextProvider from "./components/common/Context/UserContext";
import NotFound from './pages/NotFound/NotFound'
import ServiceDetails from './pages/ServiceDetails/ServiceDetails'
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';// import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
// import TechnicianListPage from "./pages/TechnicianListPage/TechnicianListPage";
// import TechnicianProfilePage from "./pages/TechnicianProfilePage/TechnicianProfilePage";
// import BookingPage from "./pages/BookingPage/BookingPage";
// import PaymentPage from "./pages/PaymentPage/PaymentPage";
// import BookingConfirmationPage from "./pages/BookingConfirmationPage/BookingConfirmationPage";
// import ReviewPage from "./pages/ReviewPage/ReviewPage";
import TechnichanDashboard from "./pages/TechnichanDashboard/TechnichanDashboard";
import AdminDashboardPage from "./pages/AdminDashboardPage/AdminDashboardPage";
import ManageServicesPage from "./pages/ManageServicesPage/ManageServicesPage";
import ManageUsersPage from "./pages/ManageUsersPage/ManageUsersPage";
import TechnicianListPage from "./pages/TechnicianListPage/TechnicianListPage";
import ImageClassificationSection from './components/ImageClassificationSection/ImageClassificationSection'
import BookingSummary from './pages/BookingSummary/BookingSummary'
import BookingSummmaries from './pages/BookingSummmaries/BookingSummmaries'
import Contact from './components/common/ContactUs/ContactUs'
import Profile from './pages/Profile/Profile'
import Chatbot from './components/common/Chatbot/Chatbot'
import "./App.css"; 

const AppContent = () => {
  const location = useLocation();

  const publicRoutes = ["/", "/services" , "/booking-summary", "/Booking-Summmaries"]; // routes that should show header/footer
  
  // Hide header/footer if current path is not in publicRoutes
  const hideHeaderFooter = !publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/technicians" element={<TechnicianListPage />} />
          <Route path="/image-classify" element={<ImageClassificationSection />} />

          {/* <Route path="/technicians/:id" element={<TechnicianProfilePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
           <Route path="/review" element={<ReviewPage />} />  */}
          <Route path="/booking-summary/:bookingId" element={<BookingSummary />} />
          <Route path="/Booking-Summmaries" element={<BookingSummmaries />} />
          <Route path="/user-profile" element={<Profile />} />
         
          <Route path="/technician-dashboard/:techId" element={<TechnichanDashboard />} />
          <Route path="/admin" element={<AdminDashboardPage />} /> 
          <Route path="/admin/manage/services" element={<ManageServicesPage />} /> 
          <Route path="/admin/manage/users" element={<ManageUsersPage />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
         <div className="relative">
      
      </div>
      </div>
      {!hideHeaderFooter && <Footer />}
       
    </>
  );
};

const App = () => {
  let queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <Router>
      <AppContent />
    </Router>
    </UserContextProvider>
    </QueryClientProvider>
  );
};

export default App;



