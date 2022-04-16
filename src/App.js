import { ChakraProvider } from '@chakra-ui/react'
import EtherNote from './EtherNote';

function App() {
  return (
    <ChakraProvider>
      <EtherNote />
    </ChakraProvider>
  );
}

export default App;
