-- Add user_type column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('hire', 'offer'));

-- Update existing profiles to have a default user_type
UPDATE user_profiles
SET user_type = 'hire'
WHERE user_type IS NULL;

-- Make user_type NOT NULL after setting defaults
ALTER TABLE user_profiles
ALTER COLUMN user_type SET NOT NULL;

-- Add an index for faster queries by user_type
CREATE INDEX IF NOT EXISTS user_profiles_user_type_idx ON user_profiles(user_type); 