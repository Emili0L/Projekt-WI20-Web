import L, { divIcon } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";
import { useLayoutContext } from "../Layout/Layout";

type Props = {
  coordinates: { lat: number; lng: number }[];
  children?: React.ReactNode;
};

const Map = ({ coordinates, children }: Props) => {
  const { sidebarOpen } = useLayoutContext();
  const [map, setMap] = useState(null);

  const onMove = useCallback(() => {
    // console.group("map moved");
    // console.log(map.getCenter());
    // console.log(map.getZoom());
    // console.groupEnd();
  }, [map, sidebarOpen]);

  const onClick = useCallback(
    (e: any) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
    },
    [map]
  );

  useEffect(() => {
    if (!map) return;
    if (sidebarOpen) map.panBy([-90, 0], { animate: true, duration: 0.5 });
    else map.panBy([90, 0], { animate: true, duration: 0.5 });
    map.on("move", onMove);
    map.on("click", onClick);
    return () => {
      map.off("move", onMove);
      map.off("click", onClick);
    };
  }, [map, onMove]);

  // useEffect(() => {
  //   if (!map) return;
  //   console.log("sidebarOpen changed");
  //   console.log(map.getCenter().lng);
  //   console.log(crosshair.getLatLng().lng);
  //   // if sidebarOpen & crosshairs is right in the middle of the map
  //   if (sidebarOpen && map.getCenter().lng === crosshair.getLatLng().lng) {
  //     console.log("sidebarOpen & crosshairs is right in the middle of the map");
  //     // set the position of the crosshair to the right
  //     const crosshairPosition = map.getCenter();
  //     crosshairPosition.lng += 3;
  //     crosshair.setLatLng(crosshairPosition);
  //   }
  // }, [map, sidebarOpen]);

  let mapClassName = "map";

  const markerIcon = (index: number) => {
    const svg = `<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 395.71 395.71" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path> </g> </g></svg>`;

    const color = (index % 4) + 1;

    return divIcon({
      html: svg,
    });
  };

  const key = "LZOQu9WlJCxUdwYAm9W9";

  return (
    <MapContainer
      className={mapClassName}
      center={[53.559196, 9.994773]}
      zoom={6}
      scrollWheelZoom={true}
      ref={setMap}
    >
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      /> */}
      {/* <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
        subdomains="abcd"
      /> */}

      <TileLayer
        url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${key}`}
        attribution={
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'
        }
        accessToken={"LZOQu9WlJCxUdwYAm9W9"}
        crossOrigin
      />

      {/* <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      /> */}

      {coordinates.map((coordinate, index) => (
        <Marker
          position={[coordinate.lat, coordinate.lng]}
          key={index}
          draggable={false}
          icon={markerIcon(index)}
        ></Marker>
      ))}
      <ScaleControl position={"bottomright"} />
      <ZoomControl position={"bottomright"} />
      {children}
    </MapContainer>
  );
};

export default Map;
