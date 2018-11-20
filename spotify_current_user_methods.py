def current_user_playlist_tracks(spotify, playlist_id=None, fields=None, limit=100, offset=0, market=None):
    plid = spotify._get_id('playlist', playlist_id)
    return spotify._get("playlists/%s/tracks" % plid, limit=limit, offset=offset, fields=fields, market=market)


def current_user_playlist_create(spotify, playlist_name, public=True):
        data = {'name': playlist_name, 'public': public, 'description': 'New playlist with name {}'.format(playlist_name)}
        return spotify._post("me/playlists", payload=data)


def current_user_playlist_add_tracks(spotify, playlist_id, tracks, position=None):
    plid = spotify._get_id('playlist', playlist_id)
    ftracks = [spotify._get_uri('track', tid) for tid in tracks]
    return spotify._post("playlists/%s/tracks" % plid, payload=ftracks, position=position)