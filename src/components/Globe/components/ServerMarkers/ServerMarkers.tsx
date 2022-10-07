import { SERVERS } from '../../constants';
import Marker from '../../components/Marker';

const ServerMarkers = () => {
  return (
    <>
      {SERVERS.map((server, index) => (
        <Marker
          key={index}
          {...server}
          lat={server.latitude}
          long={server.longitude}
          color={server.color}
        />
      ))}
    </>
  );
};

export default ServerMarkers;
