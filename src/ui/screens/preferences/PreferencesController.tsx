import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import PreferencesView from "ui/screens/preferences/PreferencesView";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import EPreferencesScreenUseCase, {
  getProperty
} from "models/enums/EPreferencesScreenUseCase";
import { useGeneralApis } from "repo/general/GeneralApis";
import Preference from "models/Preference";
import { useAuthApis } from "repo/auth/AuthApis";
import SimpleToast from "react-native-simple-toast";
import { SPACE, STRINGS } from "config";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setUser } from "stores/authSlice";
import { RootState } from "stores/store";
import Cross from "assets/images/ic_cross.svg";
import { AuthStackParamList } from "routes";
import { usePreventDoubleTap } from "hooks";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { setPreferenceIds } from "stores/generalSlice";
import { AppLog, TAG } from "utils/Util";

type PreferencesScreenProps = RouteProp<HomeStackParamList, "Preferences">;
type PreferencesNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Preferences"
>;

type AuthNavigationProps = StackNavigationProp<
  AuthStackParamList,
  "Preferences"
>;

type Props = {};

const PreferencesController: FC<Props> = () => {
  const navigation = useNavigation<PreferencesNavigationProp>();
  const authNavigation = useNavigation<AuthNavigationProps>();
  const route = useRoute<PreferencesScreenProps>();

  const {
    request: getPreferencesRequest,
    loading,
    error
  } = useGeneralApis().getPreferences;
  const {
    request: setUserPreferencesRequest,
    loading: updatingPreferences
  } = useAuthApis().setUserPreferences;

  const [preferences, setPreferences] = useState<
    Preference[] | undefined
  >();
  const { preferenceIds } = useAppSelector(
    (state: RootState) => state.general
  );
  const [initialSelectedIds, setInitialSelectedIds] = useState<number[]>(
    route.params.useCase === EPreferencesScreenUseCase.FILTER
      ? preferenceIds
      : route.params.selectedIds ?? []
  );
  const _newSelectedIds = useRef<number[]>([]);

  const useCase = route.params.useCase;

  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const getPreferences = useCallback(async () => {
    const { hasError, errorBody, dataBody } = await getPreferencesRequest({
      pagination: false
    });
    if (hasError || dataBody === undefined) {
      throw new Error(errorBody);
    } else {
      setPreferences(dataBody.data);
      if (useCase !== EPreferencesScreenUseCase.FILTER) {
        const userPreferenceIds = dataBody.data
          .filter((value) => value.is_user_interested)
          .map((value1) => value1.id);
        setInitialSelectedIds(userPreferenceIds);
        _newSelectedIds.current = userPreferenceIds;
      }
    }
  }, [getPreferencesRequest, useCase]);

  const setUserPreferences = useCallback(async () => {
    const { hasError, errorBody, dataBody } =
      await setUserPreferencesRequest({ ids: _newSelectedIds.current });
    if (hasError || dataBody === undefined) {
      throw new Error(errorBody);
    } else {
      if (useCase === EPreferencesScreenUseCase.SET_USER_PREFERENCES) {
        if (user) {
          let updatedUser = { ...user };
          updatedUser!.is_interest_selected = true;

          if (!updatedUser.is_location_updated) {
            dispatch(setUser(updatedUser));
            authNavigation.reset({
              index: 0,
              routes: [{ name: "LocationPermission" }]
            });
          } else {
            //set user nad open main screen
            dispatch(setUser(updatedUser));
          }
        }
      } else {
        SimpleToast.show(dataBody.message);
        navigation.goBack();
      }
    }
  }, [
    setUserPreferencesRequest,
    useCase,
    user,
    authNavigation,
    dispatch,
    navigation
  ]);

  const onButtonPressed = usePreventDoubleTap(
    useCallback(() => {
      switch (useCase) {
        case EPreferencesScreenUseCase.FILTER:
          AppLog.log(() => "EPreferencesScreenUseCase.FILTER", TAG.SEARCH);
          dispatch(setPreferenceIds(_newSelectedIds.current));
          route.params.onPreferencesSelected?.(_newSelectedIds.current);
          navigation.goBack();
          break;
        case EPreferencesScreenUseCase.SET_USER_PREFERENCES:
        case EPreferencesScreenUseCase.UPDATE_USER_PREFERENCES:
          if (_newSelectedIds.current.length > 0) {
            AppLog.log(
              () => "EPreferencesScreenUseCase.UPDATE_USER_PREFERENCES",
              TAG.SEARCH
            );
            setUserPreferences();
          } else {
            SimpleToast.show(STRINGS.preferences.error_min_1);
          }
          break;
      }
    }, [useCase, navigation, route.params, setUserPreferences, dispatch])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={getProperty(useCase).title}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => {
        if (useCase !== EPreferencesScreenUseCase.SET_USER_PREFERENCES) {
          return (
            <HeaderLeftTextWithIcon
              onPress={() => navigation.pop()}
              icon={() => (
                <Cross width={20} height={20} fill={"#737373"} />
              )}
            />
          );
        } else {
          return null;
        }
      },
      headerRight: () => {
        if (useCase !== EPreferencesScreenUseCase.SET_USER_PREFERENCES) {
          return (
            <LinkButton
              textType={TEXT_TYPE.SEMI_BOLD}
              numberOfLines={0}
              text={"Clear"}
              viewStyle={{ marginEnd: SPACE.xs }}
              onPress={() => {
                setInitialSelectedIds([]);
                _newSelectedIds.current = [];
              }}
            />
          );
        } else {
          return null;
        }
      }
    });
  }, [navigation, useCase, updatingPreferences, onButtonPressed]);

  const onSelectionChange = useCallback((selectedIds: number[]) => {
    _newSelectedIds.current = selectedIds;
  }, []);

  useEffect(() => {
    getPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PreferencesView
      preferences={preferences}
      selectedIds={initialSelectedIds}
      isLoading={loading}
      error={error}
      onSelectionChange={onSelectionChange}
      onButtonPressed={onButtonPressed}
      shouldShowProgressBar={updatingPreferences}
    />
  );
};

export default PreferencesController;
