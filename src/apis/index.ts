import axios from "axios";

export const baseURL = "http://humming.koreacentral.cloudapp.azure.com";

export const getMusicAPI: GetMusicAPI = async (latitude, longitude) => {
  try {
    const result = await axios.get(`${baseURL}/recommend-musics`, {
      params: {
        latitude,
        longitude,
      },
    });
    return result.data;
  } catch (err) {}
};
