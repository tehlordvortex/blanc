import { playlistsDB } from '@/library.db'

export default {
  getAllPlaylists (projection) {
    return playlistsDB.find({}, projection).execAsync()
  },
  createPlaylist (name, songID) {
    return playlistsDB.findOneAsync({ name })
      .then(playlist => {
        if (playlist) {
          throw new Error('Playlist already exists!')
        } else {
          playlist = {
            name,
            songs: [songID]
          }
          playlistsDB.insert(playlist)
        }
      })
  },
  changeName (name, newName) {
    return playlistsDB.findOneAsync({ name })
      .then(playlist => {
        if (!playlist) {
          throw new Error('Playlist doesn\'t exist!')
        } else {
          playlist.name = newName
          playlist.save()
        }
      })
  },
  addSongToPlaylist (name, songID) {
    return playlistsDB.findOneAsync({ name })
      .then(playlist => {
        if (!playlist) {
          throw new Error('Playlist doesn\'t exist!')
        } else {
          if (!playlist.songs.some(id => id === songID)) playlist.songs.push(songID)
          playlist.save()
        }
      })
  },
  removeSongFromPlaylist (name, songID) {
    return playlistsDB.findOneAsync({
      name
    })
      .then(playlist => {
        if (!playlist) {
          throw new Error('Playlist doesn\'t exist!')
        } else {
          playlist.songs = playlist.songs.filter(id => id !== songID)
          playlist.save()
        }
      })
  },
  deletePlaylist (name) {
    return playlistsDB.removeAsync({ name })
  }
}
