import { preload } from "react-dom";

const POSTER = "/background-poster.jpg";

export default function VideoBackground() {
  // Fetch the poster with high priority so something is on screen while the video buffers.
  preload(POSTER, { as: "image", fetchPriority: "high" });

  return (
    // The footage has ~5% black letterbox bands baked into the top and bottom of every frame.
    // Overscanning the video (taller than the viewport, offset upward) pushes those bands
    // outside this clipped container at every aspect ratio, so they never show as a strip.
    // h-lvh keeps the size stable while mobile browser toolbars collapse/expand.
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-screen overflow-hidden supports-[height:100lvh]:h-lvh"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        // The poster is the frame at 2s (after the fade-in), and the first playback starts
        // there too, so the hand-off from poster to video is seamless.
        poster={POSTER}
        className="absolute inset-x-0 top-[-6.5%] h-[113%] w-full object-cover object-center"
      >
        <source src="/background.mp4#t=2" type="video/mp4" />
      </video>
    </div>
  );
}
