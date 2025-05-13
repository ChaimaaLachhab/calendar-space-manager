import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ spaceData }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === spaceData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? spaceData.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row md:h-[450px] rounded-xl overflow-hidden shadow-lg">
      {/* Image principale */}
      <img
        src={spaceData.images[selectedImageIndex].mediaUrl}
        alt={`${spaceData.title} - featured image`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Flèche gauche */}
      <button
        onClick={handlePreviousImage}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-90 text-white w-8 h-8 rounded-full shadow-md flex items-center justify-center z-10"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Flèche droite */}
      <button
        onClick={handleNextImage}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-60 hover:bg-opacity-90 text-white w-8 h-8 rounded-full shadow-md flex items-center justify-center z-10"
      >
        <ChevronRight size={20} />
      </button>

      {/* Badge compteur */}
      <div className="absolute bottom-3 right-3 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-md text-xs shadow-md backdrop-blur-sm z-10">
        {selectedImageIndex + 1}/{spaceData.images.length}
      </div>

      {/* Miniatures */}
      <div className="flex absolute bottom-3 left-3 space-x-2 overflow-x-auto max-w-full bg-black bg-opacity-40 p-2 rounded-lg backdrop-blur-md z-10">
        {spaceData.images.map((image, index) => (
          <div
            key={index}
            className={`h-14 w-14 rounded-md overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
              selectedImageIndex === index
                ? 'border-blue-500 ring-2 ring-blue-400 scale-105'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            onClick={() => handleImageSelect(index)}
          >
            <img
              src={image.mediaUrl}
              alt={`${spaceData.title} - thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
