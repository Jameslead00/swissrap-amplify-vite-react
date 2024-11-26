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
      const wordList = result.data.map(word => word.content ?? '');
    // Shuffle the array using Fisher-Yates algorithm
    const shuffledWords = [...wordList].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const SpeedControl: React.FC = () => (
    <Box
      sx={{
        position: 'fixed',
        bottom: '100px',
        left: '0',
        right: '0',
        bgcolor: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <Slider
        orientation="horizontal"
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
          width: '80%',
          '& .MuiSlider-thumb': {
            width: 28,
            height: 28,
          },
          '& .MuiSlider-track': {
            height: 8
          },
          '& .MuiSlider-rail': {
            height: 8
          }
        }}
      />
      <Box sx={{ minWidth: '60px', textAlign: 'center' }}>
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
      <SpeedControl />
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