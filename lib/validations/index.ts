import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  );

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters');

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .refine(
    (url) => {
      try {
        const { protocol } = new URL(url);
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'URL must start with http:// or https://' }
  );

export const imageSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'Image must be less than 5MB'
  )
  .refine(
    (file) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(
        file.type
      ),
    'Only .jpg, .jpeg, .png, .webp, and .gif files are supported'
  );

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  subtitle: z.string().max(100, 'Subtitle must be at most 100 characters').optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(300).optional(),
  category: z.string().min(1, 'Category is required'),
  featuredImage: z.string().url('Invalid image URL').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  published: z.boolean().default(false),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  authorName: nameSchema,
  authorEmail: emailSchema,
});

export const userProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  bio: z.string().max(500).optional(),
  website: urlSchema.optional().or(z.literal('')),
  avatar: z.string().url('Invalid image URL').optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
});

export const settingsSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteDescription: z.string().max(300).optional(),
  siteUrl: urlSchema,
  postsPerPage: z.number().min(1).max(100).default(10),
  allowComments: z.boolean().default(true),
  allowRegistration: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
