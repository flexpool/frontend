export const ChartDataNotAvailable = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="placeholder"
        style={{
          height: '30%',
          width: '70%',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#aaa', fontWeight: 700, fontSize: '25px' }}>
          No Data
        </span>
      </div>
    </div>
  );
};
