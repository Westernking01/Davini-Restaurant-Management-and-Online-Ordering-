-- Migration 002: Add 'SUCCESS' to payment_status_enum to align with payment service lifecycle.
ALTER TYPE payment_status_enum ADD VALUE IF NOT EXISTS 'SUCCESS';
