import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,    
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const DeleteConfirmationModal = ({ buttonText,title, children, sendId, onConfirm }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirm=()=>{
        onConfirm(); //Call the onConfirm function
        handleClose(); //Close the modal
    };

  return (
    <div>
      <Button onClick={handleOpen}>{buttonText}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {children} 
          </Typography>
          <div className='text-center' style={{ marginTop: '20px' }}>
            <Button onClick={handleConfirm} className='bg-danger text-white'>Yes</Button>
            <Button onClick={handleClose} style={{ marginLeft: '10px' }}>No</Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default DeleteConfirmationModal