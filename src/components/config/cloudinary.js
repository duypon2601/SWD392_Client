// export const uploadImage = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//   try {
//     const response = await fetch(import.meta.env.VITE_CLOUDINARY_API_URL, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     return data.secure_url; // Trả về URL ảnh đã upload
//   } catch (error) {
//     console.error("Lỗi khi upload ảnh:", error);
//     throw error;
//   }
// };
