import React from 'react';
import { useParams } from 'react-router-dom';

import { Box } from '@chakra-ui/react';
import Logo from './Logo';
import ImageSlider from './ImageSlider';
import RestaurantInfo from './RestaurantInfo';
import Map from './Map';
import ReviewTabs from './ReviewTabs';

const DetailPage = () => {
  const {no} = useParams();
  
  return (
    <Box px="25%" py={4}>
      <Logo />

      <ImageSlider />

      <Box display="flex" flexDirection={['column'/* , 'row' */]} gap={4}>{/* flex-direction row/col에 대한 논의 필요 */}
        <Box flex={2}>
          <RestaurantInfo />
        </Box>
        <Box flex={1}>
          <Map no={no}/>
        </Box>
      </Box>

      <ReviewTabs />
    </Box>
  );
};

export default DetailPage;
