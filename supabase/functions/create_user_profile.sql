-- Function to create a user profile
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email VARCHAR(255),
  p_name VARCHAR(255),
  p_role VARCHAR(50) DEFAULT 'user'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Insert the new user with all required fields
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_email,
    'external_auth', -- Placeholder since auth is handled by Supabase Auth
    p_name,
    p_role,
    true,
    NOW(),
    NOW()
  )
  RETURNING to_jsonb(users.*) INTO v_result;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', v_result
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;
