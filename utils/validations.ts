// utils/validation.ts

type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
  pattern?: RegExp;
  message: string;
};

type ProjectValidationSchema = {
  [key: string]: ValidationRule;
};

export const projectValidationSchema: ProjectValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    message: 'Title must be between 1 and 100 characters',
  },
  category: {
    required: true,
    enum: ['branding', 'poster', 'social', 'illustration'],
    message: 'Invalid category',
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Description must be between 10 and 500 characters',
  },
  image: {
    required: true,
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
    message: 'Must be a valid image URL',
  },
};
