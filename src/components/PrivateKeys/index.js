import { useParams } from 'react-router-dom';

const PrivateKeys = () => {
  const { id } = useParams();

  return (
    <>
      <h2>Private Keys</h2>
      <h3>Key ID: {id}</h3>
      <ul></ul>
    </>
  );
};

export default PrivateKeys;
