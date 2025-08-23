export const projectValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    message: 'Title must be between 1 and 100 characters'
  },
  category: {
    required: true,
    enum: ['branding', 'poster', 'social', 'illustration'],
    message: 'Invalid category'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Description must be between 10 and 500 characters'
  },
  image: {
    required: true,
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
    message: 'Must be a valid image URL'
  }
};

export function validateProject(data: any) {
  const errors: { [key: string]: string } = {};

  Object.entries(projectValidationSchema).forEach(([field, rules]) => {
    const value = data[field];

    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
    }

    if (value && rules.enum && !rules.enum.includes(value)) {
      errors[field] = rules.message;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}