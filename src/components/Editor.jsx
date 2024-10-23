import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/contentApi'; // Using contentApi

// Debounce function to limit how often the save function is called
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const Editor = ({ data, editorBlock, subjects_id, content_id, itemName, setSaving, readOnly = false }) => {
  const editorInstance = useRef(null);
  const [updateContent] = useUpdateContentMutation();

  const saveContent = useCallback(
    debounce(async (newData) => {
      const matricNo = localStorage.getItem('matricNo');
      console.log('Checking matricNo before saving:', matricNo);

      if (!matricNo) {
        console.warn('Cannot save content. Guest mode (no matricNo found in localStorage).');
        setSaving('Cannot save in guest mode.');
        return;
      }

      if (!subjects_id || !content_id) {
        console.error('subjects_id or content_id is undefined, cannot save content.');
        return;
      }

      setSaving('saving'); // Set status to "Saving..."
      console.log('Sending the following content data to the backend:', {
        content_id,
        subjects_id,
        matric: matricNo,
        content: newData,
        name: itemName,
      });

      try {
        const result = await updateContent({
          content_id,
          subjects_id,
          matric: matricNo,
          content: newData,  // Pass the updated content
          name: itemName,
        }).unwrap();

        console.log('Content successfully saved to API:', result);
        setSaving('saved'); // Set status to "Saved"
      } catch (saveError) {
        console.error('Error saving content to API:', saveError);
      }
    }, 1000),
    [updateContent, subjects_id, content_id, itemName, setSaving]
  );

  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: EDITOR_JS_TOOLS,
        readOnly: readOnly,

        onReady: () => {
          editorInstance.current = editor;
        },
        async onChange(api) {
          if (!readOnly) {
            const newData = await api.saver.save();
            saveContent(newData); // Trigger save to API if allowed
          }
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [data, editorBlock, saveContent, readOnly]);

  return <div id={editorBlock} />;
};

export default Editor;
