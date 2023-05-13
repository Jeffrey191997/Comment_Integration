import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import CommentCard from './components/CommentCard';
import Cookies from 'js-cookie';
import Axios from '../../../share/AxiosInstance';

const CommentModal = ({ open = false, handleClose = () => {} }) => {
  const [textField, setTextField] = useState('');
  const [comments, setComments] = useState([]);

  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);

  useEffect(() => {
    // 1. check if user is logged in
    try {
      const userToken = Cookies.get('UserToken');
      if (userToken !== undefined && userToken !== 'undefined') {
        // 2. call API to get notes
        Axios.get('/comment', { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
          // 3. set notes to state
          const fetchedComments = res.data.data.map((el) => {
            return {
              id: el.id,
              msg: el.text,
            };
          });
          setComments(fetchedComments);
          console.log(fetchedComments);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddComment = async () => {
    // TODO implement logic
    console.log(textField)
    try {
      const userToken = Cookies.get('UserToken');
      // console.log(userToken);
      const response = await Axios.post(
        '/comment',
        { text: textField },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setComments([...comments, { id: Math.random(), msg: textField }]);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </Box>
        <Box
          sx={{
            overflowY: 'scroll',
            maxHeight: 'calc(400px - 2rem)',
            '&::-webkit-scrollbar': {
              width: '.5rem', // chromium and safari
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#999999',
              borderRadius: '10px',
            },
          }}
        >
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment.id} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
