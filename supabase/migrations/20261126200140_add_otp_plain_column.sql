-- Dev-only convenience: stores the plain 6-digit OTP alongside its hash so
-- it can be read straight from the table while no email provider is wired
-- up. Drop this column before going to production.
alter table public.login_otps add column if not exists otp_plain text;
