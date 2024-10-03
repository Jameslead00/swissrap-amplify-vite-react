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
  const navigate = useNavigate();

  const handleAddWord = () => {
    if (currentWord.trim()) {
      setWords([...words, currentWord.trim()]);
      setCurrentWord('');
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
    <div>
      <h1>Create New List</h1>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="Enter list name"
      />
      <div>
        <input
          type="text"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          placeholder="Enter a word"
        />
        <button onClick={handleAddWord}>Add Word</button>
      </div>
      <ul>
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
      <button onClick={handleCreateList}>Create List</button>
    </div>
  );
};

export default CreateListPage;