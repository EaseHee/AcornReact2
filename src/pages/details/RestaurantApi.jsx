// 이미지 슬라이더에서 이미지 가져오는 api 컴포넌트

// 이미지 URL이 유효한지 확인하는 함수
const validateImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image(); // 이미지 객체를 생성
    img.onload = () => resolve(true); // 이미지가 성공적으로 로드되면 true 반환
    img.onerror = () => resolve(false); // 이미지 로드 실패 시 false 반환
    img.src = url; // 주어진 URL로 이미지 로드 시작
  });
};

// 여러 이미지 URL을 검증하는 함수
const validateImages = async (urls) => {
  // 각 URL에 대해 validateImage 함수를 호출하여 검증 결과를 Promise로 저장
  const validationPromises = urls.map(validateImage);
  
  // 모든 이미지 검증이 완료될 때까지 대기
  const results = await Promise.all(validationPromises);
  
  // 검증 결과가 true인 URL만 반환
  return urls.filter((_, index) => results[index]);
};

// 음식점 이미지를 가져오는 함수
const fetchRestaurantImages = async (restaurantName, restaurantAddress) => {
  // 카카오 API 키
  const API_KEY = "60ddc85bdd372041c11e1dc97e03d442"; 
  // 카카오 이미지 검색 API URL
  const API_URL = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(restaurantName)}&size=30`; // 30개 검색해서 그 중 유효한 url만 최소 0개에서 최대 5개 가져옴.
  
  try {
    // 카카오 API에 요청을 보냄
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`, // API 인증을 위한 헤더 추가
      },
    });

    // 요청이 실패하면 에러를 발생
    if (!response.ok) {
      throw new Error(`카카오 API 요청 실패: ${response.statusText}`);
    }

    const data = await response.json(); // 응답 데이터를 JSON으로 파싱

    // API 응답에서 이미지 URL 추출
    const imageUrls = data.documents.map((doc) => doc.image_url);

    // 이미지 유효성 검증
    const validImages = await validateImages(imageUrls);

    // 최대 5개의 유효한 이미지만 반환
    return validImages.slice(0, 5);
  } catch (error) {
    // console.error("슬라이더 이미지 에러:", error); // 에러가 발생하면 콘솔에 로그
    return []; // 에러 발생 시 빈 배열 반환
  }
};

export default fetchRestaurantImages;
