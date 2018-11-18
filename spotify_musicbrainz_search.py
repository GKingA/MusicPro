from musicbrainz_requests import MusicBrainz


music_brainz = MusicBrainz()


def compare_strings(first, second):
    return len([i for i, j in zip(first, second) if i == j])


def compare_dates(first, second):
    first_date = first.split('-') if '-' in first else first.split('_')
    second_date = second.split('-') if '-' in second else second.split('_')
    if len(first_date) == 1 or len(second_date) == 1:
        return 1.0 if first_date[0] == second_date[0] else compare_strings(first_date[0], second_date[0]) / 4.0
    year_score = 1.0 if first_date[0] == second_date[0] else compare_strings(first_date[0], second_date[0]) / 4.0
    return 0.8 * year_score + 0.2 * (compare_strings(first_date[1:], second_date[1:]) / len(first_date[1:]))


def compare_artists(spotify_artist, music_brainz_artist):
    genre_score = len(set(spotify_artist['genres']) & set([name['name'] for name in music_brainz_artist['tags']])) \
                  / len(spotify_artist['genres'])
    name_score = compare_strings(spotify_artist['name'], music_brainz_artist['name']) / len(spotify_artist['name'])
    return 0.8 * name_score + 0.2 * genre_score


def compare_artist_lists(spotify_artists, music_brainz_artists):
    matches = []
    for artist1 in spotify_artists:
        match = []
        for artist2 in music_brainz_artists:
            match.append(compare_strings(artist1['name'], artist2['artist']['name']) / len(artist1['name']))
        matches.append(max(match))
    return sum(matches) / len(matches)


def compare_albums(spotify_album, music_brainz_album):
    title_score = compare_strings(spotify_album['name'], music_brainz_album['title']) / len(spotify_album['name'])
    if 'date' in music_brainz_album:
        date_score = compare_dates(spotify_album['release_date'], music_brainz_album['date'])
    else:
        date_score = 0.5
    if 'track-count' in music_brainz_album:
        track_count = 1.0 if spotify_album['total_tracks'] == music_brainz_album['track-count'] else 0.0
    elif 'track_count' in music_brainz_album:
        track_count = 1.0 if spotify_album['total_tracks'] == music_brainz_album['track_count'] else 0.0
    else:
        track_count = 0.5
    if 'artist-credit' in music_brainz_album:
        artist_score = compare_artist_lists(spotify_album['artists'], music_brainz_album['artist-credit'])
    elif 'artist_credit' in music_brainz_album:
        artist_score = compare_artist_lists(spotify_album['artists'], music_brainz_album['artist_credit'])
    else:
        artist_score = 0.0
    return 0.5 * title_score + 0.05 * date_score + 0.2 * track_count + 0.25 * artist_score


def compare_album_lists(spotify_album, music_brainz_albums):
    album_list = []
    for music_brainz_album in music_brainz_albums:
        album_list.append(compare_albums(spotify_album, music_brainz_album))
    return max(album_list)


def compare_songs(spotify_song, music_brainz_song):
    if 'artist-credit' in music_brainz_song:
        artist_score = compare_artist_lists(spotify_song['artists'], music_brainz_song['artist-credit'])
    elif 'artist_credit' in music_brainz_song:
        artist_score = compare_artist_lists(spotify_song['artists'], music_brainz_song['artist_credit'])
    else:
        artist_score = 0.0
    album_score = compare_album_lists(spotify_song['album'], music_brainz_song['releases'])
    title_score = compare_strings(spotify_song['name'], music_brainz_song['title']) / len(spotify_song['name'])
    return 0.7 * title_score + 0.25 * artist_score + 0.05 * album_score


def search_artist(spotify, spotify_artist_id):
    artist_result = spotify.artist(spotify_artist_id)
    music_brainz_results = music_brainz.find_artist(artist=artist_result['name'])
    best_match_ratio, best_match = 0, None
    for result in music_brainz_results['artists']:
        score = compare_artists(artist_result, result)
        if score >= 0.98:
            return artist_result, result
        if score > best_match_ratio:
            best_match_ratio = score
            best_match = result
    return artist_result, best_match


def search_song(spotify, spotify_song_id):
    track_result = spotify.track(spotify_song_id)
    music_brainz_results = music_brainz.find_recording(artist=track_result['artists'][0]['name'],
                                                       recording=track_result['name'],
                                                       release=track_result['album']['name'])
    best_match_ratio, best_match = 0, None
    for result in music_brainz_results['recordings']:
        compared = compare_songs(track_result, result)
        if compared >= 0.98:
            return track_result, result
        if compared > best_match_ratio:
            best_match_ratio = compared
            best_match = result
    return track_result, best_match


def search_album(spotify, spotify_album_id):
    album_result = spotify.album(spotify_album_id)
    music_brainz_results = music_brainz.find_release(artist=album_result['artists'][0]['name'],
                                                     release=album_result['name'],
                                                     date=album_result["release_date"].split('_')[0])
    best_match_ratio, best_match = 0, None
    for result in music_brainz_results['releases']:
        compared = compare_albums(album_result, result)
        if compared >= 0.98:
            return album_result, result
        if compared > best_match_ratio:
            best_match_ratio = compared
            best_match = result
    return album_result, best_match


def search_work(spotify, spotify_song_id):
    track_result = spotify.track(spotify_song_id)
    music_brainz_results = music_brainz.find_work(artist=track_result['artists'][0]['name'],
                                                  work=track_result['name'])
    best_match_ratio, best_match = 0, None
    for result in music_brainz_results['works']:
        has_relations = 1.0 if len([r for r in result["relations"] if "recording" in r]) != 0 else 0.5
        compared = compare_strings(track_result['name'], result['title']) / len(track_result['name']) * has_relations
        if compared > best_match_ratio:
            best_match_ratio = compared
            best_match = result

    spotify_results = []

    for mb in best_match['relations']:
        if "recording" in mb and mb["recording"]["title"] != best_match["title"]:
            new_spotify_results = search(spotify, mb['recording'])['tracks']['items']
            for r in new_spotify_results:
                if r not in spotify_results:
                    spotify_results.append(r)
        if len(spotify_results) == 10:
            return spotify_results
    return spotify_results


def search(spotify, term):
    return spotify.search(term)
