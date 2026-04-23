import React from "react";

const images = Array(20).fill({
  src: "https://images.unsplash.com/photo-1722080767284-55b5038409a1?q=80&w=2087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "WhatsAppImage20250323at22..."
});

const SitePhotographs = () => {
  return (
    <div className="mb-4 border border-gray-300 p-5 rounded-lg bg-gray-100">
      <div className="p-4">
        <h4 className="text-red-600 text-lg font-semibold mb-2">Site Photographs</h4>
        <p className="mb-6">Please upload site photographs, interior and exterior photographs *</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="bg-white rounded shadow p-2">
              <img
                src={img.src}
                alt={`Site Image ${index + 1}`}
                className="w-full h-40 object-cover rounded"
              />
              <div className="text-center mt-2">
                <p className="text-xs text-gray-700">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitePhotographs;
