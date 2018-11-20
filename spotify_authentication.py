import os
import webbrowser

import spotipy
import spotipy.oauth2 as oauth2


def prompt_for_user_token(username, scope=None, client_id=None, client_secret=None, redirect_uri=None):

    if not client_id:
        client_id = os.getenv('SPOTIPY_CLIENT_ID')

    if not client_secret:
        client_secret = os.getenv('SPOTIPY_CLIENT_SECRET')

    if not redirect_uri:
        redirect_uri = os.getenv('SPOTIPY_REDIRECT_URI')

    if not client_id:
        raise spotipy.SpotifyException(550, -1, 'no credentials set')

    sp_oauth = oauth2.SpotifyOAuth(client_id, client_secret, redirect_uri, scope=scope, cache_path=".cache-" + username)

    auth_url = sp_oauth.get_authorize_url()
    return auth_url

