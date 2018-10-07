import requests


class MusicBrainz:
    def __init__(self):
        self.base_url = "https://musicbrainz.org/ws/2"

    def request(self, field, request_dict):
        query_params = []
        for key in request_dict:
            if request_dict[key] is not None:
                query_params.append(":".join([key, request_dict[key]]))
        if len(query_params) != 0:
            url = "/".join([self.base_url, field, "?query="]) + "%20AND%20".join(query_params) + "&fmt=json"
            response = requests.get(url)
            return response.json()
        else:
            raise Exception("No arguments provided")

    def add_annotation_to_entity(self, name=None, entity=None, text=None, annotation_type=None):
        """
        :param name: the annotated entity's name or title
        :param entity: the annotated entity's MBID
        :param text: the annotation's content (includes wiki formatting)
        :param annotation_type: the annotated entity's entity type
        :return: response in a json format
        """
        annotation_dict = {
            "name": name,
            "entity": entity,
            "text": text,
            "type": annotation_type
        }
        return self.request("annotation", annotation_dict)

    def find_area(self, aid=None, alias=None, area=None, begin=None, comment=None, end=None, ended=None, iso=None,
                  iso1=None, iso2=None, iso3=None, sortname=None, area_type=None):
        """
        :param aid: the area's MBID
        :param alias: an alias attached to the area
        :param area: the area's name
        :param begin: the area's begin date
        :param comment: the area's disambiguation comment
        :param end: the area's end date
        :param ended: a flag indicating whether or not the area has ended
        :param iso:	an ISO 3166-1/2/3 code attached to the area
        :param iso1: an ISO 3166-1 code attached to the area
        :param iso2: an ISO 3166-2 code attached to the area
        :param iso3: an ISO 3166-3 code attached to the area
        :param sortname: the area's sort name
        :param area_type: the area's type
        :return: response in a json format
        """
        area_dict = {
            "aid": aid,
            "alias": alias,
            "area": area,
            "begin": begin,
            "comment": comment,
            "end": end,
            "ended": ended,
            "iso": iso,
            "iso1": iso1,
            "iso2": iso2,
            "iso3": iso3,
            "sortname": sortname,
            "type": area_type
        }
        return self.request("area", area_dict)

    def find_artist(self, alias=None, area=None, arid=None, artist=None, artistaccent=None, begin=None, beginarea=None,
                    comment=None, country=None, end=None, endarea=None, ended=None, gender=None, ipi=None,
                    sortname=None, tag=None, artist_type=None):
        """
        :param alias: an alias attached to the artist
        :param area: the artist's main associated area
        :param arid: the artist's MBID
        :param artist: the artist's name (without accented characters)
        :param artistaccent: the artist's name (with accented characters)
        :param begin: the artist's begin date
        :param beginarea: the artist's begin area
        :param comment: the artist's disambiguation comment
        :param country: the 2-letter code (ISO 3166-1 alpha-2) for the artist's main associated country, or “unknown”
        :param end: the artist's end date
        :param endarea: the artist's end area
        :param ended: a flag indicating whether or not the artist has ended
        :param gender: the artist's gender (“male”, “female”, or “other”)
        :param ipi: an IPI code associated with the artist
        :param sortname: the artist's sort name
        :param tag: a tag attached to the artist
        :param artist_type: the artist's type (“person”, “group”, ...)
        :return: response in a json format
        """
        artist_dict = {
            "alias": alias,
            "area": area,
            "arid": arid,
            "artist": artist,
            "artistaccent": artistaccent,
            "begin": begin,
            "beginarea": beginarea,
            "comment": comment,
            "country": country,
            "end": end,
            "endarea": endarea,
            "ended": ended,
            "gender": gender,
            "ipi": ipi,
            "sortname": sortname,
            "tag": tag,
            "type": artist_type
        }
        return self.request("artist", artist_dict)

    def find_cd(self, artist=None, barcode=None, comment=None, discid=None, title=None, tracks=None):
        """
        :param artist: the artist name set on the CD stub
        :param barcode: the barcode set on the CD stub
        :param comment: the comment set on the CD stub
        :param discid: the CD stub's Disc ID
        :param title: the release title set on the CD stub
        :param tracks: the CD stub's number of tracks
        :return: response in a json format
        """
        cd_dict = {
            "artist": artist,
            "barcode": barcode,
            "comment": comment,
            "discid": discid,
            "title": title,
            "tracks": tracks
        }
        return self.request("cdstub", cd_dict)

    def find_event(self, alias=None, aid=None, area=None, arid=None, artist=None, comment=None, eid=None, event=None,
                   pid=None, place=None, event_type=None, tag=None):
        """
        :param alias: an alias attached to the event
        :param aid: the MBID of an area related to the event
        :param area: the name of an area related to the event
        :param arid: the MBID of an artist related to the event
        :param artist: the name of an artist related to the event
        :param comment: the disambiguation comment for the event
        :param eid: the MBID of the event
        :param event: the name of the event
        :param pid: the MBID of a place related to the event
        :param place: the name of a place related to the event
        :param event_type: the event's type
        :param tag: a tag attached to the event
        :return: response in a json format
        """
        event_dict = {
            "alias": alias,
            "aid": aid,
            "area": area,
            "arid": arid,
            "artist": artist,
            "comment": comment,
            "eid": eid,
            "event": event,
            "pid": pid,
            "place": place,
            "type": event_type,
            "tag": tag
        }
        return self.request("event", event_dict)

    def find_instrument(self, alias=None, comment=None, description=None, iid=None, instrument=None,
                        instrument_type=None, tag=None):
        """
        :param alias: an alias attached to the instrument
        :param comment: the disambiguation comment for the instrument
        :param description: the description of the instrument
        :param iid: the MBID of the instrument
        :param instrument: the name of the instrument
        :param instrument_type: the instrument's type
        :param tag: a tag attached to the instrument
        :return: response in a json format
        """
        instrument_dict = {
            "alias": alias,
            "comment": comment,
            "description": description,
            "iid": iid,
            "instrument": instrument,
            "type": instrument_type,
            "tag": tag
        }
        return self.request("instrument", instrument_dict)

    def find_label(self, alias=None, area=None, begin=None, code=None, comment=None, country=None, end=None, ended=None,
                   ipi=None, label=None, labelaccent=None, laid=None, sortname=None, label_type=None, tag=None):
        """
        :param alias: the aliases/misspellings for this label
        :param area: label area
        :param begin: label founding date
        :param code: label code (only the figures part, i.e. without "LC")
        :param comment: label comment to differentiate similar labels
        :param country: The two letter country code of the label country
        :param end: label dissolution date
        :param ended: true if know ended even if do not know end date
        :param ipi: ipi
        :param label: label name
        :param labelaccent: name of the label with any accent characters retained
        :param laid: MBID of the label
        :param sortname: label sortname
        :param label_type: label type
        :param tag: folksonomy tag
        :return: response in a json format
        """
        label_dict = {
            "alias": alias,
            "area": area,
            "begin": begin,
            "code": code,
            "comment": comment,
            "country": country,
            "end": end,
            "ended": ended,
            "ipi": ipi,
            "label": label,
            "labelaccent": labelaccent,
            "laid": laid,
            "sortname": sortname,
            "type": label_type,
            "tag": tag
        }
        return self.request("label", label_dict)

    def find_place(self, pid=None, address=None, alias=None, area=None, begin=None, comment=None, end=None, ended=None,
                   lat=None, long=None, place=None, placeaccent=None, place_type=None):
        """
        :param pid: the place ID
        :param address: the address of this place
        :param alias: the aliases/misspellings for this area
        :param area: area name
        :param begin: place begin date
        :param comment: disambiguation comment
        :param end: place end date
        :param ended: place ended
        :param lat: place latitude
        :param long: place longitude
        :param place: the place name (without accented characters)
        :param placeaccent: the place name (with accented characters)
        :param place_type:the places type
        :return: response in a json format
        """
        place_dict = {
            "pid": pid,
            "address": address,
            "alias": alias,
            "area": area,
            "begin": begin,
            "comment": comment,
            "end": end,
            "ended": ended,
            "lat": lat,
            "long": long,
            "place": place,
            "placeaccent": placeaccent,
            "type": place_type
        }
        return self.request("place", place_dict)

    def find_recording(self, arid=None, artist=None, artistname=None, creditname=None, comment=None, country=None,
                       date=None, dur=None, format=None, isrc=None, number=None, position=None, primarytype=None,
                       qdur=None, recording=None, recordingaccent=None, reid=None, release=None, rgid=None, rid=None,
                       secondarytype=None, status=None, tid=None, tnum=None, tracks=None, tracksrelease=None, tag=None,
                       recording_type=None, video=None):
        """
        :param arid: artist id
        :param artist: artist name is name(s) as it appears on the recording
        :param artistname: an artist on the recording, each artist added as a separate field
        :param creditname: name credit on the recording, each artist added as a separate field
        :param comment: recording disambiguation comment
        :param country: recording release country
        :param date: recording release date
        :param dur: duration of track in milliseconds
        :param format: recording release format
        :param isrc: ISRC of recording
        :param number: free text track number
        :param position: the medium that the recording should be found on, first medium is position 1
        :param primarytype: primary type of the release group (album, single, ep, other)
        :param qdur: quantized duration (duration / 2000)
        :param recording: name of recording or a track associated with the recording
        :param recordingaccent: name of the recording with any accent characters retained
        :param reid: release id
        :param release: release name
        :param rgid: release group id
        :param rid: recording id
        :param secondarytype: secondary type of the release group (audiobook, compilation, interview, live,
                              remix soundtrack, spokenword)
        :param status: Release status (official, promotion, Bootleg, Pseudo-Release)
        :param tid: track id
        :param tnum: track number on medium
        :param tracks: number of tracks in the medium on release
        :param tracksrelease: number of tracks on release as a whole
        :param tag: folksonomy tag
        :param recording_type: type of the release group, old type mapping for when we did not have separate primary and
                               secondary types or use standalone for standalone recordings
        :param video: true to only show video tracks
        :return: response in a json format
        """
        recording_dict = {
            "arid": arid,
            "artist": artist,
            "artistname": artistname,
            "reditname": creditname,
            "comment": comment,
            "country": country,
            "date": date,
            "dur": dur,
            "format": format,
            "isrc": isrc,
            "nmber": number,
            "position": position,
            "primarytype": primarytype,
            "qdur": qdur,
            "recording": recording,
            "recordingaccent": recordingaccent,
            "reid": reid,
            "release": release,
            "rgid": rgid,
            "rid": rid,
            "secondarytype": secondarytype,
            "status": status,
            "tid": tid,
            "tnum": tnum,
            "tracks": tracks,
            "tracksrelease": tracksrelease,
            "tag": tag,
            "type": recording_type,
            "video": video
        }
        return self.request("recording", recording_dict)

    def find_release_group(self, arid=None, artist=None, artistname=None, comment=None, creditname=None,
                           primarytype=None, rgid=None, releasegroup=None, releasegroupaccent=None, releases=None,
                           release=None, reid=None, secondarytype=None, status=None, tag=None, release_group_type=None):
        """
        :param arid: MBID of the release group’s artist
        :param artist: release group artist as it appears on the cover (Artist Credit)
        :param artistname: “real name” of any artist that is included in the release group’s artist credit
        :param comment: release group comment to differentiate similar release groups
        :param creditname: name of any artist in multi-artist credits, as it appears on the cover.
        :param primarytype: primary type of the release group (album, single, ep, other)
        :param rgid: MBID of the release group
        :param releasegroup: name of the release group
        :param releasegroupaccent: name of the releasegroup with any accent characters retained
        :param releases: number of releases in this release group
        :param release: name of a release that appears in the release group
        :param reid: MBID of a release that appears in the release group
        :param secondarytype: secondary type of the release group (audiobook, compilation, interview, live,
                                                                   remix soundtrack, spokenword)
        :param status: status of a release that appears within the release group
        :param tag: a tag that appears on the release group
        :param release_group_type: type of the release group, old type mapping for when we did not have separate primary
                                   and secondary types
        :return: response in a json format
        """
        release_group_dict = {
            "arid": arid,
            "artist": artist,
            "artistname": artistname,
            "comment": comment,
            "creditname": creditname,
            "primarytype": primarytype,
            "rgid": rgid,
            "releasegroup": releasegroup,
            "releasegroupaccent": releasegroupaccent,
            "releases": releases,
            "release": release,
            "reid": reid,
            "secondarytype": secondarytype,
            "status": status,
            "tag": tag,
            "type": release_group_type
        }
        return self.request("release-group", release_group_dict)

    def find_release(self, arid=None, artist=None, artistname=None, asin=None, barcode=None, catno=None, comment=None,
                     country=None, creditname=None, date=None, discids=None, discidsmedium=None, format=None, laid=None,
                     label=None, lang=None, mediums=None, primarytype=None, puid=None, quality=None, reid=None,
                     release=None, releaseaccent=None, rgid=None, script=None, secondarytype=None, status=None,
                     tag=None, tracks=None, tracksmedium=None, release_type=None):
        """
        :param arid: artist id
        :param artist: complete artist name(s) as it appears on the release
        :param artistname: an artist on the release, each artist added as a separate field
        :param asin: the Amazon ASIN for this release
        :param barcode: The barcode of this release
        :param catno: The catalog number for this release, can have multiples when major using an imprint
        :param comment: Disambiguation comment
        :param country: The two letter country code for the release country
        :param creditname: name credit on the release, each artist added as a separate field
        :param date: The release date (format: YYYY-MM-DD)
        :param discids: total number of cd ids over all mediums for the release
        :param discidsmedium: number of cd ids for the release on a medium in the release
        :param format: release format
        :param laid: The label id for this release, a release can have multiples when major using an imprint
        :param label: The name of the label for this release, can have multiples when major using an imprint
        :param lang: The language for this release. Use the three character ISO 639-3 codes to search for a specific language. (e.g. lang:eng)
        :param mediums: number of mediums in the release
        :param primarytype: primary type of the release group (album, single, ep, other)
        :param puid: The release contains recordings with these puids
        :param quality: The quality of the release (low, normal, high)
        :param reid: release id
        :param release: release name
        :param releaseaccent: name of the release with any accent characters retained
        :param rgid: release group id
        :param script: The 4 character script code (e.g. latn) used for this release
        :param secondarytype: secondary type of the release group (audiobook, compilation, interview, live, remix, soundtrack, spokenword)
        :param status: release status (e.g official)
        :param tag: a tag that appears on the release
        :param tracks: total number of tracks over all mediums on the release
        :param tracksmedium: number of tracks on a medium in the release
        :param release_type: type of the release group, old type mapping for when we did not have separate primary and secondary types
        :return: response in a json format
        """
        release_dict = {
            "arid": arid,
            "artist": artist,
            "artistname": artistname,
            "asin": asin,
            "barcode": barcode,
            "catno": catno,
            "comment": comment,
            "country": country,
            "creditname": creditname,
            "date": date,
            "discids": discids,
            "discidsmedium": discidsmedium,
            "format": format,
            "laid": laid,
            "label": label,
            "lang": lang,
            "mediums": mediums,
            "primarytype": primarytype,
            "puid": puid,
            "quality": quality,
            "reid": reid,
            "release": release,
            "releaseaccent": releaseaccent,
            "rgid": rgid,
            "script": script,
            "secondarytype": secondarytype,
            "status": status,
            "tag": tag,
            "tracks": tracks,
            "tracksmedium": tracksmedium,
            "type": release_type
        }
        return self.request("release", release_dict)

    def find_series(self, alias=None, comment=None, series=None, sid=None, series_type=None, tag=None):
        """
        :param alias: an alias attached to the series
        :param comment: the disambiguation comment for the series
        :param series: the name of the series
        :param sid: the MBID of the series
        :param series_type: the series' type
        :param tag: a tag attached to the series
        :return: response in a json format
        """
        series_dict = {
            "alias": alias,
            "comment": comment,
            "series": series,
            "sid": sid,
            "type": series_type,
            "tag": tag
        }
        return self.request("series", series_dict)

    def find_tag(self, tag):
        """
        :param tag: the tag's text
        :return: response in a json format
        """
        url = "/".join([self.base_url, "tag", "?query="]) + tag + "&fmt=json"
        response = requests.get(url)
        return response.json()

    def find_url(self, relationtype=None, targetid=None, targettype=None, uid=None, url=None):
        """
        :param relationtype: the type of a relationship attached to the URL
        :param targetid: the MBID of an entity related to the URL
        :param targettype: an entity type related to the URL
        :param uid: the URL's MBID
        :param url: the URL itself
        :return: response in a json format
        """
        url_dict = {
            "relationtype": relationtype,
            "targetid": targetid,
            "targettype": targettype,
            "uid": uid,
            "url": url
        }
        return self.request("url", url_dict)

    def find_work(self, alias=None, arid=None, artist=None, comment=None, iswc=None, lang=None, tag=None,
                  work_type=None, wid=None, work=None, workaccent=None):
        """
        :param alias: the aliases/misspellings for this work
        :param arid: artist id
        :param artist: artist name, an artist in the context of a work is an artist-work relation such as composer or
                       lyricist
        :param comment: disambiguation comment
        :param iswc: ISWC of work
        :param lang: Lyrics language of work
        :param tag: folksonomy tag
        :param work_type: work type
        :param wid: work id
        :param work: name of work
        :param workaccent: name of the work with any accent characters retained
        :return: response in a json format
        """
        work_dict = {
            "alias": alias,
            "arid": arid,
            "artist": artist,
            "comment": comment,
            "iswc": iswc,
            "lang": lang,
            "tag": tag,
            "type": work_type,
            "wid": wid,
            "work": work,
            "workaccent": workaccent
        }
        return self.request("work", work_dict)
