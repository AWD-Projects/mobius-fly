import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AircraftGalleryCard } from '../../components/organisms/AircraftGalleryCard';

const meta = {
  title: 'Organisms/AircraftGalleryCard',
  component: AircraftGalleryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AircraftGalleryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1525624286412-4099c83c1bc8?w=400&h=300&fit=crop',
];

export const Default: Story = {
  args: {
    images: sampleImages,
    additionalImagesCount: 4,
    onViewMore: () => alert('View more clicked!'),
  },
};

export const FewImages: Story = {
  args: {
    images: sampleImages.slice(0, 3),
    additionalImagesCount: 0,
  },
};

export const CustomButtonText: Story = {
  args: {
    images: sampleImages,
    additionalImagesCount: 8,
    buttonText: 'View 8 more images',
  },
};
