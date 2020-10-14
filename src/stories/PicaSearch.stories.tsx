import React from 'react';
import { Story, Meta } from '@storybook/react';
import { PicaSearch, PicaSearchProps } from '../components/PicaSearch';

export default {
  title: 'PicaSearch',
  component: PicaSearch,
} as Meta;

const Template: Story<PicaSearchProps> = (args) => <PicaSearch {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  pixabayApiUrl: '/api?key=13417145-d0c367819415b077de5e950e3',
};
