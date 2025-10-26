export default function VideoBackground() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 -z-10 h-full w-full object-cover object-center"
    >
      <source src="/background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}