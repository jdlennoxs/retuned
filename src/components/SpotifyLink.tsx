export interface SpotifyLinkProps {
    uri: string;
}

export const SpotifyLink: React.FC<SpotifyLinkProps> = ({
    uri,
}) => (
    <a className="shrink-0" href={uri}>
        <img className="h-6" src="/spotify-white.png" alt="Spotify logo" />
    </a>
);
