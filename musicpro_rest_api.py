from flask import Flask, request
import json
from spotify_musicbrainz_search import search_artist, search_album, search_song, search_work, search

import spotipy
import spotipy.util as util

scope = "user-read-private playlist-read-private playlist-modify-public playlist-modify-private"

app = Flask(__name__)


@app.route("/home", methods=['POST'])
def init():
    username = request.json['username']
    token = util.prompt_for_user_token(
        username=username,
        scope=scope
    )
    global spotify
    spotify = spotipy.Spotify(auth=token)
    return json.dumps(spotify.current_user_playlists())


@app.route("/home/search/<text>")
def list_spotify_results(text):
    return json.dumps(search(spotify, text))


@app.route("/home/artist/<spotify_id>")
def get_artist_info(spotify_id):
    spotify_result, music_brainz_result = search_artist(spotify, spotify_id)
    return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/song/<spotify_id>")
def get_song_info(spotify_id):
    spotify_result, music_brainz_result = search_song(spotify, spotify_id)
    return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/album/<spotify_id>")
def get_album_info(spotify_id):
    spotify_result, music_brainz_result = search_album(spotify, spotify_id)
    return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/work/<spotify_id>")
def get_work(spotify_id):
    spotify_result = search_work(spotify, spotify_id)
    return json.dumps(spotify_result)


@app.route("/home/playlists")
def list_playlist():
    return json.dumps(spotify.current_user_playlists())


@app.route("/home/playlists/<playlist_id>/tracks")
def list_tracks_in_playlist(playlist_id):
    result = current_user_playlist_tracks(playlist_id=playlist_id)
    return json.dumps(result)


@app.route("/home/playlists/new/<playlist_name>")
def create_playlist(playlist_name):
    current_user_playlist_create(playlist_name=playlist_name)
    return json.dumps(spotify.current_user_playlists())


@app.route("/home/playlists/<playlist_id>/add/<track_id>")
def add_to_playlist(playlist_id, track_id):
    current_user_playlist_add_tracks(playlist_id=playlist_id, tracks=[track_id])
    return json.dumps(current_user_playlist_tracks(playlist_id=playlist_id))


def current_user_playlist_tracks(playlist_id=None, fields=None, limit=100, offset=0, market=None):
    plid = spotify._get_id('playlist', playlist_id)
    return spotify._get("playlists/%s/tracks" % plid, limit=limit, offset=offset, fields=fields, market=market)


def current_user_playlist_create(playlist_name, public=True):
        data = {'name': playlist_name, 'public': public, 'description': 'New playlist with name {}'.format(playlist_name)}
        return spotify._post("me/playlists", payload=data)


def current_user_playlist_add_tracks(playlist_id, tracks, position=None):
    plid = spotify._get_id('playlist', playlist_id)
    ftracks = [spotify._get_uri('track', tid) for tid in tracks]
    return spotify._post("playlists/%s/tracks" % plid, payload=ftracks, position=position)


if __name__ == '__main__':
    app.run()

