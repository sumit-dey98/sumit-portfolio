export default function Connect4() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#0a0b0f',
      cursor: 'auto',
    }}>
      <iframe
        src="https://connect4-project.vercel.app/"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Connect 4"
      />
    </div>
  );
}