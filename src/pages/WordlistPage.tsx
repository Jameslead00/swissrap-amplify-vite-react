import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';
import { useNavigate } from 'react-router-dom';
import { Add, Search, PlayArrow } from '@mui/icons-material';


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
  const [lists, setLists] = useState<List[]>([]);
  const [userLists, setUserLists] = useState<List[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllLists, setShowAllLists] = useState(false);

  const navigate = useNavigate();

  const handlePlay = (listId: string) => {
    navigate(`/play/${listId}`);
  };

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

  const filteredLists = (showAllLists ? lists : userLists).filter(list =>
    list.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = () => {
    navigate('/create-list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '20px' }}>
      <button
        onClick={handleCreateList}
        style={{
          background: 'transparent',
          color: 'black',
          border: '2px solid black',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}
      >
        <Add style={{ marginRight: '5px' }} /> Create List
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAllLists(false)}
          style={{ 
            fontWeight: !showAllLists ? 'bold' : 'normal',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: !showAllLists ? 'black' : '#4a4a4a'
          }}
        >
          My Lists
        </button>
        <span style={{ margin: '0 10px', color: '#4a4a4a' }}>|</span>
        <button
          onClick={() => setShowAllLists(true)}
          style={{ 
            fontWeight: showAllLists ? 'bold' : 'normal',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showAllLists ? 'black' : '#4a4a4a'
          }}
        >
          All Lists
        </button>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search lists"
          style={{ 
            width: '100%', 
            padding: '12px 40px 12px 20px', 
            borderRadius: '25px',
            border: '1px solid #e0e0e0',
            fontSize: '16px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            outline: 'none',
          }}
        />
        <Search style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
      </div>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        width: '100%', 
        maxWidth: '400px',
        background: 'transparent'
      }}>
        {filteredLists.map(list => (
          <li key={list.id} style={{ 
            marginBottom: '10px', 
            padding: '15px', 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer',
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{list.name}</span>
            <PlayArrow 
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(list.id);
              }}
              style={{ cursor: 'pointer', color: '#4a4a4a' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default WordlistPage;