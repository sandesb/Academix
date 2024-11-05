import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';
import AddCart from '../components/AddCart';
import ItemDialog from '../components/ItemDialog';
import {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '../redux/subjectsApi';
import DeleteDialog from '../components/DeleteDialog';

const HomePage = () => {
  const { handlePlusClick } = useCart();

  // Get values from localStorage
  const adminIsAuthenticated = localStorage.getItem('adminIsAuthenticated') === 'true';
  const matricNo = localStorage.getItem('matricNo');

  const matricValue = adminIsAuthenticated ? null : matricNo || 'GUEST';

  const { data: courses = [], error, isLoading, refetch } = useGetCoursesQuery({ matric: matricValue });

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = async (updatedCourse) => {
    try {
      const { data, error } = await updateCourse(updatedCourse).unwrap();
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedCourseId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(selectedCourseId).unwrap();
      setDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleTitleClick = (id) => {
    const selectedCourse = courses.find((course) => course.id === id);
    if (selectedCourse) {
      setSelectedItem(selectedCourse);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="">

      {/* Page Heading */}
      <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-blue-400 tracking-widest text-center relative">
        <span className="block lg:inline">Know Your</span>
        <span className="block lg:inline lg:pl-4">Academix</span>
        <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
          <span className="block lg:inline">Know Your</span>
          <span className="block lg:inline lg:pl-4">Academix</span>
        </span>
      </h1>

      {/* Add to Cart Section */}
      <div className="py-2 px-6">
        <AddCart refetch={refetch} />

        {/* Conditionally display SVGs if no courses are available */}
        {courses.length === 0 && (
          <div className="flex justify-center py-4">
            <img src="/src/assets/team.svg" alt="Illustration" className="w-full max-w-sm" />
            <img src="/src/assets/undraw.svg" alt="Illustration" className="w-full max-w-xs" />
          </div>
        )}

        {/* Display Cards when courses are available */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .slice()
            .reverse()
            .map((course) => (
              <Card
                key={course.id}
                id={course.id}
                title={course.title}
                progress={course.progress}
                icon={course.icon}
                bgColor={course.bgColor}
                onPlusClick={handlePlusClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onTitleClick={handleTitleClick}
              />
            ))}
        </div>

        {/* ItemDialog to show course details */}
        {selectedItem && (
          <ItemDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            item={selectedItem}
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
