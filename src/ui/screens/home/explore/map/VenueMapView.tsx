/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  Pressable
} from "react-native";
import Screen from "ui/components/atoms/Screen";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getVenuePin, Venue } from "models/Venue";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import { COLORS, SPACE } from "config";
import { requestMultiple, PERMISSIONS } from "react-native-permissions";
import usePermission from "ui/screens/auth/location_permission/usePermission";
import { Location } from "react-native-get-location";
import Refresh from "assets/images/refresh.svg";
import MapDialog from "ui/components/organisms/app_dialogs/MapDialog";
import MapView from "react-native-map-clustering";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import _ from "lodash";

type Props = {
  venues: Venue[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  openVenueDetail: (establishmentId: number) => void;
};

export const VenueMapView: FC<Props> = ({
  venues,
  isLoading,
  onRefresh,
  openVenueDetail
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [location, setLocation] = useState<Partial<Location>>({
    latitude: user?.latitude,
    longitude: user?.longitude
  });
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState<
    Venue[] | undefined
  >();
  const mapRef = useRef<any>(null);

  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);

  const _animateToRegion = (_location?: Location) => {
    mapRef.current.animateToRegion(
      {
        latitude: _location?.latitude,
        longitude: _location?.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      },
      500
    );
  };

  const onLocationGranted = (_location?: Location) => {
    setLocation(_.pick(_location, "latitude", "longitude"));
    _animateToRegion(_location);
  };

  const onLocationDenied = () => {};

  const { askPermission } = usePermission(
    onLocationGranted,
    onLocationDenied
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClusterClick = (markers: Marker[] | undefined) => {
    let data = markers?.map(function (obj: Marker) {
      return obj?.geometry?.coordinates;
    });

    let newData = venues?.filter(
      (venue: Venue) =>
        data?.find(
          (item) =>
            item[1] === venue.latitude && item[0] === venue.longitude
        ) !== undefined
    );

    setFilteredVenues(newData);
    setShouldShowPopup(true);
  };

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        ref={(ref) => {
          mapRef.current = ref;
        }}
        mapPadding={{
          left: 0,
          top: 60
        }}
        showsUserLocation={true}
        showsCompass={true}
        toolbarEnabled={false}
        showsMyLocationButton={true}
        userLocationCalloutEnabled={true}
        initialRegion={{
          latitude: location?.latitude ?? 52.705674,
          longitude: location?.longitude ?? -2.480438,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        }}
        onRegionChangeComplete={(region) => {
          //setLocation({
          //     latitude: region.latitude,
          //     longitude: region.longitude
          //   });
        }}
        clusterColor={COLORS.theme?.interface["900"]}
        spiderLineColor="#00000000"
        spiralEnabled={true}
        tracksViewChanges={true}
        preserveClusterPressBehavior={false}
        onClusterPress={(cluster, markers) => {
          // onClusterClick(markers);
        }}
        onMapReady={async () => {
          AppLog.log(() => "on map ready: " + venues?.length, TAG.API);

          await requestMultiple(
            Platform.OS === "android"
              ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
              : [
                  PERMISSIONS.IOS.LOCATION_ALWAYS,
                  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                ]
          )
            .then()
            .catch();

          askPermission();
        }}>
        {AppLog.log(
          () => "Rendering map gain: " + venues?.length,
          TAG.API
        )}
        {venues &&
          venues.map((marker: Venue, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              zIndex={1}
              image={{ uri: getVenuePin(marker) }}
              onPress={() => {
                openVenueDetail(marker.id);
              }}
            />
          ))}
      </MapView>

      <MapDialog
        isVisible={shouldShowPopup}
        hideSelf={hideSelf}
        venues={filteredVenues}
      />

      {isLoading ? (
        <View
          style={[
            styles.indicator,
            Platform.OS === "ios"
              ? styles.iOSRefreshIcon
              : styles.androidRefreshIcon
          ]}>
          <ActivityIndicator
            size="small"
            color={COLORS.theme!.interface["700"]}
          />
        </View>
      ) : (
        <Pressable
          style={[
            styles.indicator,
            Platform.OS === "ios"
              ? styles.iOSRefreshIcon
              : styles.androidRefreshIcon
          ]}
          onPress={onRefresh}>
          <View>
            <Refresh height={17} stroke={COLORS.theme!.interface["700"]} />
          </View>
        </Pressable>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  indicator: {
    position: "absolute",
    right: SPACE.md,
    backgroundColor: COLORS.white,
    padding: SPACE.sm,
    justifyContent: "center",
    alignItems: "center",
    ...shadowStyleProps,
    borderWidth: 0.5,
    shadowOpacity: 0.2,
    opacity: 0.9,
    borderColor: COLORS.theme?.interface["200"]
  },
  androidRefreshIcon: {
    bottom: 12,
    borderRadius: 10,
    width: 38,
    height: 38
  },
  iOSRefreshIcon: {
    top: 60,
    borderRadius: 25,
    width: 50,
    height: 50
  }
});
