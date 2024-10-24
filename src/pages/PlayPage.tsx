import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { Slider, Box } from '@mui/material';


const client = generateClient<Schema>();

const PlayPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [listName, setListName] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordInterval, setWordInterval] = useState(5000);
  const [showOptions, setShowOptions] = useState(false);
  const [isTapMode, setIsTapMode] = useState(false);

  useEffect(() => {
    if (listId) {
      fetchListDetails(listId);
      fetchWords(listId);
    }
  }, [listId]);

  useEffect(() => {
    if (words.length > 0 && !isTapMode) {
      const timer = setInterval(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, wordInterval);
  
      return () => clearInterval(timer);
    }
  }, [words, wordInterval, isTapMode]);

  const fetchListDetails = async (id: string) => {
    try {
      const result = await client.models.List.get({ id });
      setListName(result.data?.name ?? '');
    } catch (error) {
      console.error('Error fetching list details:', error);
    }
  };

  const fetchWords = async (id: string) => {
    try {
      const result = await client.models.Word.list({ filter: { listId: { eq: id } } });
      setWords(result.data.map(word => word.content ?? ''));
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const SpeedControl: React.FC = () => (
    <Box
      sx={{
        position: 'absolute',
        bottom: '60px',
        right: '20px',
        bgcolor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Slider
        orientation="vertical"
        min={1000}
        max={21000}
        step={1000}
        value={wordInterval}
        onChange={(_, value: number | number[]) => {
          const newValue = value as number;
          if (newValue === 21000) {
            setIsTapMode(true);
          } else {
            setIsTapMode(false);
            setWordInterval(newValue);
          }
        }}
        
        
        sx={{
          height: 150,
          '& .MuiSlider-thumb': {
            width: 28,
            height: 28,
          },
          '& .MuiSlider-track': {
            width: 8
          },
          '& .MuiSlider-rail': {
            width: 8
          }
        }}
      />
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        {isTapMode ? 'Tap Mode' : `${wordInterval / 1000}s`}
      </Box>
    </Box>
  );
  
  

  const handleWordTap = () => {
    if (isTapMode) {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
    }}>
      <h1 style={{
        textAlign: 'center',
        padding: '20px 0',
      }}>
        {listName}
      </h1>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div
          onClick={handleWordTap}
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '10px',
            cursor: isTapMode ? 'pointer' : 'default'
          }}
        >
          {words[currentWordIndex]}
        </div>
        {!isTapMode && (
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#e0e0e0',
            position: 'relative',
          }}>
            <div
              key={currentWordIndex}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                backgroundColor: 'black',
                animation: `fillLine ${wordInterval / 1000}s linear`,
              }}
            />
          </div>
        )}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '100px',
        right: '20px',
      }}>
        <button onClick={() => setShowOptions(!showOptions)}>
          Configure Speed
        </button>
        {showOptions && <SpeedControl />}
      </div>
      <style>{`
        @keyframes fillLine {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
  
};

export default PlayPage;