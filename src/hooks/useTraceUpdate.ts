import { useEffect, useRef } from "react";
import { AppLog, TAG } from "utils/Util";

interface ObjectDict {
  [index: string]: any;
}

export default (props: any, key?: string) => {
  const prev = useRef(props);
  AppLog.log(() => "in useTraceUpdate...", TAG.TRACE_UPDATE);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce(
      (lookup: ObjectDict, [_key, value]) => {
        if (prev.current[_key] !== value) {
          lookup[_key] = [prev.current[_key], value];
        }
        return lookup;
      },
      {}
    );

    AppLog.log(() => "---------------------------", TAG.TRACE_UPDATE);
    if (Object.keys(changedProps).length > 0) {
      const keys = Object.keys(changedProps);
      const values = Object.values(changedProps);

      if (key !== undefined) {
        AppLog.log(
          () => "Changed props of " + key + ": ",
          TAG.TRACE_UPDATE
        );
      } else {
        AppLog.log(() => "Changed props: ", TAG.TRACE_UPDATE);
      }

      keys.map((item, index) => {
        AppLog.log(
          () => item + " > " + JSON.stringify(values[index]) + key,
          TAG.TRACE_UPDATE
        );
      });
    } else {
      AppLog.log(() => "No props changed for " + key, key);
    }
    AppLog.log(() => "---------------------------", TAG.TRACE_UPDATE);

    prev.current = props;
  });
};
