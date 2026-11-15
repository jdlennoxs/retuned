import { map, path, pipe, uniq } from 'ramda';
import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { PreviewWrapper } from './PreviewWrapper';
import { Track } from './Track';
import useMapperStore from '@/utils/useMapperStore';

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const { data, isLoading: isLoadingInitial } = trpc.spotify.getUserRecentTracks.useQuery({});
    const listenedTracks = !isLoadingInitial && pipe(
        path(["body", "items"]),
        map(path(["track"])),
        uniq,
    )(data) || [];

    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const searchQuery = trpc.spotify.search.useQuery(debouncedQuery, {
        enabled: !!debouncedQuery, // Enable query only if debouncedQuery is not empty
    });

    const { addChosenTrack, setStep } = useMapperStore();

    const selectTrack = (track: SpotifyApi.TrackObjectFull) => {
        addChosenTrack(track);
        setStep("First");
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // 300ms debounce time

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // No need to manually trigger the query anymore
    };

    return (
        <div className="w-full h-screen pb-4">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a track"
                    className="w-full p-2 mb-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>
            {!debouncedQuery && isLoadingInitial && <p className="text-white font-semibold">Loading...</p>}
            {!debouncedQuery && listenedTracks && (
                <ul className="overflow-x-hidden overflow-y-auto relative h-2/3">
                    <span className="px-6 text-white font-semibold">Recently listened</span>
                    {listenedTracks.length > 0 && listenedTracks.map((track) => (
                        <div key={track.id} className="px-4" >
                            <PreviewWrapper previewUrl={track.preview_url}>
                                <Track track={track} onClick={() => selectTrack(track)} />
                            </PreviewWrapper>
                        </div>
                    ))}
                </ul>
            )
            }
            {debouncedQuery && searchQuery.isLoading && <p className="text-white font-semibold">Loading...</p>}
            {
                debouncedQuery && searchQuery.data && (
                    <ul className="overflow-x-hidden overflow-y-auto relative h-2/3">
                        {searchQuery.data.body.tracks?.items.map((track) => (
                            <div key={track.id} className="px-4" >
                                <PreviewWrapper previewUrl={track.preview_url}>
                                    <Track track={track} onClick={() => selectTrack(track)} />
                                </PreviewWrapper>
                            </div>
                        ))}
                    </ul>
                )
            }
        </div >
    );
};

export default Search;
