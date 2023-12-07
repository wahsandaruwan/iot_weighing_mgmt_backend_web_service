// ----------Controller function to save file to storage----------
const SaveFile = async (req, res) => {
  // Access file
  const file = req.file;

  // Check if file exists in the request
  if (!file) {
    return res.status(404).json({
      status: false,
      error: {
        message: "There is no any uploaded file!",
      },
    });
  }

  res.status(200).json({
    status: true,
    success: {
      message: "Successfully uploaded the file!",
    },
    fileName: file.filename,
  });
};

module.exports = {
  SaveFile,
};
