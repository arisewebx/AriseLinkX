import supabase, {supabaseUrl} from "./supabase";

export async function getUrls(user_id) {
  let {data, error} = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function getUrl({id, user_id}) {
  const {data, error} = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function getLongUrl(id) {
  let {data: shortLinkData, error: shortLinkError} = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

export async function createUrl({title, longUrl, customUrl, user_id}, qrcode) {
  const short_url = Math.random().toString(36).substr(2, 6);
  const fileName = `qr-${short_url}`;

  const {error: storageError} = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const {data, error} = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

// export async function deleteUrl(id) {
//   const {data, error} = await supabase.from("urls").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Unable to delete Url");
//   }

//   return data;
// }
export async function deleteUrl(id) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error("User not authenticated");
  }

  const user_id = sessionData.session.user.id;

  // Delete related clicks first
  const { error: clicksError } = await supabase
    .from("clicks")
    .delete()
    .eq("url_id", id);

  if (clicksError) {
    console.error("Error deleting clicks:", clicksError);
    throw new Error("Unable to delete related click data");
  }

  // Now delete the URL
  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    console.error("Error deleting URL:", error);
    throw new Error("Unable to delete URL");
  }

  return data;
}

// New function to get ALL URLs for admin dashboard
export async function getAllUrls() {
  let {data, error} = await supabase
    .from("urls")
    .select("*");  // Remove the .eq("user_id", user_id) filter

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

// Alternative: Get URLs with user information for better admin insights
export async function getAllUrlsWithUsers() {
  let {data, error} = await supabase
    .from("urls")
    .select(`
      *,
      users:user_id (
        name,
        email
      )
    `);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs with user data");
  }

  return data;
}
