import React, { useState } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemDialog from '../components/ItemDialog'; // Import the ItemDialog
import {
  useGetSubjectsQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '../redux/subjectApi'; // Update to import the subject API hooks
import DeleteDialog from '../components/DeleteDialog';
import AddCart from '../components/AddCart';

const HomePage = () => {
  const { handlePlusClick } = useCart();

  // Get values from localStorage
  const adminIsAuthenticated = localStorage.getItem('adminIsAuthenticated') === 'true';
  const matricNo = localStorage.getItem('matricNo');

  // Determine matric value based on conditions
  const matricValue = adminIsAuthenticated ? null : matricNo || 'GUEST';

  // Fetch subjects based on the matric value
  const { data: subjects = [], error, isLoading, refetch } = useGetSubjectsQuery({ matric: matricValue });

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = async (updatedSubject) => {
    try {
      console.log('Updating subject:', updatedSubject);
      const { data, error } = await updateSubject(updatedSubject).unwrap();
      if (error) throw error;
      console.log('Subject updated successfully:', data);
      refetch(); // Refetch subjects to reflect the update
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedSubjectId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(selectedSubjectId).unwrap();
      console.log('Deleted subject with id:', selectedSubjectId);
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  const handleTitleClick = (id) => {
    const selectedSubject = subjects.find((subject) => subject.id === id);
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

  return (
    <div className="">
      <div className="py-2 px-6">

      <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-blue-400 tracking-widest text-center relative">
        <span className="block lg:inline">Know Your</span>
        <span className="block lg:inline lg:pl-4">Academix</span>
        <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
          <span className="block lg:inline">Know Your</span>
          <span className="block lg:inline lg:pl-4">Academix</span>
        </span>
      </h1>

      <div className="py-2 px-6">
        <AddCart refetch={refetch} />
        </div>


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

export default HomePage;
