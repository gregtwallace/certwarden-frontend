import { Container, Paper } from '@mui/material';

const GridItemContainer = (props) => {
  return (
    <Container component={Paper} sx={{ p: 1, height: 1 }}>
      {props.children}
    </Container>
  );
};

export default GridItemContainer;
