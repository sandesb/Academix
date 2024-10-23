import React, { useState } from "react";
import InputField from "./InputField";
import { v4 as uuidv4 } from "uuid";
import { useAddSubjectMutation } from "../redux/subjectApi"; // Update import to use subjectApi

const AddCart = ({ refetch }) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [work, setWork] = useState("");
  const [addSubject] = useAddSubjectMutation(); // Use addSubject instead of addCourse

  const handleAddClick = async () => {
    const workHours = parseInt(work, 10);

    // Check localStorage for conditions
    const adminIsAuthenticated =
      localStorage.getItem("adminIsAuthenticated") === "true";
    const matricNo = localStorage.getItem("matricNo");

    // Determine matric value
    let matricValue = "GUEST"; // Default to GUEST

    if (adminIsAuthenticated) {
      matricValue = null; // If admin is authenticated, set to null
    } else if (matricNo) {
      matricValue = matricNo; // If matricNo exists, use it
    }

    // Generate unique content_id and subjects_id
    const contentId = uuidv4();
    const subjectsId = uuidv4();

    // Create the new subject object
    const newSubject = {
      id: uuidv4(),
      title: name,
      progress: `0 / ${workHours}`,
      icon: emoji,
      bgColor: "from-blue-100 to-blue-300",
      matric: matricValue,
      content_id: contentId,
      subjects_id: subjectsId,
      note: `{
        "time": 1729351709073,
        "blocks": [
          {
            "id": "56BN6lrTNl",
            "data": {
              "text": "write here..."
            },
            "type": "paragraph"
          }
        ],
        "version": "2.30.5"
      }`, // Adjust this to your actual content note
    };

    try {
      // Insert into subjects table
      const { data: subjectsData, error: subjectsError } = await addSubject(
        newSubject
      );
      if (subjectsError) throw subjectsError;
      console.log("Added subject to subjects:", subjectsData);

      // Refetch subjects after adding a new one
      refetch();

      // Reset input fields
      setName("");
      setEmoji("");
      setWork("");
    } catch (error) {
      console.error("Failed to add subject:", error);
    }
  };

  return (
    <div className="font-lato mt-7 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center mb-8 w-full">
      {/* Pass customWidth prop to give different widths to Name and Chapters */}
      <InputField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
        place="Name of Subject..."
        customWidth="43%" // Adjust width for larger screens
      />
      <InputField
        type="emoji"
        value={emoji}
        onChange={setEmoji}
        label="Emoji"
        customWidth="40%" // Adjust width for larger screens
      />
      <InputField
        type="number"
        value={work}
        onChange={(e) => setWork(e.target.value)}
        label="Chapters"
        place="Total Chapters..."
        customWidth="36%" // Adjust width for larger screens
      />
      <button
        onClick={handleAddClick}
        className=" bg-blue-100 text-blue-500 px-4 py-2 rounded-md flex items-center border border-blue-200"
        style={{ borderRadius: "10px" }}
      >
        <span className="mr-2 text-blue-500">+</span> Add
      </button>
    </div>
  );
};

export default AddCart;
