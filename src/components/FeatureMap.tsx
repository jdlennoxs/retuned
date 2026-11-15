import { last } from "ramda";
import useMapperStore from "@/utils/useMapperStore";
import { trpc } from "@/utils/trpc";
import Cube from "@/components/Cube";

const FeatureMap = () => {
    const { chosenTracks, setFeatures } = useMapperStore();
    const { data: features, isFetching: isFetchingFeature } =
        trpc.spotify.getTrackFeatures.useQuery(last(chosenTracks)?.id || "", {
            enabled: !!last(chosenTracks)?.id,
            onSuccess: (data) => {
                setFeatures(data.body);
            },
        });
    // const { data: recommendations, isFetching: isFetchingRecommendation } =
    //     trpc.spotify.getRecommendations.useQuery(params, {
    //         enabled: params.seedTracks !== undefined && features.length !== 3,
    //         onSuccess: (data) => {
    //             setRecommendations(
    //                 data.body.tracks as SpotifyApi.RecommendationTrackObject[]
    //             );
    //         },
    //     });
    if (isFetchingFeature && chosenTracks.length > 0) return <div>Loading...</div>
    return <Cube points={features?.body} tracks={chosenTracks[0]} />
}

export default FeatureMap;