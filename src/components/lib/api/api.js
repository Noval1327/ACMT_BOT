export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_APi_PATH}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error; // lempar lagi supaya bisa ditangkap di handleSubmit
  }
};

export const sendMessage = async (sessionID,inputUser) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APi_PATH}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionID,
        input: inputUser,
      }),
    });

    if (!response.ok) throw new Error("Gagal mendapat jawaban.");
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSessionID = async()=>{
  try{
    const response = await fetch(`${import.meta.env.VITE_APi_PATH}/new_session`,{
      method: "GET",
    })
    if (!response.ok) throw new Error("Gagal mendapatkan session id");
    const data = await response.json();
    return data.session_id;
  }
  catch(error){
    console.log(error)
    throw error;
  }
}
