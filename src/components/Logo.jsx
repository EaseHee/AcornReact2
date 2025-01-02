import {Box, Image, Text} from "@chakra-ui/react";
import {Link} from "react-router-dom";

function Logo() {
    return (
        <Box as={Link} to="/" display={"flex"} alignItems="center">
            <Image src="/logo01.png" alt="forklog로고" />
            <Image src="/textlogo.png" alt="forklog로고"/>
        </Box>
    );
}

export default Logo;