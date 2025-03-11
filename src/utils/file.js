
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {storage} from "../components/config/firebase";

const uploadFile = async (File) => {
    // luu du lieu

    // => lay du lieu 
    const storageRef = ref (storage, File.name);
    const respones = await uploadBytes(storageRef, File);
    const downloadURL = await getDownloadURL(respones.ref);
    return downloadURL;
}
export default uploadFile; 