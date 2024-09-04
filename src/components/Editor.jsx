import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './Tool';
import { useUpdateContentMutation } from '../redux/coursesApi';

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

const Editor = ({ data, editorBlock, db_id, itemName }) => {
    const editorInstance = useRef(null);
    const [updateContent, { isLoading, isSuccess, isError, error }] = useUpdateContentMutation();

    // Log to check if db_id is correctly passed
    useEffect(() => {
        console.log('Editor received db_id:', db_id);
    }, [db_id]);

    const saveContent = useCallback(
        debounce(async (newData) => {
            if (!db_id) {
                console.error('db_id is undefined, cannot save content.');
                return;
            }

            console.log('Preparing to save content for db_id:', db_id);
            console.log('Content to save:', newData);

            try {

                const result = await updateContent({ db_id, content: newData, name: itemName }).unwrap();
                console.log('Content successfully saved to Supabase:', result);
            } catch (saveError) {
                console.error('Error saving content to Supabase:', saveError);
            }
        }, 1000),
        [updateContent, db_id, itemName]
    );

    useEffect(() => {
        if (!editorInstance.current && data) {
            console.log('Initializing EditorJS with data:', data);
            const editor = new EditorJS({
                holder: editorBlock,
                data: data,
                tools: EDITOR_JS_TOOLS,
                onReady: () => {
                    editorInstance.current = editor;
                },
                async onChange(api) {
                    const newData = await api.saver.save();
                    saveContent(newData);
                }
            });
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [data, editorBlock, saveContent]);

    // Extra logging to track the mutation state
    useEffect(() => {
        if (isLoading) {
            console.log('Saving content to Supabase...');
        }
        if (isSuccess) {
            console.log('Content saved successfully.');
        }
        if (isError) {
            console.error('Failed to save content:', error);
        }
    }, [isLoading, isSuccess, isError, error]);

    return <div id={editorBlock} />;
};

export default Editor;