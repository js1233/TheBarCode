import { StackNavigationOptions } from "@react-navigation/stack";

function create(): Partial<StackNavigationOptions> {
  return {
    headerShown: false
  };
}

export default { create };
