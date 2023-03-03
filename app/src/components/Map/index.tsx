import L, { divIcon } from "leaflet";
import { memo, useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  Popup,
  Circle,
} from "react-leaflet";
import { useMainContext } from "../Layout/Layout";
import useSWR from "swr";
import { useRouter } from "next/router";

type Props = {
  children?: React.ReactNode;
};

const Map = memo(({ children }: Props) => {
  const router = useRouter();
  const { pathArray: queryPaths } = router.query;
  var pathArray = queryPaths as string[];
  const {
    setSelectedMarker,
    selectedMarker,
    map,
    setMap,
    lat,
    lon,
    distance,
    searchResults,
  } = useMainContext();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(6);

  const { data } = useSWR("/api/markers?bounds=" + bounds + "&zoom=" + zoom);

  function createClusterIcon(feature, latlng) {
    if (!feature.properties.cluster) return L.marker(latlng);

    const count = feature.properties.point_count;
    const size =
      count < 50
        ? "small"
        : count < 100
        ? "medium"
        : count < 500
        ? "large"
        : count < 1000
        ? "xlarge"
        : "xxlarge";

    const icon = L.divIcon({
      html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40),
    });

    return (
      <Marker
        key={`marker-${feature.properties.cluster_id}-
        ${feature.properties.point_count_abbreviated}-${new Date()
          .getTime()
          .toString(36)}`}
        position={latlng}
        icon={icon}
      />
    );
  }

  const onClick = useCallback(
    (e: any) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
    },
    [map]
  );

  const onMapChange = useCallback(() => {
    if (!map) return;
    // set the bounds in the format "minLng, minLat, maxLng, maxLat"
    setBounds(
      [
        map.getBounds().getSouthWest().lng,
        map.getBounds().getSouthWest().lat,
        map.getBounds().getNorthEast().lng,
        map.getBounds().getNorthEast().lat,
      ].join(",")
    );
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.on("click", onClick);
    map.on("zoomend", onMapChange);
    map.on("moveend", onMapChange);
    onMapChange();
    return () => {
      map.off("click", onClick);
      map.off("zoomend", onMapChange);
      map.off("moveend", onMapChange);
    };
  }, [map]);

  let mapClassName = "map";

  const markerIcon = (id: string) => {
    const svg = `<svg class="map-marker 
    ${selectedMarker && selectedMarker.id === id ? "selected" : ""}
    ${id === "search" ? "search" : ""}
    " viewBox="-3.6 -3.6 43.20 43.20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <g id="VividJS" stroke-width="1.8719999999999999" fill="none" fill-rule="evenodd"> <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="mm" transform="translate(78.000000, 468.000000)"> <g transform="translate(10.000000, 6.000000)"> <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FF6E6E"> </path> <circle id="Oval" fill="#0C0058" fill-rule="nonzero" cx="14" cy="14" r="7"> </circle> </g> </g> </g> </g> </g> </g></svg>`;
    return divIcon({
      html: svg,
      className: "map-marker-wrapper",
    });
  };

  const handleMarkerClick = useCallback(
    (cluster: GeoPoint) => {
      const id = cluster.properties.id;
      router.push(`/explore/${id}`, undefined, { shallow: true });
    },
    [setSelectedMarker]
  );

  const key = "eHUbjCnrs1XM5VQHN2AV";

  return (
    <MapContainer
      className={mapClassName}
      center={[53.559196, 9.994773]}
      zoom={6}
      minZoom={3}
      scrollWheelZoom={true}
      maxBoundsViscosity={1.0}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      ref={setMap}
      preferCanvas
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=${key}`}
        attribution={
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'
        }
        accessToken={"eHUbjCnrs1XM5VQHN2AV"}
        crossOrigin
        noWrap
      />

      {data?.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;

        if (isCluster) {
          return createClusterIcon(cluster, [lat, lng]);
        }

        return (
          <Marker
            icon={markerIcon(cluster.properties.id)}
            key={`marker-${cluster.properties.id}`}
            position={[lat, lng]}
            eventHandlers={{
              click: () => handleMarkerClick(cluster),
            }}
          >
            <Popup>
              <span>{cluster.properties.name}</span>
            </Popup>
          </Marker>
        );
      })}

      {router.query.lat &&
        router.query.lon &&
        lat &&
        lon &&
        distance &&
        searchResults !== null &&
        searchResults !== undefined && (
          <>
            <Marker
              icon={markerIcon("search")}
              key={`marker-search`}
              position={[parseFloat(lat), parseFloat(lon)]}
            />
            <Circle
              center={[parseFloat(lat), parseFloat(lon)]}
              radius={distance * 1000}
            />
          </>
        )}

      <ZoomControl position={"bottomright"} />
      {children}
    </MapContainer>
  );
});

Map.displayName = "Map";

export default Map;
