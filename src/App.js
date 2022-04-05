import './App.css';
import { ChakraProvider, Container } from '@chakra-ui/react'
import EtherNote from './EtherNote';

function App() {
  return (
    <ChakraProvider>
    <Container>
      <EtherNote />
    </Container>
    </ChakraProvider>
  );
}

export default App;
