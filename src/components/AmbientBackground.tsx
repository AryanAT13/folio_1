export default function AmbientBackground() {
  return (
    // This main container ensures the background stays fixed behind your content
    // and doesn't interfere with mouse clicks.
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="ambient-background"></div>
      <div className="water-layer">
        <div className="water-blob blob-1"></div>
        <div className="water-blob blob-2"></div>
        <div className="water-blob blob-3"></div>
        {/* You can add or remove blobs here if you like */}
        <div className="ripple-effect"></div>
      </div>
    </div>
  );
}