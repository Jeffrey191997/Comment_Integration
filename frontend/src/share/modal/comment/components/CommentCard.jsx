import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Cookies from 'js-cookie';
import Axios from '../../../AxiosInstance';

const CommentCard = ({ comment = { id: -1, msg: '' } }) => {
  const [curComment, setCurComment] = useState(comment);
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.msg);

  const submit = useCallback(async () => {
    if (functionMode === 'update') {
      // TODO: Implement update logic
      try {
        console.log('Success');
        const userToken = Cookies.get('UserToken');
        console.log('CALLING REQUEST');
        console.log(comment.id);
        console.log(msg);

        const res = await Axios.patch(
          '/comment',
          {
            commentId: comment.id,
            text: msg,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log(res);
        setMsg(res.data.data.text);
        console.log(res.data.data.text);
        setCurComment({ id: res.data.data.id, msg: res.data.data.text });
      } catch (error) {
        console.log(error);
      }

      console.log('update');
      setFunctionMode('');
      setIsConfirm(false);
    } else if (functionMode === 'delete') {
      // TODO: Implement delete logic
      try {
        const userToken = Cookies.get('UserToken');
        console.log(userToken);
        const commentId = comment.id;
        const response = await Axios.delete(`/comment/${commentId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        console.log('good');
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      // TODO: setStatus (snackbar) to error
      console.log('error');
    }
  }, [functionMode, msg]);

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{curComment.msg}</Typography>
      ) : (
        <TextField
          sx={{ flex: 1 }}
          value={msg}
          onChange={(e) => {
            console.log(e.target.value);
            setMsg(e.target.value);
            console.log(msg);
          }}
        />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;
