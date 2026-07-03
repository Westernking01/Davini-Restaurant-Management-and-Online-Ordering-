-- Migration 002: OAuth Profile Standard Table and Self-Registration Policies

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own records during OAuth callback registration
CREATE POLICY "Customer insert own user record" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Customer insert own profile" ON customer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
