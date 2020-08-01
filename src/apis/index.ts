import axios from "axios";

export const baseURL = "http://humming.koreacentral.cloudapp.azure.com";

type GetMusicAPI = (
  latitude: number,
  longitude: number
) => Promise<GetMusicResponse>;

type GetMusicResponse = {
  recommends: MusicItem[];
  weatherDescription: string;
  weatherStatus: string;
  youtubeUrl: string;
};

type MusicItem = {
  channelId: string;
  kind: string;
  playListId: string;
  videoId: string;
};

export const getMusic: GetMusicAPI = async (latitude, longitude) => {
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
