import React, { useState } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemDialog from '../components/ItemDialog';
import {
  useGetSubjectsQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '../redux/subjectApi';
import DeleteDialog from '../components/DeleteDialog';
import AddCart from '../components/AddCart';

const HomePage = () => {
  const { handlePlusClick } = useCart();

  const adminIsAuthenticated = localStorage.getItem('adminIsAuthenticated') === 'true';
  const matricNo = localStorage.getItem('matricNo');
  const matricValue = adminIsAuthenticated ? null : matricNo || 'GUEST';

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
      refetch();
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
          <AddCart refetch={refetch} />
        </div>

        {/* Conditionally display undraw.svg and team.svg if no subjects are available */}
        {subjects.length === 0 && (
          <div className="flex justify-center py-4">
            <img src="/src/assets/team.svg" alt="Illustration" className="w-full max-w-sm" />
            <img src="/src/assets/undraw.svg" alt="Illustration" className="w-full max-w-xs" />
          </div>
        )}

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
                onTitleClick={handleTitleClick}
              />
            ))}
        </div>

        {selectedItem && (
          <ItemDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            item={selectedItem}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HomePage;
