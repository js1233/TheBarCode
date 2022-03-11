// import React, {
//   Dispatch,
//   FC,
//   SetStateAction,
//   useCallback,
//   useRef,
//   useState
// } from "react";
//
// type AppDataContextType = {
//   notificationCount?: NotificationCount;
//   setNotificationCount: Dispatch<
//     SetStateAction<NotificationCount | undefined>
//   >;
//   addListenerOnResetData: (listener: () => void) => void;
//   removeListenerOnResetData: (listener: () => void) => void;
//   resetData: () => void;
// };
//
// type NotificationCount = {
//   notificationCount: number;
//   venueId: number;
// };
//
// export const AppDataContext = React.createContext<AppDataContextType>(
//   // @ts-ignore
//   {}
// );
//
// const AppDataProvider: FC = (props) => {
//   const [notificationCount, setNotificationCount] = useState<
//     NotificationCount | undefined
//   >(undefined);
//
//   const listenersRef = useRef<Array<() => void>>([]);
//   const addListenerOnResetData = useCallback((listener: () => void) => {
//     listenersRef.current.push(listener);
//   }, []);
//   const removeListenerOnResetData = useCallback((listener: () => void) => {
//     listenersRef.current = listenersRef.current.filter(
//       (value) => value !== listener
//     );
//   }, []);
//   const resetData = useCallback(() => {
//     listenersRef.current.forEach((cb) => cb());
//   }, []);
//
//   return (
//     <AppDataContext.Provider
//       value={{
//         notificationCount,
//         addListenerOnResetData,
//         removeListenerOnResetData,
//         resetData
//       }}>
//       {props.children}
//     </AppDataContext.Provider>
//   );
// };
//
// export default AppDataProvider;
