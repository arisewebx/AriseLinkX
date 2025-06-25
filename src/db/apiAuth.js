import supabase, {supabaseUrl} from "./supabase";

export async function login({email, password}) {
   const {data,error} = await supabase.auth.signInWithPassword({
        email,
        password,
     })
     if (error) throw new Error(error.message)
        return data
}

export async function signup({name, email, password, profilepic}) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  const {error: storageError} = await supabase.storage
    .from("profilepic")
    .upload(fileName, profilepic);

  if (storageError) throw new Error(storageError.message);

  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profilepic: `${supabaseUrl}/storage/v1/object/public/profilepic/${fileName}`,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}


export async function getCurrentUser() {
   const {data:session,error} = await supabase.auth.getSession()
  if(!session.session) return null
  if(error) throw new Error(error.message)
   return session.session?.user
}

export async function logout() {
 const {} =await supabase.auth.signOut();
  if(error) throw new Error(error.message)
 
}


export async function updateUser(userData) {
  const { data, error } = await supabase.auth.updateUser({
    data: userData
  });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserProfile({name}) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: name,
      full_name: name
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function loginWithGoogle() {
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });

  if (error) throw new Error(error.message);
  return data;
}

// Your supabase client

// Function to handle password reset with just access token (when refresh token is missing)
// export const setPasswordResetSession = async (accessToken, refreshToken) => {
//   try {
//     // If refresh token is missing, try a different approach
//     if (!refreshToken) {
//       console.log('Refresh token missing, using alternative method...');
      
//       // Method 1: Try to update password directly with access token
//       const { data, error } = await supabase.auth.updateUser(
//         { password: null }, // This will fail but establish session
//         { 
//           accessToken: accessToken 
//         }
//       );
      
//       // Even if this fails, it might set the session
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
      
//       if (user) {
//         console.log('Session established successfully');
//         return { data: { user }, error: null };
//       }
      
//       // Method 2: Manual session setup
//       return { data: null, error: new Error('refresh_token_missing') };
//     }

//     // Original method when refresh token is present
//     const { data, error } = await supabase.auth.setSession({
//       access_token: accessToken,
//       refresh_token: refreshToken,
//     });

//     if (error) {
//       console.error('Session error details:', error);
//       throw error;
//     }
    
//     // Verify the session was set correctly
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
    
//     if (userError || !user) {
//       throw new Error('Failed to authenticate with reset token');
//     }

//     console.log('Session set successfully for user:', user.email);
//     return { data, error: null };
//   } catch (error) {
//     console.error('setPasswordResetSession error:', error);
//     return { data: null, error };
//   }
// };

// // Alternative direct password update function for when session setting fails
// export const updatePasswordDirect = async (newPassword, accessToken) => {
//   try {
//     // Create a temporary supabase client with the access token
//     const { createClient } = await import('@supabase/supabase-js');
    
//     // Use your existing supabase config but with the access token
//     const response = await fetch(`${supabase.supabaseUrl}/auth/v1/user`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`,
//         'apikey': supabase.supabaseKey
//       },
//       body: JSON.stringify({
//         password: newPassword
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to update password');
//     }

//     const data = await response.json();
//     return { data, error: null };
//   } catch (error) {
//     console.error('Direct password update error:', error);
//     return { data: null, error };
//   }
// };

// // Function to send password reset email
// export const resetPassword = async (email) => {
//   try {
//     // Check if we're in development (Vite usually uses port 5173, CRA uses 3000)
//     const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
//     let redirectUrl;
//     if (isDev) {
//       // Use the current localhost port (whether 3000, 5173, or other)
//       redirectUrl = `${window.location.origin}/reset-password`;
//     } else {
//       // For production
//       redirectUrl = `${window.location.origin}/reset-password`;
//     }
    
//     console.log('Redirect URL:', redirectUrl); // For debugging
    
//     const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: redirectUrl,
//     });

//     if (error) throw error;
    
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error };
//   }
// };

// // Function to update password (used after user clicks email link)
// export const updatePassword = async (newPassword) => {
//   try {
//     // First check if user is authenticated
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
    
//     if (userError || !user) {
//       throw new Error('You must be logged in to update your password. Please try the reset link again.');
//     }

//     const { data, error } = await supabase.auth.updateUser({
//       password: newPassword
//     });

//     if (error) throw error;
    
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error };
//   }
// };