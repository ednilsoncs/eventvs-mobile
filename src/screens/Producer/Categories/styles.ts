import styled from 'styled-components/native';
import { Button } from 'react-native-paper';

export const Container = styled.View`
  height: 100%;
`;

export const ButtonContainer = styled.View`
  margin-top: 16px;
`;

export const Header = styled.View`
  margin: 16px;
`;

export const Title = styled.Text`
  font-size: 40px;
  align-self: center;
  font-weight: bold;
`;

export const Wrapper = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 16,
    margin: 16,
  },
}))``;

export const Buttons = styled(Button).attrs(() => ({
  mode: 'contained',
}))``;
