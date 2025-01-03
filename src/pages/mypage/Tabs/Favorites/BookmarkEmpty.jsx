import { EmptyState } from "../../components/ui/empty-state"
import { LuBookMarked } from "react-icons/lu";

const BookmarkEmpty = () => {
  return (
    <EmptyState
      icon={<LuBookMarked />}
      title="즐겨찾기한 음식점이 없습니다."
      description="다양한 음식점을 즐겨찾기 해주세요."
    />
  )
}

export default BookmarkEmpty;