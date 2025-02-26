import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { Upload } from "lucide-react"; 

function UploadButton() {
  const navigate = useNavigate();

  const navigateToGraph = () => {
    navigate("/graph");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        sessionStorage.removeItem("user_id");
        throw new Error("File upload failed");
      }

      const data = await response.json();
      sessionStorage.setItem("user_id", data.user_id);
      navigateToGraph();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="relative inline-block cursor-pointer ">
      <label className="inline-block cursor-pointer relative ">
        <input
          type="file"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer text-[0px]"
          accept=".csv"
        />
        <Button
          variant="outline"
          className="relative flex items-center justify-center w-full bg-anthracite cursor-pointer text-white" 
        >
          <Upload className="mr-2 h-4 w-4 cursor-pointer" />
          Upload files
        </Button>
      </label>
    </div>
  );
}

export default UploadButton;
