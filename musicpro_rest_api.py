import random
import string

from flask import Flask, request, session, redirect
import json

from spotify_musicbrainz_search import search_artist, search_album, search_song, search_work, search
import os
import spotipy.oauth2 as oauth2

import spotipy
#import spotipy.util as util
from spotify_current_user_methods import current_user_playlist_create, current_user_playlist_tracks, \
    current_user_playlist_add_tracks

from spotify_authentication import prompt_for_user_token

scope = "user-read-private playlist-read-private playlist-modify-public playlist-modify-private"

app = Flask(__name__)


@app.route("/login")
def login():
    global token
    session['username'] = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    url = prompt_for_user_token(
        username=session['username'],
        scope=scope
    )
    return redirect(url, code=302)


@app.route("/home")
def init():
    if request.args.get("code") is not None:
        code = request.args.get("code")
        global token
        spotify_oauth = oauth2.SpotifyOAuth(os.getenv('SPOTIPY_CLIENT_ID'), os.getenv('SPOTIPY_CLIENT_SECRET'),
                            os.getenv('SPOTIPY_REDIRECT_URI'), scope=scope)
        token_info = spotify_oauth.get_access_token(code)
        if 'access_token' in token_info:
            token = token_info['access_token']
        else:
            raise Exception("No valid authentication")
    if token is None:
        raise Exception("No valid authentication")
    global spotify
    spotify = spotipy.Spotify(auth=token)
    return redirect("http://127.0.0.1:4200/user", code=302)


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


if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()

