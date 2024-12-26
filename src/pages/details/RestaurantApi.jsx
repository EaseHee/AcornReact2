// 이미지 URL이 유효한지 확인하는 함수
const validateImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// 여러 이미지 URL을 검증하는 함수
const validateImages = async (urls) => {
  const validationPromises = urls.map(validateImage);
  const results = await Promise.all(validationPromises);
  return urls.filter((_, index) => results[index]);
};

// 주소에서 '구', '군' 앞 단어만 추출하는 함수
const extractKeyLocation = (address) => {
  if (!address) return "";
  const match = address.match(/(?:\s|^)(\S+)(구|군)/); // 단어 + '구', '군'
  return match ? match[1] : ""; // 예: '서울시 강남구 영동대로86길' -> '강남'
};

// 음식점 이미지를 가져오는 함수
const fetchRestaurantImages = async (restaurantName, address) => {
  const API_KEY = "60ddc85bdd372041c11e1dc97e03d442";

  // 주소에서 키워드 추출
  const keyLocation = extractKeyLocation(address);
  const query = `${restaurantName} ${keyLocation}`; // 음식점명 + 추출된 키워드
  const API_URL = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(query)}&size=30`; // 카카오 API URL

  console.log("카카오 검색어:", query); // 확인용 로그 출력

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`카카오 API 요청 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // 이미지 URL 추출
    const imageUrls = data.documents.map((doc) => doc.image_url);

    // 이미지 검증
    const validImages = await validateImages(imageUrls);

    // 최대 5개까지만 반환
    return validImages.slice(0, 5);
  } catch (error) {
    console.error("fetchRestaurantImages 에러:", error);
    return [];
  }
};

export default fetchRestaurantImages;
