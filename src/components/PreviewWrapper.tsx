
import ReactHoverObserver from "react-hover-observer";
import AudioPreview from "./AudioPreview";

export interface PreviewWrapperProps {
    children: React.ReactNode;
    previewUrl: string | null;
}

export const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
    children,
    previewUrl,
}) => (
    <ReactHoverObserver className={`max-w-xl grow`}>
        {({ isHovering }: { isHovering: boolean }) => (
            <>
                {previewUrl && (
                    <AudioPreview isPlaying={isHovering} url={previewUrl} />
                )}
                {children}
            </>
        )}
    </ReactHoverObserver>
);