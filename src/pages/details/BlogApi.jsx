import axios from "axios";

const fetchBlogReviews = async (query) => {
  const API_KEY = "38c8d75fe8f50a5228b24a1aa963a86a"; // 발급받은 REST API 키
  const url = "https://dapi.kakao.com/v2/search/blog";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`,
      },
      params: {
        query: query, // 검색어
        size: 5,     // 가져올 개수 (최대 50)
      },
    });
    return response.data.documents;
  } catch (error) {
    console.error("블로그 데이터를 불러오지 못했습니다.", error);
    return [];
  }
};

export default fetchBlogReviews;