import L, { divIcon } from "leaflet";
import { memo, useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ScaleControl,
  ZoomControl,
  Popup,
} from "react-leaflet";
import { useMainContext } from "../Layout/Layout";
import useSWR from "swr";
import { useRouter } from "next/router";

type Props = {
  children?: React.ReactNode;
};

const Map = memo(({ children }: Props) => {
  const router = useRouter();
  const { setSelectedMarker, searchResults, map, setMap } = useMainContext();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(6);

  const { data } = useSWR("/api/markers?bounds=" + bounds + "&zoom=" + zoom, {
    onSuccess: (data) => {
      // console.log(data);
    },
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false,
  });

  function createClusterIcon(feature, latlng) {
    if (!feature.properties.cluster) return L.marker(latlng);

    const count = feature.properties.point_count;
    const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
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

  // useEffect(() => {
  //   if (!map) return;
  //   // @TODO
  //   // check the current path and center the map on the marker if provided
  //   const path = router.asPath.split("/");
  //   if (path[1] === "explore" && path[2]) {
  //     // check if we have search results and if so, if the marker is in the results
  //     // if (searchResults && searchResults.length > 0) {
  //     //   const marker = searchResults.find((m) => m._source.id === path[2]);
  //     //   if (marker) {
  //     //     // animate the map to the marker
  //     //     map.setView(
  //     //       marker._source.coordinates,
  //     //       5,
  //     //       {
  //     //         animate: true,
  //     //         duration: 1,
  //     //       },
  //     //       () => {
  //     //         // set the selected marker id
  //     //         setSelectedMarkerId(marker._source.id);
  //     //       }
  //     //     );
  //     //   }
  //     // }
  //   }
  // }, [map, data, searchResults, router.asPath]);

  let mapClassName = "map";

  const markerIcon = () => {
    const svg = `<svg class="map-marker" fill="#000000" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 395.71 395.71" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"></path> </g> </g></svg>`;
    return divIcon({
      html: svg,
    });
  };

  const handleMarkerClick = useCallback(
    (cluster: GeoPoint) => {
      // setSelectedMarker({
      //   lat: cluster.geometry.coordinates[1],
      //   lon: cluster.geometry.coordinates[0],
      //   ...cluster.properties,
      // });

      const id = cluster.properties.name;
      router.push(`/explore/${id}`, undefined, { shallow: true });
    },
    [setSelectedMarker]
  );

  const key = "LZOQu9WlJCxUdwYAm9W9";

  return (
    <MapContainer
      className={mapClassName}
      center={[53.559196, 9.994773]}
      zoom={6}
      scrollWheelZoom={true}
      ref={setMap}
      preferCanvas
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
        url={`https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=${key}`}
        attribution={
          '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'
        }
        accessToken={"LZOQu9WlJCxUdwYAm9W9"}
        crossOrigin
      />

      {data?.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;

        if (isCluster) {
          return createClusterIcon(cluster, [lat, lng]);
        }

        return (
          <Marker
            icon={markerIcon()}
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

      {/* <ScaleControl position={"bottomright"} /> */}
      <ZoomControl position={"bottomright"} />
      {children}
    </MapContainer>
  );
});

Map.displayName = "Map";

export default Map;
