type GetMusicAPI = (
  latitude: number,
  longitude: number
) => Promise<MusicRecommend>;

type MusicRecommend = {
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
