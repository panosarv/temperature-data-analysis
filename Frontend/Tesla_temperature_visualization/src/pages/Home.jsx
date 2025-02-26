import React from 'react'
import UploadButton from '../components/UploadButton.jsx' 
import UploadTooltip from '@/components/UploadTooltip.jsx';
function Home() {
    return (
      <div className="flex items-center justify-between  p-2">
        {/* Container */}
        <div className=" h-[30vh] w-[50vw] flex rounded-lg shadow-lg overflow-hidden flex justify-between ">
          {/* Left Side with Hero Image */}
          <div className="w-1/2 max-w-[20vw] bg-hero-before-upload bg-cover bg-center"></div>
  
          {/* Right Side with Upload Button */}
          <div className="w-1/2  flex flex-col justify-center items-center rounded-lg shadow-xl">
            <img
              src="/img/weather-icon.svg"
              alt="Weather Icon"
              className="w-1/3 h-auto" // Adjust size as needed
            />
            <div>
            <div className="relative shadow-lg rounded-lg">
            <UploadButton />
            <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2">
              <UploadTooltip />
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
export default Home