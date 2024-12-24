

import React from "react";
import { Box, Text, Center } from "@chakra-ui/react";

const Map = () => {
  return (
    <Box 
      border="1px" 
      borderColor="gray.200" 
      borderRadius="md" 
      width="100%" 
      height="200px"
      bg="gray.100"
    >
      <Center height="100%">
        <Text color="gray.500">지도가 이곳에 표시될 예정입니다</Text>
      </Center>
    </Box>
  );
};

export default Map;