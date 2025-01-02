import {Box, Image, Text} from "@chakra-ui/react";
import {Link} from "react-router-dom";

function Logo() {
    return (
        <Box as={Link} to="/" display={"flex"} alignItems="center">
            <Image src="/logo01.png" alt="맛.zip 로고" boxSize="50px" />
            <Text ml={2} color="orange.500" fontSize="xl" fontWeight="bold">private</Text>
        </Box>
    );
}

export default Logo;