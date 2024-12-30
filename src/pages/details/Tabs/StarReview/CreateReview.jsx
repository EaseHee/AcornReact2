import FileUpload from "./FileUpload";
import FormData from "./FormData";

export default function CreateReview({ memberNo, eateryNo, onChange }) {
  const handleDataChange = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      <FormData memberNo={memberNo} eateryNo={eateryNo} onChange={(data) => handleDataChange("formData", data)}></FormData>
      <FileUpload onChange={(files) => handleDataChange("files", files)}></FileUpload>
    </>
  );
}
