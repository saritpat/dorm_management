import axios from "axios";

export const uploadFile = async (authtoken, id, formData) => {
        return await axios.post(
          process.env.REACT_APP_API + "/upload/" + id,
          formData,
          {
            headers: {
              authtoken,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      };