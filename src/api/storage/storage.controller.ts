export const uploadFile = async (req,res)=>{
    const file = req.file;
    console.log(file);
    res.send('file uploaded');
}