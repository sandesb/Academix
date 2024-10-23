import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddContentCopyMutation } from '../redux/contentApi'; // Custom API for adding content copy

export const useHandleStudyClick = () => {
  const navigate = useNavigate();
  const [addContentCopy] = useAddContentCopyMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStudyClick = async (item) => {
    setLoading(true);
    setError(null);

    const matricNo = localStorage.getItem('matricNo'); // Get matric number from local storage
    const isGuest = !matricNo; // Check if the user is a guest

    try {
      if (isGuest) {
        // Guest Mode: Fetch content where matric is NULL
        console.log('Guest mode: Fetching content where matric is NULL for subject_id:', item.id);

        try {
          // Use your custom API endpoint to fetch guest content
          const response = await fetch(`/api/content?subjects_id=${item.id}&matric=null`, {
            method: 'GET',
          });
          const guestContent = await response.json();

          if (guestContent.error) {
            console.error('Error fetching guest content:', guestContent.error);
            setError(guestContent.error);
            setLoading(false);
            return;
          }

          if (!guestContent || guestContent.length === 0) {
            console.error('No original content found for guest mode with subject_id:', item.id);
            setError('No content found for guests.');
            setLoading(false);
            return;
          }

          // Proceed to navigate to the notes page with guest content
          console.log('Navigating to notes page with guest content.');
          navigate(`/notes/${item.id}`, { state: { title: item.title, content: guestContent } });
          setLoading(false);
          return;
        } catch (fetchError) {
          console.error('Error fetching guest content:', fetchError);
          setError(fetchError);
          setLoading(false);
          return;
        }
      }

      // For logged-in users (i.e., matricNo exists)
      console.log('Checking if content for subject_id:', item.id, 'and matric:', matricNo, 'already exists.');

      // Check if content for the current subject and matric_no already exists
      const response = await fetch(`/api/content?subjects_id=${item.id}&matric=${matricNo}`, {
        method: 'GET',
      });
      const existingContent = await response.json();

      if (existingContent.error) {
        console.error('Error checking existing content:', existingContent.error);
        setError(existingContent.error);
        setLoading(false);
        return;
      }

      if (existingContent && existingContent.length > 0) {
        // Content already exists for this subject and matric number
        console.log('Content already copied for subject_id:', item.id, 'and matric:', matricNo);
        navigate(`/notes/${item.id}`, { state: { title: item.title, content: existingContent } });
      } else {
        // Proceed to fetch and copy if no content exists for this subject and matric
        console.log('No existing content found, proceeding with copying.');

        // Fetch the original content data to copy
        const fetchResponse = await fetch(`/api/content?subjects_id=${item.id}&matric=null`, {
          method: 'GET',
        });
        const originalContent = await fetchResponse.json();

        if (!originalContent || originalContent.length === 0) {
          console.error('No original content found to copy for subject_id:', item.id);
          setError('No content found to copy.');
          setLoading(false);
          return;
        }

        const copiedNote = originalContent[0].note; // Get the original note content
        console.log('Copying this note:', copiedNote);

        // Create the new content object
        const newContent = {
          subjects_id: item.id, // Same subject ID
          name: item.title, // Subject's title/name
          note: copiedNote, // Copy the original note content
          matric: matricNo, // Set the matric number for the student
        };

        console.log('Inserting new content:', newContent);

        // Use the mutation to insert the content copy
        try {
          const { data, error: insertError } = await addContentCopy(newContent).unwrap();

          if (insertError) {
            console.error('Error copying content:', insertError);
            setError(insertError);
          } else {
            console.log('Content copy created successfully:', data);
            // Navigate to the notes page after successful insertion
            navigate(`/notes/${item.id}`, { state: { title: item.title, content: newContent } });
          }
        } catch (err) {
          console.error('Error inserting new content:', err);
          setError(err);
        }
      }
    } catch (err) {
      console.error('Error during copy operation:', err);
      setError(err);

      // Ensure navigation happens even if there is an error
      navigate(`/notes/${item.id}`, { state: { title: item.title } });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleStudyClick, // The main function to be used
    loading,
    error,
  };
};
