<template>
  <div id="mapContainer" style="position: relative">
    <div id="map" style="height: 400px"></div>
    <button class="btn btn-warning mx-3 mt-3" @click="addCircle">
      Add Circle
    </button>
    <button class="btn btn-danger mx-3 mt-3" @click="clearCircles">
      Clear Circles
    </button>
    <button class="btn btn-success mx-3 mt-3" @click="toggleDistance">
      {{ distanceActive ? "Disable Distance" : "Enable Distance" }}
    </button>
    <button class="btn btn-primary mx-3 mt-3" @click="toggleAddPin">
      {{ addPinActive ? "Disable Adding Pin" : "Enable Adding Pin" }}
    </button>
    <button
      v-if="markers.length >= 1"
      class="btn btn-danger mx-3 mt-3"
      @click="hideMarkers"
    >
      Hide Marker
    </button>
    <button
      v-if="markers.length >= 1"
      class="btn btn-danger mx-3 mt-3"
      @click="showMarkers"
    >
      Show Marker
    </button>
    <button
      v-if="markers.length >= 1"
      class="btn btn-danger mx-3 mt-3"
      @click="deleteMarkers"
    >
      Remove Marker
    </button>
    <div v-if="distance">{{ distanceText }}</div>
    <div v-if="clickedLocation">Clicked Location: {{ clickedLocation }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed, toRaw } from "vue";

export default {
  setup() {
    const circles = ref([]);
    let map;
    let infoWindow;
    const distance = ref(null);
    const distanceActive = ref(false);
    const userLocation = ref(null);
    const clickedLocation = ref(null);
    const addPinActive = ref(false);
    const line = ref(null);
    const markers = ref([]);
    let pinGlyphColor;
    const xaxis = ref(null);
    const yaxis = ref(null);
    const pTop = ref(null);
    const result = ref(null);

    const initMap = () => {
      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        mapId: "ea374a954ac47ced",
        apiKey: "AIzaSyB-2NtQ3taMEJYfKbDx5lnQoMFKwn8JpqA",
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(userLocation.value); // Center the map at user's location
          },
          () => {
            console.log("Geolocation failed. Using default map center.");
          }
        );
      } else {
        console.log("Geolocation not supported. Using default map center.");
      }

      // Define an info window on the map.
      infoWindow = new google.maps.InfoWindow();

      // Add click event listener to the map if distance functionality is active
      if (distanceActive.value) {
        map.addListener("click", calculateDistance);
      }
    };

    onMounted(() => {
      initMap();
    });

    const clickedLatLng = ref(null);

    const calculateDistance = (event) => {
      clickedLatLng.value = event.latLng;

      distance.value =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(
            userLocation.value.lat,
            userLocation.value.lng
          ),
          clickedLatLng.value
        ) / 1000;

      if (line.value !== null) {
        toRaw(line.value).setMap(null);
      }

      line.value = new google.maps.Polyline({
        path: [
          new google.maps.LatLng(
            userLocation.value.lat,
            userLocation.value.lng
          ),
          clickedLatLng.value,
        ],
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
      });
    };

    const toggleDistance = () => {
      distanceActive.value = !distanceActive.value;
      if (distanceActive.value) {
        map.addListener("click", calculateDistance);
      } else {
        google.maps.event.clearListeners(map, "click");
        clickedLocation.value = null;
      }
    };

    const addCircle = () => {
      const center = map.getCenter();
      const radius = 5000;

      const circle = new google.maps.Circle({
        center: center,
        radius: radius,
        editable: false,
        draggable: true,
        map: map,
      });

      // Add an event listener on the circle.
      circle.addListener("center_changed", () => showNewCircle(circle));

      // Push the circle to the circles array
      circles.value.push(circle);
    };

    const clearCircles = () => {
      const circleToRemove = circles.value.pop();
      if (circleToRemove) {
        toRaw(circleToRemove).setMap(null);
      }
      console.log(circles);
    };

    const showNewCircle = async (circle) => {
      const center = circle.getCenter();
      const radius = circle.getRadius();

      const { PinElement } = await google.maps.importLibrary("marker");

      const contentString =
        "<b>Circle moved.</b><br>" +
        "New center: " +
        center.lat() +
        ", " +
        center.lng() +
        "<br>" +
        "New radius: " +
        radius;

      console.log(circles.value);
      console.log(markers.value);

      if (circles.value.length >= 1 && markers.value.length >= 1) {
        for (let x = 0; x < markers.value.length; x++) {
          for (let i = 0; i < circles.value.length; i++) {
            const circleCenter = circles.value[i].getCenter();
            const markerPLat = markers.value[x].Os.lat;
            const markerPLng = markers.value[x].Os.lng;
            const markerPosition = {
              lat: markerPLat,
              lng: markerPLng,
            };
            const distanceInMeters =
              google.maps.geometry.spherical.computeDistanceBetween(
                circleCenter,
                markerPosition
              );

            if (distanceInMeters.toFixed(0) <= 5000) {
              var pinGlyphColor1 = new PinElement({
                background: "#EB3324",
                borderColor: "#EB3324",
              });
              markers.value[x].content = pinGlyphColor1.element;
              break;
            } else {
              var pinGlyphColor2 = new PinElement({
                background: "#c59a00",
                borderColor: "#c59a00",
              });
              markers.value[x].content = pinGlyphColor2.element;
            }

            console.log(
              `Distance from circle ${i + 1} to marker ${
                x + 1
              }: ${distanceInMeters.toFixed(0)} km`
            );
          }
        }
      }

      infoWindow.setContent(contentString);
      infoWindow.setPosition(center);
      infoWindow.open(map);
    };

    const toggleAddPin = () => {
      addPinActive.value = !addPinActive.value;
      if (addPinActive.value) {
        map.addListener("click", addPin);
      }
    };

    let latNum;
    let lngNum;

    const addPin = async (event) => {
      if (addPinActive.value) {
        latNum = event.latLng.lat();
        lngNum = event.latLng.lng();

        const { AdvancedMarkerElement, PinElement } =
          await google.maps.importLibrary("marker");

        const icon = document.createElement("div");

        icon.innerHTML = '<i class="fa-solid fa-location-dot"></i>';

        if (!pinGlyphColor) {
          pinGlyphColor = new PinElement({
            background: "#c59a00",
            borderColor: "#c59a00",
          });
        }

        const marker = new AdvancedMarkerElement({
          map,
          content: pinGlyphColor.element,
          position: {
            lat: latNum,
            lng: lngNum,
          },
        });

        markers.value.push(marker);
      }
    };

    function setMapOnAll(map) {
      for (let i = 0; i < markers.value.length; i++) {
        markers.value[i].setMap(map);
      }
    }

    const hideMarkers = () => {
      setMapOnAll(null);
    };

    const showMarkers = () => {
      setMapOnAll(map);
    };

    const deleteMarkers = () => {
      const lastMarker = markers.value.pop();
      toRaw(lastMarker).setMap(null);
    };

    const distanceText = ref(null);
    distanceText.value = computed(() => {
      if (distance.value !== null) {
        return `Distance from your location to clicked location: ${distance.value.toFixed(
          2
        )} kilometers`;
      }
      return "";
    });

    return {
      addCircle,
      clearCircles,
      toggleDistance,
      toggleAddPin,
      addPin,
      hideMarkers,
      showMarkers,
      deleteMarkers,
      addPinActive,
      markers,
      distanceActive,
      distance,
      distanceText,
      clickedLocation,
      xaxis,
      yaxis,
      pTop,
    };
  },
};
</script>

<style>
#map {
  width: 100%;
}

.gm-style-iw-d {
  color: black;
}
</style>
