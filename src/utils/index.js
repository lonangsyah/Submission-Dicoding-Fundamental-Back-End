/* eslint-disable camelcase */

//Song
const mapSongToDetailedModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    album_id,
  }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: album_id,
  });
  
  const mapSongToModel = ({
    id,
    title,
    performer,
  }) => ({
    id,
    title,
    performer,
  });
  
  //Album
  const mapAlbumToModel = ({
    id,
    name,
    year,
  }) => ({
    id,
    name,
    year,
  });
  
  module.exports = { mapAlbumToModel, mapSongToModel, mapSongToDetailedModel };
  