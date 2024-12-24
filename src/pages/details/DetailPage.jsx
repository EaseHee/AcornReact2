import React from 'react';
import { Box } from '@chakra-ui/react';
import Logo from './Logo';
import ImageSlider from './ImageSlider';
import RestaurantInfo from './RestaurantInfo';
import Map from './Map';
import ReviewTabs from './ReviewTabs';

const DetailPage = () => {
  return (
    <Box px="25%" py={4}>
      <Logo />

      <ImageSlider />

      <Box display="flex" flexDirection={['column', 'row']} gap={4}>
        <Box flex={2}>
          <RestaurantInfo />
        </Box>
        <Box flex={1}>
          <Map />
        </Box>
      </Box>

      <ReviewTabs />
    </Box>
  );
};

export default DetailPage;
