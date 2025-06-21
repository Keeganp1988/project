import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  CircleMain: undefined;
  CreateCircle: undefined;
  JoinCircle: undefined;
  Map: undefined;
  Settings: undefined;
};

export type RootTabParamList = {
  Map: undefined;
  Circle: NavigatorScreenParams<RootStackParamList>;
  Settings: undefined;
};