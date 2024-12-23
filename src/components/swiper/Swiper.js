// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './mainswiper.css';
// Import required modules
import { Mousewheel, Pagination, Autoplay } from 'swiper/modules';
export default function MainSwiper() {
    return (
    <div className="swiper-container">
      <Swiper
        modules={[Mousewheel, Pagination, Autoplay]} // 사용할 모듈 설정        
        pagination={{ clickable: true }} // 페이지네이션 활성화
        spaceBetween={50} // 슬라이드 간 간격
        slidesPerView={1} // 한 번에 보여줄 슬라이드 개수
        speed={500} // 전환 속도
        mousewheel={true}
        direction={'vertical'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide>
          <div className="swiper-slide-content">
            <div className="text-container">              
              <p>
                상호명<br></br>
                카테고리<br></br>
                메뉴
              </p>
            </div>
            <img
              className="slide-image"
              alt="사진"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSampcbM_6WvkWiZ88Rpsd1JbzvrXKm8EMvJw&s"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="swiper-slide-content">
            <div className="text-container">
              <h1>상호명</h1>
              <p>
                카테고리<br />
                메뉴
              </p>
            </div>
            <img
              className="slide-image"
              alt="사진"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStqQBAUYBAfwyvGCTBMkq6e3XTWiA5MPXBRg&s"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
    );
  }