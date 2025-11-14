// src/utils/validation.ts
import { z } from 'zod';

// Schéma Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Schéma Signup
export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z
    .string()
    .min(1, 'Veuillez confirmer le mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Types TypeScript générés automatiquement
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Schéma Address (pour checkout)
export const addressSchema = z.object({
  label: z.string().min(1, 'Le libellé est requis'),
  street: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z
    .string()
    .min(1, 'Le code postal est requis')
    .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  country: z.string().min(1, 'Le pays est requis'),
});

export type AddressFormData = z.infer<typeof addressSchema>;