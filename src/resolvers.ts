import { Resolvers } from "./types";

export const resolvers: Resolvers = {
  Query: {
    featuredPlaylists: (_, __, { dataSources }) => {
      return dataSources.spotifyAPI.getFeaturedPlaylists();
    },
    playlist: (_, { id }, { dataSources }) => {
      return dataSources.spotifyAPI.getPlaylist(id);
    },
  },
  Playlist: {
    tracks: ({ id, tracks }, __, { dataSources }) => {
      return tracks.items
        ? tracks.items.map(({ track }) => track)
        : dataSources.spotifyAPI.getTracks(id); // make a call to the REST API for tracks
    },
  },
  Track: {
    durationMs: (parent) => parent.duration_ms,
  },
  Mutation: {
    addItemsToPlaylist: async (_, { input }, { dataSources }) => {
      try {
        const response = await dataSources.spotifyAPI.addItemsToPlaylist(input);
        console.log(response);
        return {
          code: 200,
          success: true,
          message: "Tracks added to playlist!",
          playlistId: response.snapshot_id,
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${err}`,
          playlistId: null,
        };
      }
    },
  },
  AddItemsToPlaylistPayload: {
    playlist: ({ playlistId }, _, { dataSources }) => {
      return dataSources.spotifyAPI.getPlaylist(playlistId);
    },
  },
};
