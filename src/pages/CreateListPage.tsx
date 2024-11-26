import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';
import { useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();
  const CreateListPage: React.FC = () => {
    const [listName, setListName] = useState('');
    const [words, setWords] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [bulkText, setBulkText] = useState('');
    const navigate = useNavigate();

    const handleAddWord = () => {
      if (currentWord.trim()) {
        setWords([...words, currentWord.trim()]);
        setCurrentWord('');
      }
    };

    const handleBulkImport = () => {
      if (bulkText.trim()) {
        // Split by both newlines and spaces, filter out empty strings
        const newWords = bulkText
          .split(/[\n\s]+/)
          .map(word => word.trim())
          .filter(word => word.length > 0);
      
        setWords([...words, ...newWords]);
        setBulkText('');
      }
    };

    const handleCreateList = async () => {
      try {
        const { userId } = await getCurrentUser();
        const newList = await client.models.List.create({
          userId,
          name: listName,
          isPublic: false,
        });

        if ('data' in newList && newList.data?.id) {
          const listId = newList.data?.id;
          await Promise.all(words.map(word => 
            client.models.Word.create({
              listId,
              content: word,
            })
          ));
          navigate('/wordlist');
        }
      } catch (error) {
        console.error('Error creating list:', error);
      }
    };

    return (
      <div style={{
        padding: '20px',
        paddingBottom: '100px', // Add padding to account for footer
        height: '100vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <h1>Create New List</h1>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Enter list name"
        />
      
        <div>
          <h3>Add Single Word</h3>
          <input
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            placeholder="Enter a word"
          />
          <button onClick={handleAddWord}>Add Word</button>
        </div>

        <div>
          <h3>Bulk Import Words</h3>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Paste multiple words separated by spaces or new lines"
            rows={5}
            style={{ width: '100%', maxWidth: '500px' }}
          />
          <button onClick={handleBulkImport}>Import Words</button>
        </div>

        <div>
          <h3>Word List ({words.length} words)</h3>
          <ul>
            {words.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>

        <button 
          onClick={handleCreateList}
          style={{
            marginBottom: '20px' // Add some space before the footer
          }}
        >
          Create List
        </button>
      </div>
    );
  };
export default CreateListPage;