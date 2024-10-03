import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();

type List = {
  id: string;
  userId: string | null;
  name: string | null;
  isPublic: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  owner: string | null;
};
  const WordlistPage: React.FC = () => {
    const navigate = useNavigate();
    const [lists, setLists] = useState<List[]>([]);
    const [userLists, setUserLists] = useState<List[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      fetchAllLists();
      fetchUserLists();
    }, []);

    async function fetchAllLists() {
      try {
        const result = await client.models.List.list();
        if ('data' in result) {
          const mappedLists = result.data.map(list => ({
            ...list,
            id: list.id,
          }));
          setLists(mappedLists);
        }
      } catch (error) {
        console.error('Error fetching all lists:', error);
      }
    }

    async function fetchUserLists() {
      try {
        const { userId } = await getCurrentUser();
        const result = await client.models.List.list({
          filter: { userId: { eq: userId } }
        });
        if ('data' in result) {
          const mappedUserLists = result.data.map(list => ({
            ...list,
            id: list.id
          }));
          setUserLists(mappedUserLists);
        }
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    }

    const handleCreateList = () => {
      navigate('/create-list');
    };

    return (
      <div className="wordlist-container" style={{ display: 'flex' }}>
        <div className="all-lists" style={{ flex: 1, marginRight: '20px' }}>
          <h2>All Lists</h2>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search lists"
          />
          <ul>
            {lists.map(list => (
              <li key={list.id}>{list.name}</li>
            ))}
          </ul>
        </div>
        <div className="divider" style={{ width: '1px', backgroundColor: '#ccc', margin: '0 20px' }}></div>
        <div className="user-lists" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2>My Lists</h2>
          <ul style={{ flex: 1 }}>
            {userLists.map(list => (
              <li key={list.id}>{list.name}</li>
            ))}
          </ul>
          <button onClick={handleCreateList} style={{ marginTop: 'auto' }}>Create List</button>
        </div>
      </div>
    );
  };

  export default WordlistPage;
