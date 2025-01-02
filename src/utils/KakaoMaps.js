import { Map, MapMarker } from "react-kakao-maps-sdk"

const KakaoMaps = ({lat, lng, name}) => {
  return (
    <Map
      center={{ lat: lat, lng: lng }}
      draggable={false}
      zoomable={false}
    >
    
      <MapMarker
        style={{ border: 'tranparent' }}
        position={{ lat: lat, lng: lng }}
        title={name}
      >
      </MapMarker>
    </Map>
  );
}

export default KakaoMaps;