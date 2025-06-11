import { useState, useEffect } from "react";
import { Star, ThumbsUp, User, Wrench, CheckCircle, Clock } from "lucide-react";

export default function TechniciansList() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://03f8-156-217-243-231.ngrok-free.app/recommend_technicians");
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setTechnicians(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading technicians...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Technicians</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect specialist for your home repair and maintenance needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technicians.map((technician) => (
            <div 
              key={technician.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="bg-white rounded-full p-3">
                    <Wrench className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 rounded-lg px-4 py-1">
                    <span className="text-white flex items-center">
                      <Wrench className="h-4 w-4 mr-2" />
                      {technician.Specialization}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{technician.name}</h2>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-gray-500">Verified Professional</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1 text-blue-500" />
                      Positive Reviews
                    </span>
                    <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">
                      {technician.positive_review_count}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {technician.positive_reviews && technician.positive_reviews.map((review, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-3 py-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">{review.user_name}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{review.confidence && review.confidence.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm italic">"{review.review_text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center">
                    Contact Technician
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}