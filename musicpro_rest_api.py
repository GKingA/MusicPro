import random
import string
from flask import Flask, request, session, redirect, make_response
from flask_cors import CORS
import json

from spotipy import SpotifyException

from spotify_musicbrainz_search import search_artist, search_album, search_song, search_work, search
import os
import spotipy.oauth2 as oauth2

import spotipy
from spotify_current_user_methods import current_user_playlist_create, current_user_playlist_tracks, \
    current_user_playlist_add_tracks

from spotify_authentication import prompt_for_user_token, refresh_token


scope = "user-read-private playlist-read-private playlist-modify-public playlist-modify-private"

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.urandom(24)


@app.before_request
def session_management():
    session.permanent = True


@app.route("/login")
def login():
    session['username'] = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
    url = prompt_for_user_token(
        username=session.get('username'),
        scope=scope
    )
    response = make_response(redirect(url, code=302))
    return response


@app.route("/home")
def init():
    print(session.get('username'))
    if request.args.get("code") is not None:
        code = request.args.get("code")
        spotify_oauth = oauth2.SpotifyOAuth(os.getenv('SPOTIPY_CLIENT_ID'), os.getenv('SPOTIPY_CLIENT_SECRET'),
                            os.getenv('SPOTIPY_REDIRECT_URI'), scope=scope, cache_path=".cache-" + session.get('username'))
        token_info = spotify_oauth.get_access_token(code)
        if 'access_token' in token_info:
            session['token'] = token_info['access_token']
        else:
            raise Exception("No valid authentication")
        if 'access_token' in token_info:
            session['token'] = token_info['access_token']
        else:
            raise Exception("No valid authentication")
    if session.get('token') is None:
        raise Exception("No valid authentication")
    response = make_response(redirect("http://127.0.0.1:4200/user", code=302))
    return response


@app.route("/home/search/<text>")
def list_spotify_results(text):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        return json.dumps(search(spotify, text))
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        return json.dumps(search(spotify, text))


@app.route("/home/artist/<spotify_id>")
def get_artist_info(spotify_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_artist(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_artist(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/song/<spotify_id>")
def get_song_info(spotify_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_song(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_song(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/album/<spotify_id>")
def get_album_info(spotify_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_album(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result, music_brainz_result = search_album(spotify, spotify_id)
        return json.dumps({"spotify": spotify_result, "musicbrainz": music_brainz_result})


@app.route("/home/work/<spotify_id>")
def get_work(spotify_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result = search_work(spotify, spotify_id)
        return json.dumps(spotify_result)
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        spotify_result = search_work(spotify, spotify_id)
        return json.dumps(spotify_result)


@app.route("/home/playlists")
def list_playlist():
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        playlists = spotify.current_user_playlists()
        return json.dumps([{"id": p["id"], "name": p["name"]} for p in playlists["items"]])
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        playlists = spotify.current_user_playlists()
        return json.dumps([{"id": p["id"], "name": p["name"]} for p in playlists["items"]])


@app.route("/home/playlists/<playlist_id>/tracks")
def list_tracks_in_playlist(playlist_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        result = current_user_playlist_tracks(spotify=spotify, playlist_id=playlist_id)
        return json.dumps([{"id": r["track"]["id"], "name": r["track"]["name"],
                            "artists": [{"id": a["id"], "name": a["name"]} for a in r["track"]["artists"]],
                            "album": {"id": r["track"]["album"]["id"], "images": r["track"]["album"]["images"],
                                      "name": r["track"]["album"]["name"]}} for r in result["items"]])
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        result = current_user_playlist_tracks(spotify=spotify, playlist_id=playlist_id)
        return json.dumps([{"id": r["track"]["id"], "name": r["track"]["name"],
                            "artists": [{"id": a["id"], "name": a["name"]} for a in r["track"]["artists"]],
                            "album": {"id": r["track"]["album"]["id"], "images": r["track"]["album"]["images"],
                                      "name": r["track"]["album"]["name"]}} for r in result["items"]])


@app.route("/home/playlists/new/<playlist_name>")
def create_playlist(playlist_name):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        current_user_playlist_create(spotify=spotify, playlist_name=playlist_name)
        return list_playlist()
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        current_user_playlist_create(spotify=spotify, playlist_name=playlist_name)
        return list_playlist()


@app.route("/home/playlists/<playlist_id>/add/<track_id>")
def add_to_playlist(playlist_id, track_id):
    try:
        spotify = spotipy.Spotify(auth=session.get('token'))
        current_user_playlist_add_tracks(spotify=spotify, playlist_id=playlist_id, tracks=[track_id])
        return list_tracks_in_playlist(playlist_id)
    except SpotifyException:
        session['token'] = refresh_token(session.get('username'), scope=scope)
        spotify = spotipy.Spotify(auth=session.get('token'))
        current_user_playlist_add_tracks(spotify=spotify, playlist_id=playlist_id, tracks=[track_id])
        return list_tracks_in_playlist(playlist_id)


@app.route("/logout")
def logout():
    session.pop('username', None)
    session.pop('token', None)
    if 'username' not in session and 'token' not in session:
        return json.dumps({'success': True})
    return json.dumps({'success': False})


if __name__ == '__main__':
    app.run()