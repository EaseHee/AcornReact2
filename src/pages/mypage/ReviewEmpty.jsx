import { MdOutlineRateReview } from "react-icons/md";
import { EmptyState } from "../../components/ui/empty-state"

const ReviewEmpty = () => {
  return (
    <EmptyState
      icon={<MdOutlineRateReview />}
      title="작성한 리뷰가 없습니다."
      description="소중한 리뷰를 작성해주세요."
    />
  )
}

export default ReviewEmpty;