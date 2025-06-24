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