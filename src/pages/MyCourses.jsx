import React, { useState } from "react";
import Card from "../components/Card";
import useCart from "../hooks/useCart";
import LoadingSpinner from "../components/LoadingSpinner";
import AddCart from "../components/AddCart";
import ItemDialog from "../components/ItemDialog"; // Import the ItemDialog

import {
  useFetchSubjectsQuery,  // Replacing useFetchCoursesQuery
  useUpdateSubjectMutation,  // Replacing useUpdateCourseMutation
  useDeleteSubjectMutation,  // Replacing useDeleteCourseMutation
} from "../redux/subjectApi"; // Replace with subjectApi
import DeleteDialog from "../components/DeleteDialog";

const MyCourses = () => {
  const { handlePlusClick } = useCart();
  
  // Fetching subjects (previously courses)
  const {
    data: subjects = [], // Rename 'courses' to 'subjects'
    error,
    isLoading,
    refetch,
  } = useFetchSubjectsQuery(); // Replace with useFetchSubjectsQuery
  
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const [updateSubject] = useUpdateSubjectMutation(); // Replace updateCourse with updateSubject
  const [deleteSubject] = useDeleteSubjectMutation(); // Replace deleteCourse with deleteSubject

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = async (updatedSubject) => {
    try {
      console.log("Updating subject:", updatedSubject);

      const { data, error } = await updateSubject(updatedSubject).unwrap(); // Replacing updateCourse with updateSubject

      if (error) throw error;

      console.log("Subject updated successfully:", data);

      refetch(); // Refetch subjects to reflect the update
    } catch (error) {
      console.error("Failed to update subject:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedSubjectId(id); // Set the selected subject ID
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(selectedSubjectId).unwrap(); // Replacing deleteCourse with deleteSubject
      console.log("Deleted subject with id:", selectedSubjectId);
      setDeleteDialogOpen(false);

      refetch(); // Refetch subjects after deletion
    } catch (error) {
      console.error("Failed to delete subject:", error);
      showToast("error", "Failed to delete subject. Please try again.");
    }
  };

  const handleTitleClick = (id) => {
    const selectedSubject = subjects.find((subject) => subject.id === id); // Use 'subjects' instead of 'courses'
    if (selectedSubject) {
      setSelectedItem(selectedSubject);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">My Subjects</h1>

      <div className="py-2 px-6">
        <AddCart refetch={refetch} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects
            .slice()
            .reverse()
            .map((subject) => (
              <Card
                key={subject.id}
                id={subject.id}
                title={subject.title}
                progress={subject.progress}
                icon={subject.icon}
                bgColor={subject.bgColor}
                onPlusClick={handlePlusClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onTitleClick={handleTitleClick} // Pass handleTitleClick to Card
              />
            ))}
        </div>
        {/* ItemDialog to show details and edit notes */}
        {selectedItem && (
          <ItemDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            item={selectedItem} // Pass the selected item
          />
        )}
      </div>

      {/* Render DeleteDialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyCourses;
