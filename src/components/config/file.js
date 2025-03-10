import {storage} from "./cloudinary";
 import { getDownloadURL,uploadBytes, ref } from "./cloudinary";
 
 
 
 const uploadFile = async (file) =>{
     
     
     const storageRef = ref(storage, file.name);
     // lưu cái file này lên firebase
     const response = await uploadBytes(storageRef, file);
     // => lấy cái đường dẫn đến file vừa tạo
     const downloadURL = await getDownloadURL(response. ref);
     return downloadURL;
 }
 
 export default uploadFile;